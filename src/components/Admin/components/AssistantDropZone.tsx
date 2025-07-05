
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Upload, FileJson, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { openaiAssistantsService } from '@/services/openaiAssistantsService';

interface AssistantConfig {
  name: string;
  description?: string;
  instructions: string;
  model: string;
  temperature?: number;
  top_p?: number;
  tools?: any[];
  metadata?: Record<string, any>;
}

// Transform tools from string format to object format for OpenAI API
const transformTools = (tools: any[]): any[] => {
  if (!tools || !Array.isArray(tools)) {
    return [];
  }

  return tools.map(tool => {
    if (typeof tool === 'string') {
      // Convert string tools to proper OpenAI format
      switch (tool.toLowerCase()) {
        case 'code_interpreter':
          return { type: 'code_interpreter' };
        case 'retrieval':
        case 'file_search':
          return { type: 'file_search' };
        case 'function':
          console.warn('Function tool specified as string - needs proper function definition');
          return { type: 'function', function: { name: 'placeholder', description: 'Function needs proper definition' } };
        default:
          console.warn(`Unknown tool type: ${tool}`);
          return { type: tool };
      }
    }
    return tool; // Already in object format
  });
};

interface AssistantDropZoneProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const AssistantDropZone: React.FC<AssistantDropZoneProps> = ({ onSuccess, onCancel }) => {
  const [uploading, setUploading] = useState(false);
  const [parsedData, setParsedData] = useState<AssistantConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateAssistantConfig = (config: any): config is AssistantConfig => {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid JSON structure');
    }

    if (!config.name || typeof config.name !== 'string') {
      throw new Error('Missing required field: name');
    }

    if (!config.instructions || typeof config.instructions !== 'string') {
      throw new Error('Missing required field: instructions');
    }

    if (!config.model || typeof config.model !== 'string') {
      throw new Error('Missing required field: model');
    }

    return true;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    if (!file.name.endsWith('.assistant.json') && !file.name.endsWith('.json')) {
      setError('Please upload a .assistant.json file');
      toast.error('Invalid file type. Please upload a .assistant.json file');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const text = await file.text();
      const config = JSON.parse(text);

      validateAssistantConfig(config);
      setParsedData(config);
      
      toast.success('Assistant configuration parsed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse JSON file';
      setError(errorMessage);
      toast.error(`Invalid assistant file: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleCreateAssistant = async () => {
    if (!parsedData) return;

    setUploading(true);
    try {
      console.log('🚀 Starting assistant creation process...');
      toast.info('Creating assistant...');
      
      // Transform tools format before sending to API
      const processedData = {
        ...parsedData,
        tools: transformTools(parsedData.tools || [])
      };
      
      console.log('📝 Processed assistant data:', processedData);
      
      // Create assistant via OpenAI API
      const createdAssistant = await openaiAssistantsService.createAssistant(processedData);
      
      console.log('✅ Assistant created successfully:', createdAssistant);
      toast.success(`✅ Assistant "${parsedData.name}" created and synced successfully`);
      
      // Force a small delay to ensure the assistant is fully processed
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } catch (error: any) {
      console.error('❌ Failed to create assistant:', error);
      
      // Enhanced error logging and reporting
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      
      // Check for specific error types
      if (errorMessage.includes('Edge Function returned a non-2xx status code')) {
        errorMessage = 'OpenAI API configuration error. Please check your API key and settings.';
        console.error('🔧 Suggestion: Verify OPENAI_API_KEY is set correctly in Edge Function secrets');
      }
      
      if (errorMessage.includes('tools')) {
        errorMessage = 'Invalid tools format. Please check the tools configuration in your JSON file.';
        console.error('🔧 Tools should be an array of objects with "type" property');
      }
      
      if (errorMessage.includes('fetch') || errorMessage.includes('NetworkError')) {
        errorMessage = 'Network connection error. Please try again.';
      }
      
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
        errorMessage = 'OpenAI API key is invalid or missing. Please check your API key configuration.';
      }
      
      if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        errorMessage = 'OpenAI API access denied. Please check your API key permissions.';
      }
      
      if (errorMessage.includes('timeout')) {
        errorMessage = 'Request timeout. Please try again or check your connection.';
      }
      
      toast.error(`Failed to create assistant: ${errorMessage}`);
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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Import Assistant Configuration</h3>
        <p className="text-sm text-gray-600">
          Drop your .assistant.json file here to automatically create and sync with OpenAI
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
                  ? 'border-purple-500 bg-purple-50' 
                  : error 
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
              } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
            >
              <CardContent className="text-center p-8">
                <input {...getInputProps()} />
                
                <div className="flex flex-col items-center space-y-4">
                  {uploading ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                  ) : error ? (
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                  ) : (
                    <Upload className="w-12 h-12 text-gray-400" />
                  )}
                  
                  <div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {uploading ? 'Processing file...' : 'Drop your .assistant.json file here'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {uploading ? 'Parsing configuration...' : 'Or click to browse and select a file'}
                    </p>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  )}

                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <FileJson className="w-4 h-4" />
                    <span>Supports .assistant.json files</span>
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
                    <h4 className="font-medium text-green-900">Configuration Parsed Successfully</h4>
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

                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <p className="text-gray-900">{parsedData.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Model:</span>
                      <p className="text-gray-900">{parsedData.model}</p>
                    </div>
                  </div>
                  
                  {parsedData.description && (
                    <div>
                      <span className="font-medium text-gray-700">Description:</span>
                      <p className="text-gray-900">{parsedData.description}</p>
                    </div>
                  )}
                  
                  <div>
                    <span className="font-medium text-gray-700">Instructions Preview:</span>
                    <p className="text-gray-900 text-xs bg-white p-2 rounded border max-h-20 overflow-y-auto">
                      {parsedData.instructions.length > 200 
                        ? `${parsedData.instructions.substring(0, 200)}...` 
                        : parsedData.instructions}
                    </p>
                  </div>

                  {parsedData.temperature && (
                    <div>
                      <span className="font-medium text-gray-700">Temperature:</span>
                      <p className="text-gray-900">{parsedData.temperature}</p>
                    </div>
                  )}
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
          onClick={handleCreateAssistant}
          disabled={!parsedData || uploading}
          className="flex items-center space-x-2"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Creating...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>Create Assistant</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
