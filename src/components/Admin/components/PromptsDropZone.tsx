import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Upload, FileJson, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { PromptsFile } from '../types/AssistantsTypes';

// Import Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface PromptConfig {
  title: string;
  description?: string;
  content: string;
  category?: string;
  tags?: string[];
  is_template?: boolean;
  is_public?: boolean;
}

interface PromptsDropZoneProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const PromptsDropZone: React.FC<PromptsDropZoneProps> = ({ onSuccess, onCancel }) => {
  const [uploading, setUploading] = useState(false);
  const [parsedData, setParsedData] = useState<PromptsFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validatePromptsFile = (data: any): data is PromptsFile => {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid JSON structure');
    }

    if (!data.prompts || !Array.isArray(data.prompts)) {
      throw new Error('Missing or invalid "prompts" array');
    }

    if (data.prompts.length === 0) {
      throw new Error('Prompts array is empty');
    }

    // Validate each prompt
    data.prompts.forEach((prompt: any, index: number) => {
      if (!prompt.title || typeof prompt.title !== 'string') {
        throw new Error(`Prompt ${index + 1}: Missing required field "title"`);
      }
      if (!prompt.content || typeof prompt.content !== 'string') {
        throw new Error(`Prompt ${index + 1}: Missing required field "content"`);
      }
    });

