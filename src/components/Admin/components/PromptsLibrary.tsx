import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FileText, Plus, Edit, Trash2, Copy, Star, Tag, Eye, AlertCircle, RefreshCw, Cloud, CloudOff, History, Bot, Bug, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Prompt, OpenAISyncOperation } from '../types/AssistantsTypes';
import { openaiPromptsService } from '@/services/openaiPromptsService';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useDiagnosticLogs } from '@/hooks/useDiagnosticLogs';
import { DiagnosticLogsDialog } from './DiagnosticLogsDialog';

// Import Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced error logging utility
const logError = (context: string, error: any) => {
  console.error(`[PromptsLibrary] ${context}:`, error);
  if (error?.message) console.error('Error message:', error.message);
  if (error?.details) console.error('Error details:', error.details);
  if (error?.hint) console.error('Error hint:', error.hint);
};

// Transform database row to Prompt interface
const transformPrompt = (row: any): Prompt => {
  return {
    id: row.id,
    title: row.title || '',
    description: row.description || '',
    content: row.content || '',
    category: row.category || 'general',
    tags: Array.isArray(row.tags) ? row.tags : [],
    is_template: Boolean(row.is_template),
    is_public: Boolean(row.is_public),
    usage_count: Number(row.usage_count) || 0,
    rating: Number(row.rating) || 0,
    created_by: row.created_by || '',
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
    openai_assistant_id: row.openai_assistant_id || '',
    openai_prompt_type: row.openai_prompt_type || 'custom',
    openai_synced_at: row.openai_synced_at || new Date().toISOString(),
    openai_source: row.openai_source || 'local',
  };
};

