import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Cpu, RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface OpenAIModel {
  id: string;
  object: string;
  created?: number;
  owned_by: string;
}

interface ModelsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModelsManagerModal: React.FC<ModelsManagerModalProps> = ({ isOpen, onClose }) => {
  const [models, setModels] = useState<OpenAIModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const testOpenAIConnection = async () => {
    setLoading(true);
    try {
      console.log('Testing OpenAI connection via Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('get-openai-models', {
        body: { action: 'test' }
      });

      if (error) {
        console.error('Edge function error:', error);
        setConnectionStatus('error');
        toast.error(`Connection test failed: ${error.message}`);
        return;
      }

      console.log('Edge function response:', data);

      // Access the nested data structure correctly
      if (data?.data && data.data.connectionStatus === 'connected') {
        setConnectionStatus('connected');
        toast.success('OpenAI connection successful!');
        console.log('OpenAI connection test successful:', data.data);
      } else {
        setConnectionStatus('error');
        const errorMessage = data?.data?.error || data?.error || 'Unknown error';
        toast.error(`Connection test failed: ${errorMessage}`);
        console.error('OpenAI connection test failed:', errorMessage);
      }
    } catch (error: any) {
      console.error('Connection test error:', error);
      setConnectionStatus('error');
      toast.error('Failed to test OpenAI connection');
    } finally {
      setLoading(false);
    }
  };

  const fetchModels = async () => {
    setLoading(true);
    try {
      console.log('Fetching OpenAI models...');
      
      const { data, error } = await supabase.functions.invoke('get-openai-models', {
        body: { action: 'list' }
      });

      if (error) {
        console.error('Edge function error:', error);
        toast.error(`Failed to fetch models: ${error.message}`);
        return;
      }

      console.log('Models response:', data);

      // Access the nested data structure correctly
      if (data?.data?.models) {
        setModels(data.data.models);
        toast.success(`Successfully fetched ${data.data.models.length} models`);
        console.log('Models fetched successfully:', data.data.models.length);
      } else {
        const errorMessage = data?.data?.error || data?.error || 'No models found in response';
        toast.error(`Failed to fetch models: ${errorMessage}`);
        console.error('Failed to fetch models:', errorMessage);
      }
    } catch (error: any) {
      console.error('Error fetching models:', error);
      toast.error('Failed to fetch models');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      testOpenAIConnection();
    }
  }, [isOpen]);

  const getModelCategory = (modelId: string) => {
    if (modelId.includes('gpt-4')) return 'GPT-4';
    if (modelId.includes('gpt-3.5')) return 'GPT-3.5';
    if (modelId.includes('dall-e')) return 'DALL-E';
    if (modelId.includes('whisper')) return 'Whisper';
    if (modelId.includes('tts')) return 'TTS';
    if (modelId.includes('embedding')) return 'Embeddings';
    return 'Other';
  };

  const getModelBadgeVariant = (category: string) => {
    switch (category) {
      case 'GPT-4': return 'default';
      case 'GPT-3.5': return 'secondary';
      case 'DALL-E': return 'outline';
      default: return 'outline';
    }
  };

  const formatCreatedDate = (created?: number) => {
    if (!created) return 'Unknown';
    try {
      return new Date(created * 1000).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const groupedModels = models.reduce((acc, model) => {
    const category = getModelCategory(model.id);
    if (!acc[category]) acc[category] = [];
    acc[category].push(model);
    return acc;
  }, {} as Record<string, OpenAIModel[]>);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-purple-600" />
            OpenAI Models Manager
            {connectionStatus === 'connected' && <CheckCircle className="w-4 h-4 text-green-500" />}
            {connectionStatus === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={testOpenAIConnection}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Test Connection
              </Button>
              
              <Button
                onClick={fetchModels}
                disabled={loading || connectionStatus !== 'connected'}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Fetch Models
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Models: {models.length}
              </span>
              {diagnostics.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDiagnostics(!showDiagnostics)}
                  className="flex items-center gap-1"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Diagnostics ({diagnostics.length})
                </Button>
              )}
            </div>
          </div>

          {/* Connection Status Alert */}
          {connectionStatus === 'connected' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                OpenAI API connection is working correctly. You can now fetch and manage models.
              </AlertDescription>
            </Alert>
          )}

          {connectionStatus === 'error' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                OpenAI API connection failed. Please check your API key configuration and try again.
              </AlertDescription>
            </Alert>
          )}

          {/* Diagnostics Panel */}
          {showDiagnostics && diagnostics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Diagnostic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-3 rounded text-xs max-h-40 overflow-y-auto">
                  <pre>{JSON.stringify(diagnostics, null, 2)}</pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Models Grid */}
          {models.length > 0 && (
            <div className="space-y-6">
              {Object.entries(groupedModels).map(([category, categoryModels]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    {category}
                    <Badge variant="outline">{categoryModels.length}</Badge>
                  </h3>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryModels.map((model) => (
                      <Card key={model.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-sm font-mono">
                              {model.id}
                            </CardTitle>
                            <Badge variant={getModelBadgeVariant(category)}>
                              {category}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="text-xs text-gray-600">
                            <div>Owner: {model.owned_by}</div>
                            <div>Created: {formatCreatedDate(model.created)}</div>
                            <div>Type: {model.object}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Models Message */}
          {models.length === 0 && !loading && connectionStatus === 'connected' && (
            <div className="text-center py-8">
              <Cpu className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No models found</h3>
              <p className="text-gray-600 mb-4">
                Click "Fetch Models" to load available OpenAI models.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModelsManagerModal;