    return true;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    if (!file.name.endsWith('.prompts.json') && !file.name.endsWith('.json')) {
      setError('Please upload a .prompts.json file');
      toast.error('Invalid file type. Please upload a .prompts.json file');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      validatePromptsFile(data);
      setParsedData(data);
      
      toast.success(`Successfully parsed ${data.prompts.length} prompts`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse JSON file';
      setError(errorMessage);
      toast.error(`Invalid prompts file: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleImportPrompts = async () => {
    if (!parsedData) return;

    setUploading(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      console.log('🚀 Starting prompts import process...');
      toast.info(`Importing ${parsedData.prompts.length} prompts...`);
      
      // Create sync operation record
      const { data: syncOp, error: syncOpError } = await supabase
        .from('openai_sync_operations')
        .insert({
          operation_type: 'sync_prompts',
          status: 'running',
          started_at: new Date().toISOString(),
          operation_details: { 
            service: 'openai_prompts',
            source: 'import',
            total_prompts: parsedData.prompts.length
          }
        })
        .select()
        .single();

      if (syncOpError) {
        throw new Error(`Failed to create sync operation: ${syncOpError.message}`);
      }

      // Process each prompt
      for (const prompt of parsedData.prompts) {
        try {
          // 1. First store the prompt in the database with local source
          const promptData = {
            title: prompt.title,
            description: prompt.description || '',
            content: prompt.content,
            category: prompt.category || 'general',
            tags: prompt.tags || [],
            is_template: prompt.is_template || false,
            is_public: prompt.is_public || false,
            usage_count: 0,
            rating: 0,
            openai_source: 'local', // Start as local
            openai_synced_at: null,
            openai_assistant_id: null
          };

          console.log(`📝 Importing prompt: "${prompt.title}"`);

          const { data: savedPrompt, error: dbError } = await supabase
            .from('prompts')
            .insert([promptData])
            .select()
            .single();

          if (dbError) {
            console.error(`❌ Failed to import prompt "${prompt.title}":`, dbError);
            errorCount++;
            continue;
          }

          // 2. Create OpenAI assistant
          try {
            const response = await fetch(`${SUPABASE_URL}/functions/v1/openai-prompts-sync`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'create_assistant',
                prompt: {
                  ...savedPrompt,
                  metadata: {
                    source: 'ofspace_studio',
                    imported: true,
                    import_version: parsedData.metadata?.version || '1.0',
                    category: prompt.category,
                    tags: prompt.tags?.join(',') || ''
                  }
                }
              })
            });

            if (!response.ok) {
              throw new Error(`OpenAI sync failed: ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.data?.assistant_id) {
              // Update prompt with OpenAI assistant ID and mark as synced
              await supabase
                .from('prompts')
                .update({
                  openai_assistant_id: result.data.assistant_id,
                  openai_source: 'synced',
                  openai_synced_at: new Date().toISOString()
                })
                .eq('id', savedPrompt.id);

              console.log(`✅ Successfully imported and synced: "${prompt.title}"`);
              successCount++;
            } else {
              throw new Error('No assistant ID returned from OpenAI');
            }
          } catch (openaiError: any) {
            console.error(`⚠️ OpenAI sync failed for "${prompt.title}":`, openaiError);
            // Keep the prompt in local state since it was saved successfully
            successCount++;
          }
        } catch (promptError: any) {
          console.error(`❌ Error importing prompt "${prompt.title}":`, promptError);
          errorCount++;
        }
      }

      // Update sync operation status
      await supabase
        .from('openai_sync_operations')
        .update({
          status: errorCount === parsedData.prompts.length ? 'failed' : 'completed',
          completed_at: new Date().toISOString(),
          items_processed: parsedData.prompts.length,
          items_synced: successCount,
          error_count: errorCount
        })
        .eq('id', syncOp.id);

      if (successCount > 0) {
        toast.success(`✅ ${successCount} prompts imported successfully`);
        if (successCount !== parsedData.prompts.length) {
          toast.warning(`⚠️ ${errorCount} prompts failed to import`);
        }
      } else {
        toast.error(`❌ Failed to import any prompts`);
      }

      if (successCount > 0) {
        // Force a small delay to ensure all prompts are fully processed
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (error: any) {
      console.error('❌ Failed to import prompts:', error);
      toast.error(`Failed to import prompts: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json']
    },
    maxFiles: 1,
    disabled: uploading || !!parsedData
  });

  const resetState = () => {
    setParsedData(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Prompts Collection</h3>
        <p className="text-sm text-gray-600">
          Drop your .prompts.json file here to automatically import all prompts
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!parsedData ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card
              {...getRootProps()}
              className={`border-2 border-dashed transition-colors cursor-pointer min-h-[200px] flex items-center justify-center ${
                isDragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : error 
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
            >
              <CardContent className="text-center p-8">
                <input {...getInputProps()} />
                
                <div className="flex flex-col items-center space-y-4">
                  {uploading ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  ) : error ? (
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                  ) : (
                    <Upload className="w-12 h-12 text-gray-400" />
                  )}
                  
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {uploading ? 'Processing file...' : 'Drop your .prompts.json file here'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {uploading ? 'Parsing prompts collection...' : 'Or click to browse and select a file'}
                    </p>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <FileJson className="w-4 h-4" />
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">JSON</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-green-900">
                      {parsedData.prompts.length} Prompts Ready to Import
                    </h4>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetState}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {parsedData.metadata && (
                  <div className="mb-4 p-3 bg-white rounded border">
                    <h5 className="font-medium text-gray-700 mb-2">Collection Metadata:</h5>
                    <div className="text-sm space-y-1">
                      {parsedData.metadata.description && (
                        <p><span className="font-medium">Description:</span> {parsedData.metadata.description}</p>
                      )}
                      {parsedData.metadata.version && (
                        <p><span className="font-medium">Version:</span> {parsedData.metadata.version}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h5 className="font-medium text-gray-700">Prompts Preview:</h5>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {parsedData.prompts.slice(0, 5).map((prompt, index) => (
                      <div key={index} className="p-3 bg-white rounded border">
                        <div className="flex items-start justify-between mb-2">
                          <h6 className="font-medium text-gray-900">{prompt.title}</h6>
                          <div className="flex space-x-1">
                            {prompt.category && (
                              <Badge variant="outline" className="text-xs">
                                {prompt.category}
                              </Badge>
                            )}
                            {prompt.is_template && (
                              <Badge variant="secondary" className="text-xs">
                                Template
                              </Badge>
                            )}
                          </div>
                        </div>
                        {prompt.description && (
                          <p className="text-sm text-gray-600 mb-2">{prompt.description}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {prompt.content.length > 100 
                            ? `${prompt.content.substring(0, 100)}...` 
                            : prompt.content}
                        </p>
                        {prompt.tags && prompt.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {prompt.tags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {parsedData.prompts.length > 5 && (
                      <div className="text-center text-sm text-gray-500 py-2">
                        ... and {parsedData.prompts.length - 5} more prompts
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleImportPrompts}
          disabled={!parsedData || uploading}
          className="flex items-center space-x-2"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Importing...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Import {parsedData?.prompts.length || 0} Prompts</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};