export const PromptsLibrary: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [viewingPrompt, setViewingPrompt] = useState<Prompt | null>(null);
  
  // New OpenAI integration states
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncOperations, setSyncOperations] = useState<OpenAISyncOperation[]>([]);
  const [showSyncHistory, setShowSyncHistory] = useState(false);
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const [deleteAllConfirmText, setDeleteAllConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Diagnostic logs integration
  const {
    diagnosticLogs,
    showDiagnostics,
    addDiagnosticLog,
    clearDiagnosticLogs,
    toggleDiagnostics,
    setShowDiagnostics
  } = useDiagnosticLogs();

  // Use the enhanced admin auth hook
  const { hasAdminAccess, loading: authLoading, error: authError, retryAuth } = useAdminAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'general',
    tags: '',
    is_template: false,
    is_public: false
  });

  const categories = [
    'general',
    'system',
    'development',
    'productivity',
    'creative',
    'analysis',
    'support',
    'marketing',
    'research'
  ];

  const sources = [
    { value: 'all', label: 'All Sources' },
    { value: 'local', label: 'Local Only' },
    { value: 'openai', label: 'OpenAI Only' },
    { value: 'synced', label: 'Synced' }
  ];

  const fetchPrompts = async () => {
    try {
      addDiagnosticLog('fetchPrompts', 'Starting prompts fetch operation');
      setLoading(true);
      setError(null);

      addDiagnosticLog('supabase_query', 'Executing database query for prompts');
      
      let query = supabase.from('prompts').select('*');
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        addDiagnosticLog('supabase_error', { error: error.message, details: error });
        logError('Database query', error);
        throw error;
      }

      addDiagnosticLog('data_received', { 
        recordCount: data?.length || 0,
        sampleRecord: data?.[0] || null 
      });

      if (!data) {
        addDiagnosticLog('no_data', 'No data returned from query');
        setPrompts([]);
        return;
      }

      // Transform and validate data
      const transformedPrompts = data.map(transformPrompt);
      addDiagnosticLog('data_transformed', { 
        transformedCount: transformedPrompts.length,
        categories: [...new Set(transformedPrompts.map(p => p.category))],
        sources: [...new Set(transformedPrompts.map(p => p.openai_source))]
      });
      
      setPrompts(transformedPrompts);
      setRetryCount(0);
      addDiagnosticLog('fetchPrompts_success', 'Prompts fetch completed successfully');
      
    } catch (error) {
      addDiagnosticLog('fetchPrompts_error', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        retryCount,
        stack: error instanceof Error ? error.stack : null
      });
      logError('fetchPrompts', error);
      setError(`Failed to load prompts: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Auto-retry logic (max 3 attempts)
      if (retryCount < 3) {
        addDiagnosticLog('retry_attempt', { attempt: retryCount + 1, maxRetries: 3 });
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchPrompts();
        }, 1000 * (retryCount + 1));
      }
    } finally {
      setLoading(false);
    }
  };

  const checkOpenAIConnection = async () => {
    try {
      addDiagnosticLog('connection_check', 'Testing OpenAI connection');
      const result = await openaiPromptsService.testConnection();
      setIsConnected(result.success);
      
      addDiagnosticLog('connection_result', { 
        success: result.success, 
        error: result.error,
        diagnostics: result.diagnostics 
      });
      
      if (!result.success) {
        console.warn('[PromptsLibrary] OpenAI connection failed:', result.error);
      }
    } catch (error) {
      addDiagnosticLog('connection_error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      console.error('[PromptsLibrary] Error checking OpenAI connection:', error);
      setIsConnected(false);
    }
  };

  const handleSyncWithOpenAI = async () => {
    if (isSyncing) return;
    
    setIsSyncing(true);
    addDiagnosticLog('sync_start', 'Starting OpenAI sync operation');
    
    try {
      toast.info('Starting sync with OpenAI assistants...');
      
      const result = await openaiPromptsService.syncPromptsWithDatabase();
      
      addDiagnosticLog('sync_result', {
        synced: result.synced,
        errors: result.errors,
        operation: result.operation
      });
      
      if (result.synced > 0) {
        toast.success(`Successfully synced ${result.synced} prompts from OpenAI assistants`);
        fetchPrompts(); // Refresh the prompts list
      } else if (result.errors.length > 0) {
        toast.error(`Sync completed with ${result.errors.length} errors`);
      } else {
        toast.info('No new prompts to sync');
      }
      
      // Refresh sync history
      fetchSyncOperations();
    } catch (error: any) {
      addDiagnosticLog('sync_error', { 
        error: error.message,
        stack: error.stack 
      });
      console.error('Sync error:', error);
      toast.error(`Sync failed: ${error.message}`);
    } finally {
      setIsSyncing(false);
      addDiagnosticLog('sync_end', 'OpenAI sync operation completed');
    }
  };

  const fetchSyncOperations = async () => {
    try {
      addDiagnosticLog('sync_history_fetch', 'Fetching sync operations history');
      const operations = await openaiPromptsService.getSyncOperations();
      setSyncOperations(operations);
      addDiagnosticLog('sync_history_result', { operationsCount: operations.length });
    } catch (error) {
      addDiagnosticLog('sync_history_error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      console.error('Failed to fetch sync operations:', error);
    }
  };

  useEffect(() => {
    addDiagnosticLog('component_mount', 'PromptsLibrary component mounted');
    
    // Wait for auth to complete before fetching prompts
    if (!authLoading) {
      if (hasAdminAccess) {
        addDiagnosticLog('auth_success', 'Admin access confirmed, initializing component');
        fetchPrompts();
        checkOpenAIConnection();
        fetchSyncOperations();
      } else if (authError) {
        addDiagnosticLog('auth_error', { 
          error: authError,
          fallbackBehavior: 'Attempting to fetch prompts anyway'
        });
        // Still try to fetch prompts even with auth errors (fallback behavior)
        fetchPrompts();
        checkOpenAIConnection();
        fetchSyncOperations();
      }
    }
  }, [authLoading, hasAdminAccess, authError]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="text-gray-600">Checking permissions...</p>
      </div>
    );
  }

  // Show auth error with retry option
  if (authError && !hasAdminAccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500" />
        <h3 className="text-lg font-medium text-gray-900">Authentication Issue</h3>
        <p className="text-amber-600 text-center max-w-md">{authError}</p>
        <div className="flex gap-2">
          <Button onClick={retryAuth} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry Authentication
          </Button>
          <Button variant="outline" onClick={() => fetchPrompts()}>
            Continue Anyway
          </Button>
        </div>
      </div>
    );
  }

  // Loading state for prompts
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="text-gray-600">Loading prompts library...</p>
        {retryCount > 0 && (
          <p className="text-sm text-gray-500">Retry attempt {retryCount}/3</p>
        )}
      </div>
    );
  }

  // Error state with retry option
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h3 className="text-lg font-medium text-gray-900">Error Loading Prompts</h3>
        <p className="text-red-600 text-center max-w-md">{error}</p>
        <Button onClick={() => fetchPrompts()} className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      addDiagnosticLog('form_submit', { 
        action: editingPrompt ? 'update' : 'create',
        promptId: editingPrompt?.id || 'new'
      });

      const promptData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      if (editingPrompt) {
        const { error } = await supabase
          .from('prompts')
          .update(promptData)
          .eq('id', editingPrompt.id);

        if (error) throw error;
        addDiagnosticLog('prompt_updated', { promptId: editingPrompt.id });
        toast.success('Prompt updated successfully');
      } else {
        const { error } = await supabase
          .from('prompts')
          .insert([promptData]);

        if (error) throw error;
        addDiagnosticLog('prompt_created', { promptData });
        toast.success('Prompt created successfully');
      }

      resetForm();
      fetchPrompts();
    } catch (error) {
      addDiagnosticLog('form_submit_error', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        action: editingPrompt ? 'update' : 'create'
      });
      logError('handleSubmit', error);
      toast.error('Failed to save prompt');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;

    try {
      addDiagnosticLog('prompt_delete', { promptId: id });
      
      const { error } = await supabase
        .from('prompts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      addDiagnosticLog('prompt_deleted', { promptId: id });
      toast.success('Prompt deleted successfully');
      fetchPrompts();
    } catch (error) {
      addDiagnosticLog('delete_error', { 
        promptId: id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      logError('handleDelete', error);
      toast.error('Failed to delete prompt');
    }
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      addDiagnosticLog('prompt_copied', { contentLength: content.length });
      toast.success('Prompt copied to clipboard');
    } catch (error) {
      addDiagnosticLog('copy_error', { 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
      toast.error('Failed to copy prompt');
    }
  };

  // Delete all prompts with confirmation
  const handleDeleteAll = async () => {
    if (deleteAllConfirmText !== 'confirm delete all') {
      toast.error('Please type "confirm delete all" to proceed');
      return;
    }

    setIsDeleting(true);
    try {
      addDiagnosticLog('delete_all_start', 'Starting bulk deletion of all prompts');
      console.log('🗑️ Starting bulk deletion of all prompts...');
      
      // First get count of prompts to delete
      const { count } = await supabase
        .from('prompts')
        .select('*', { count: 'exact', head: true });
      
      // First delete from OpenAI for prompts that have OpenAI IDs
      const { data: promptsToDelete } = await supabase
        .from('prompts')
        .select('id, openai_assistant_id')
        .not('openai_assistant_id', 'is', null);

      if (promptsToDelete) {
        addDiagnosticLog('openai_deletion_start', { 
          count: promptsToDelete.length,
          prompts: promptsToDelete 
        });

        for (const prompt of promptsToDelete) {
          try {
            // Call OpenAI deletion endpoint
            const response = await fetch(`${SUPABASE_URL}/functions/v1/openai-prompts-sync`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                action: 'delete_assistant',
                assistant_id: prompt.openai_assistant_id
              })
            });

            if (!response.ok) {
              console.warn(`Failed to delete OpenAI assistant for prompt ${prompt.id}:`, await response.text());
            }
          } catch (error) {
            console.warn(`Failed to delete OpenAI assistant for prompt ${prompt.id}:`, error);
          }
        }
      }
      
      // Then delete all from database
      const { error } = await supabase
        .from('prompts')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) {
        console.error('❌ Delete operation failed:', error);
        throw error;
      }

      const deletedCount = count || prompts.length;
      toast.success(`Successfully deleted all ${deletedCount} prompts`);
      setDeleteAllModalOpen(false);
      setDeleteAllConfirmText('');
      fetchPrompts();
      addDiagnosticLog('delete_all_success', `Successfully deleted ${deletedCount} prompts`);
    } catch (error: any) {
      addDiagnosticLog('delete_all_error', { 
        error: error.message,
        promptsCount: prompts.length,
        errorDetails: error
      });
      console.error('❌ Error deleting all prompts:', error);
      toast.error('Failed to delete all prompts: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      category: 'general',
      tags: '',
      is_template: false,
      is_public: false
    });
    setEditingPrompt(null);
    setIsCreateDialogOpen(false);
  };

  const openEditDialog = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setFormData({
      title: prompt.title,
      description: prompt.description || '',
      content: prompt.content,
      category: prompt.category,
      tags: prompt.tags.join(', '),
      is_template: prompt.is_template,
      is_public: prompt.is_public
    });
    setIsCreateDialogOpen(true);
  };

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    const matchesSource = selectedSource === 'all' || prompt.openai_source === selectedSource;
    return matchesSearch && matchesCategory && matchesSource;
  });

  const getSourceBadge = (prompt: Prompt) => {
    switch (prompt.openai_source) {
      case 'openai':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">OpenAI Synced</Badge>;
      case 'synced':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">OpenAI Synced</Badge>;
      case 'local':
      default:
        return (
          <div className="inline-flex items-center">
            <Badge variant="secondary" className="bg-gray-100 text-gray-800">Local Only</Badge>
            <AlertCircle 
              className="ml-1 h-4 w-4 text-gray-400 cursor-help"
              aria-label="This prompt is stored locally and will not appear in OpenAI's Playground"
            />
          </div>
        );
    }
  };

  const PromptForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Prompt title"
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description"
        />
      </div>

      <div>
        <Label htmlFor="content">Prompt Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Enter your prompt content here..."
          rows={6}
          required
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          placeholder="tag1, tag2, tag3"
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_template"
            checked={formData.is_template}
            onCheckedChange={(checked) => setFormData({ ...formData, is_template: checked })}
          />
          <Label htmlFor="is_template">Template</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_public"
            checked={formData.is_public}
            onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
          />
          <Label htmlFor="is_public">Public</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={resetForm}>
          Cancel
        </Button>
        <Button type="submit">
          {editingPrompt ? 'Update' : 'Create'} Prompt
        </Button>
      </div>
    </form>
  );

  const ConnectionStatus = () => (
    <div className="flex items-center gap-2 text-sm">
      {isConnected === null ? (
        <div className="flex items-center gap-2 text-gray-500">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Checking connection...</span>
        </div>
      ) : isConnected ? (
        <div className="flex items-center gap-2 text-green-600">
          <Cloud className="w-4 h-4" />
          <span>Connected to OpenAI</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-red-600">
          <CloudOff className="w-4 h-4" />
          <span>OpenAI not connected</span>
        </div>
      )}
    </div>
  );

  const SyncHistoryDialog = () => (
    <Dialog open={showSyncHistory} onOpenChange={setShowSyncHistory}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Sync Operations History
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {syncOperations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sync operations found</p>
          ) : (
            syncOperations.map((op) => (
              <Card key={op.id} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={op.status === 'completed' ? 'default' : op.status === 'failed' ? 'destructive' : 'secondary'}>
                        {op.status}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {new Date(op.started_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {op.items_synced}/{op.items_processed} synced
                    </div>
                  </div>
                  {op.error_count > 0 && (
                    <div className="text-sm text-red-600 mt-2">
                      {op.error_count} errors occurred during sync
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Prompts Library
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Create, organize, and manage reusable prompts for your AI assistants
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <ConnectionStatus />
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDiagnostics}
            className="flex items-center gap-2"
          >
            <Bug className="w-4 h-4" />
            Debug ({diagnosticLogs.length})
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSyncHistory(true)}
            className="flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            History
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncWithOpenAI}
            disabled={isSyncing || !isConnected}
            className="flex items-center gap-2"
          >
            {isSyncing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Sync OpenAI
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Prompt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPrompt ? 'Edit Prompt' : 'Create New Prompt'}
                </DialogTitle>
              </DialogHeader>
              <PromptForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Danger Zone - Delete All */}
      <div className="flex justify-end mb-6">
        <Button
          variant="destructive"
          onClick={() => setDeleteAllModalOpen(true)}
          disabled={prompts.length === 0}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
        >
          <Trash2 className="w-4 h-4" />
          Delete All ({prompts.length})
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search prompts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSource} onValueChange={setSelectedSource}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sources.map(source => (
              <SelectItem key={source.value} value={source.value}>
                {source.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="text-sm text-gray-500">
          {filteredPrompts.length} of {prompts.length} prompts
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredPrompts.map((prompt) => (
            <motion.div
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {prompt.openai_source === 'openai' ? (
                        <Bot className="w-5 h-5 text-blue-600" />
                      ) : (
                        <FileText className="w-5 h-5 text-purple-600" />
                      )}
                      <CardTitle className="text-lg">{prompt.title}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-1">
                      {prompt.openai_source && (
                        <Badge 
                          variant={prompt.openai_source === 'openai' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {prompt.openai_source === 'openai' ? 'OpenAI' : prompt.openai_source}
                        </Badge>
                      )}
                      {prompt.is_template && (
                        <Badge variant="secondary">Template</Badge>
                      )}
                      {prompt.is_public && (
                        <Badge variant="outline">Public</Badge>
                      )}
                    </div>
                  </div>
                  {prompt.description && (
                    <p className="text-sm text-gray-600">{prompt.description}</p>
                  )}
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Category:</span>
                    <Badge variant="outline">{prompt.category}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Usage:</span>
                    <span>{prompt.usage_count} times</span>
                  </div>
                  
                  {prompt.openai_assistant_id && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Assistant:</span>
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                        {prompt.openai_assistant_id.replace('asst_', '...')}
                      </span>
                    </div>
                  )}
                  
                  {prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {prompt.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {prompt.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{prompt.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViewingPrompt(prompt)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(prompt.content)}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    {prompt.openai_source !== 'openai' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(prompt)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(prompt.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No prompts found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'No prompts match your search criteria.' 
              : 'Get started by creating your first prompt.'}
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Prompt
            </Button>
          )}
        </div>
      )}

      {/* View Prompt Dialog */}
      <Dialog open={!!viewingPrompt} onOpenChange={() => setViewingPrompt(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {viewingPrompt?.title}
            </DialogTitle>
          </DialogHeader>
          {viewingPrompt && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{viewingPrompt.category}</Badge>
                {viewingPrompt.is_template && <Badge variant="secondary">Template</Badge>}
                {viewingPrompt.is_public && <Badge variant="outline">Public</Badge>}
              </div>
              
              {viewingPrompt.description && (
                <p className="text-gray-600">{viewingPrompt.description}</p>
              )}
              
              <div>
                <Label>Content:</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                  <pre className="whitespace-pre-wrap text-sm">{viewingPrompt.content}</pre>
                </div>
              </div>
              
              {viewingPrompt.tags.length > 0 && (
                <div>
                  <Label>Tags:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {viewingPrompt.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleCopy(viewingPrompt.content)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
                <Button onClick={() => {
                  setViewingPrompt(null);
                  openEditDialog(viewingPrompt);
                }}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Prompt
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <SyncHistoryDialog />
      
      {/* Diagnostic Logs Dialog */}
      <DiagnosticLogsDialog
        open={showDiagnostics}
        onOpenChange={setShowDiagnostics}
        logs={diagnosticLogs}
        onClearLogs={clearDiagnosticLogs}
        title="Prompts Library Diagnostic Logs"
      />

      {/* Delete All Confirmation Modal */}
      <Dialog open={deleteAllModalOpen} onOpenChange={setDeleteAllModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Are you F**#$% sure?
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-medium mb-2">⚠️ DANGER ZONE</p>
              <p className="text-red-700 text-sm">
                This will permanently delete ALL {prompts.length} prompts from the database. 
                This action CANNOT be undone!
              </p>
            </div>

            <div>
              <Label htmlFor="confirmText" className="text-sm font-medium">
                Type "confirm delete all" to proceed:
              </Label>
              <Input
                id="confirmText"
                value={deleteAllConfirmText}
                onChange={(e) => setDeleteAllConfirmText(e.target.value)}
                placeholder="confirm delete all"
                className="mt-1"
                disabled={isDeleting}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setDeleteAllModalOpen(false);
                  setDeleteAllConfirmText('');
                }}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAll}
                disabled={deleteAllConfirmText !== 'confirm delete all' || isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete All Forever
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
