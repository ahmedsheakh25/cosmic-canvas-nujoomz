import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Bot, Plus, Edit, Trash2, RefreshCw, Play, Pause, AlertCircle, CheckCircle, XCircle, Settings, TestTube, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Assistant } from '../types/AssistantsTypes';
import { openaiAssistantsService, OpenAIAssistant } from '@/services/openaiAssistantsService';

export const EnhancedAssistantsManager: React.FC = () => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [testingConnection, setTestingConnection] = useState(false);
  const [deleteAllModalOpen, setDeleteAllModalOpen] = useState(false);
  const [deleteAllConfirmText, setDeleteAllConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [systemHealth, setSystemHealth] = useState({
    openai: 'unknown',
    supabase: 'unknown',
    edgeFunction: 'unknown'
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    system_prompt: '',
    model: 'gpt-4.1-2025-04-14',
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    is_active: true
  });

  const models = [
    'gpt-4.1-2025-04-14',
    'gpt-4o-mini',
    'gpt-4o',
    'gpt-3.5-turbo'
  ];

  useEffect(() => {
    fetchAssistants();
    performSystemHealthCheck();
  }, []);

  const performSystemHealthCheck = async () => {
    console.log('🏥 Performing comprehensive system health check...');
    
    try {
      // Test Edge Function connectivity
      console.log('Testing Edge Function connectivity...');
      const { data: healthData, error: healthError } = await supabase.functions.invoke('health-check');
      
      if (!healthError && healthData?.success) {
        setSystemHealth(prev => ({ ...prev, edgeFunction: 'connected' }));
        console.log('✅ Edge Function connectivity: OK');
      } else {
        setSystemHealth(prev => ({ ...prev, edgeFunction: 'error' }));
        console.error('❌ Edge Function connectivity: FAILED', healthError);
      }

      // Test OpenAI connection
      await testConnection();
      
    } catch (error) {
      console.error('❌ System health check failed:', error);
      setSystemHealth(prev => ({ ...prev, edgeFunction: 'error' }));
    }
  };

  const testConnection = async () => {
    setTestingConnection(true);
    try {
      console.log('🧪 Testing OpenAI connection via enhanced diagnostics...');
      const result = await openaiAssistantsService.testConnection();
      
      setConnectionStatus(result.success ? 'connected' : 'error');
      setDiagnostics(result.diagnostics);
      setSystemHealth(prev => ({
        ...prev,
        openai: result.success ? 'connected' : 'error',
        supabase: 'connected' // If we got here, Supabase is working
      }));
      
      if (result.success) {
        console.log('✅ OpenAI connection test successful');
        toast.success('OpenAI connection successful! All systems operational.');
      } else {
        console.error('❌ OpenAI connection test failed:', result.error);
        toast.error(`OpenAI connection failed: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ OpenAI connection test failed:', error);
      setConnectionStatus('error');
      setSystemHealth(prev => ({ ...prev, openai: 'error' }));
      toast.error('Failed to test OpenAI connection');
    } finally {
      setTestingConnection(false);
    }
  };

  const fetchAssistants = async () => {
    try {
      setLoading(true);
      console.log('📋 Fetching assistants from database...');
      
      const { data, error } = await supabase
        .from('assistants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }
      
      console.log('✅ Assistants fetched successfully:', data?.length || 0);
      setAssistants(data as Assistant[] || []);
      setSystemHealth(prev => ({ ...prev, supabase: 'connected' }));
    } catch (error) {
      console.error('❌ Error fetching assistants:', error);
      setSystemHealth(prev => ({ ...prev, supabase: 'error' }));
      toast.error('Failed to load assistants from database');
    } finally {
      setLoading(false);
    }
  };

  // Sync with OpenAI via Edge Function
  const syncWithOpenAI = async () => {
    setSyncing(true);
    openaiAssistantsService.clearDiagnosticLogs();
    
    try {
      toast.info('Starting comprehensive sync with OpenAI...');
      console.log('🔄 Starting OpenAI sync with enhanced diagnostics...');
      
      const result = await openaiAssistantsService.syncAssistantsWithDatabase(supabase);
      
      setDiagnostics(result.diagnostics);
      
      if (result.errors.length > 0) {
        console.warn('⚠️ Sync completed with errors:', result.errors);
        toast.error(`Sync completed with ${result.errors.length} errors. Check diagnostics for details.`);
      } else {
        console.log('✅ Sync completed successfully:', result.synced);
        toast.success(`Successfully synced ${result.synced} assistants from OpenAI`);
      }
      
      // Refresh local list
      await fetchAssistants();
      
    } catch (error: any) {
      console.error('❌ Sync error:', error);
      toast.error('Failed to sync with OpenAI: ' + error.message);
      setDiagnostics(openaiAssistantsService.getDiagnosticLogs());
    } finally {
      setSyncing(false);
    }
  };

  // Update assistant via Edge Function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('💾 Submitting assistant form...', { editing: !!editingAssistant });
      
      if (editingAssistant) {
        // Update via Edge Function first, then locally
        try {
          console.log('🔄 Updating assistant via OpenAI...', editingAssistant.id);
          await openaiAssistantsService.updateAssistant(editingAssistant.id, {
            name: formData.name,
            description: formData.description,
            instructions: formData.system_prompt,
            model: formData.model,
            temperature: formData.temperature,
            top_p: formData.top_p
          });
          console.log('✅ OpenAI update successful');
        } catch (openaiError) {
          console.warn('⚠️ OpenAI update failed, updating locally only:', openaiError);
        }

        // Update locally with the original OpenAI ID
        const { error } = await supabase
          .from('assistants')
          .update(formData)
          .eq('id', editingAssistant.id);

        if (error) throw error;
        toast.success('Assistant updated successfully');
      } else {
        // Create via Edge Function first, then locally
        let openaiAssistant: OpenAIAssistant | null = null;
        try {
          console.log('🆕 Creating assistant via OpenAI...');
          openaiAssistant = await openaiAssistantsService.createAssistant({
            name: formData.name,
            description: formData.description,
            instructions: formData.system_prompt,
            model: formData.model,
            temperature: formData.temperature,
            top_p: formData.top_p
          });
          console.log('✅ OpenAI creation successful:', openaiAssistant.id);
        } catch (openaiError) {
          console.warn('⚠️ OpenAI creation failed, creating locally only:', openaiError);
        }

        // Create locally with OpenAI ID or generate a fallback
        const localData = {
          ...formData,
          id: openaiAssistant?.id || `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        const { error } = await supabase
          .from('assistants')
          .insert([localData]);

        if (error) throw error;
        toast.success('Assistant created successfully');
      }

      resetForm();
      fetchAssistants();
      setDiagnostics(openaiAssistantsService.getDiagnosticLogs());
    } catch (error: any) {
      console.error('❌ Error saving assistant:', error);
      toast.error('Failed to save assistant: ' + error.message);
      setDiagnostics(openaiAssistantsService.getDiagnosticLogs());
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assistant?')) return;

    try {
      console.log('🗑️ Deleting assistant:', id);
      
      // Delete from OpenAI via Edge Function first (only if it's an OpenAI assistant)
      if (id.startsWith('asst_')) {
        try {
          await openaiAssistantsService.deleteAssistant(id);
          console.log('✅ OpenAI deletion successful');
        } catch (openaiError) {
          console.warn('⚠️ OpenAI deletion failed, deleting locally only:', openaiError);
        }
      }

      // Delete locally
      const { error } = await supabase
        .from('assistants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Assistant deleted successfully');
      fetchAssistants();
      setDiagnostics(openaiAssistantsService.getDiagnosticLogs());
    } catch (error: any) {
      console.error('❌ Error deleting assistant:', error);
      toast.error('Failed to delete assistant: ' + error.message);
    }
  };

  // Delete all assistants with confirmation
  const handleDeleteAll = async () => {
    if (deleteAllConfirmText !== 'confirm delete all') {
      toast.error('Please type "confirm delete all" to proceed');
      return;
    }

    setIsDeleting(true);
    try {
      console.log('🗑️ Starting bulk deletion of all assistants...');
      
      // Delete all from OpenAI first
      for (const assistant of assistants) {
        if (assistant.id.startsWith('asst_')) {
          try {
            await openaiAssistantsService.deleteAssistant(assistant.id);
            console.log(`✅ Deleted from OpenAI: ${assistant.id}`);
          } catch (error) {
            console.warn(`⚠️ Failed to delete from OpenAI: ${assistant.id}`, error);
          }
        }
      }

      // Delete all from database
      const { error } = await supabase
        .from('assistants')
        .delete()
        .neq('id', ''); // Delete all records

      if (error) throw error;

      toast.success(`Successfully deleted all ${assistants.length} assistants`);
      setDeleteAllModalOpen(false);
      setDeleteAllConfirmText('');
      fetchAssistants();
      setDiagnostics(openaiAssistantsService.getDiagnosticLogs());
    } catch (error: any) {
      console.error('❌ Error deleting all assistants:', error);
      toast.error('Failed to delete all assistants: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };
  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('assistants')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Assistant ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchAssistants();
    } catch (error) {
      console.error('❌ Error updating assistant status:', error);
      toast.error('Failed to update assistant status');
    }
  };

  // Reset form state
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      system_prompt: '',
      model: 'gpt-4.1-2025-04-14',
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      is_active: true
    });
    setEditingAssistant(null);
    setIsCreateDialogOpen(false);
  };

  // Open edit dialog for a specific assistant
  const openEditDialog = (assistant: Assistant) => {
    setEditingAssistant(assistant);
    setFormData({
      name: assistant.name,
      description: assistant.description || '',
      system_prompt: assistant.system_prompt,
      model: assistant.model,
      temperature: assistant.temperature,
      max_tokens: assistant.max_tokens,
      top_p: assistant.top_p,
      frequency_penalty: assistant.frequency_penalty,
      presence_penalty: assistant.presence_penalty,
      is_active: assistant.is_active
    });
    setIsCreateDialogOpen(true);
  };

  // Filter assistants based on search term
  const filteredAssistants = assistants.filter(assistant =>
    assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assistant.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form component for creating or editing an assistant
  const AssistantForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Assistant name"
            required
          />
        </div>
        <div>
          <Label htmlFor="model">Model</Label>
          <Select value={formData.model} onValueChange={(value) => setFormData({ ...formData, model: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {models.map(model => (
                <SelectItem key={model} value={model}>{model}</SelectItem>
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
        <Label htmlFor="system_prompt">System Prompt</Label>
        <Textarea
          id="system_prompt"
          value={formData.system_prompt}
          onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
          placeholder="System prompt for the assistant"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="temperature">Temperature: {formData.temperature}</Label>
          <Input
            id="temperature"
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={formData.temperature}
            onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="max_tokens">Max Tokens</Label>
          <Input
            id="max_tokens"
            type="number"
            value={formData.max_tokens}
            onChange={(e) => setFormData({ ...formData, max_tokens: parseInt(e.target.value) })}
            min="1"
            max="4000"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={resetForm}>
          Cancel
        </Button>
        <Button type="submit">
          {editingAssistant ? 'Update' : 'Create'} Assistant
        </Button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2">Loading assistants...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-600" />
            Enhanced Assistants Manager
            {connectionStatus === 'connected' && <CheckCircle className="w-4 h-4 text-green-500" />}
            {connectionStatus === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage AI assistants with full OpenAI integration and enhanced diagnostics
            {connectionStatus === 'error' && ' (OpenAI connection issues detected)'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={performSystemHealthCheck}
            disabled={testingConnection}
            className="flex items-center gap-2"
          >
            <TestTube className={`w-4 h-4 ${testingConnection ? 'animate-spin' : ''}`} />
            System Health
          </Button>

          <Button
            variant="outline"
            onClick={testConnection}
            disabled={testingConnection}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${testingConnection ? 'animate-spin' : ''}`} />
            {testingConnection ? 'Testing...' : 'Test Connection'}
          </Button>
          
          <Button
            variant="outline"
            onClick={syncWithOpenAI}
            disabled={syncing || connectionStatus === 'error'}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync with OpenAI'}
          </Button>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2" disabled={connectionStatus === 'error'}>
                <Plus className="w-4 h-4" />
                New Assistant
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAssistant ? 'Edit Assistant' : 'Create New Assistant'}
                </DialogTitle>
              </DialogHeader>
              <AssistantForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* System Health Status */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Edge Functions</span>
            </div>
            {systemHealth.edgeFunction === 'connected' && <CheckCircle className="w-4 h-4 text-green-500" />}
            {systemHealth.edgeFunction === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
            {systemHealth.edgeFunction === 'unknown' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              <span className="text-sm font-medium">OpenAI API</span>
            </div>
            {systemHealth.openai === 'connected' && <CheckCircle className="w-4 h-4 text-green-500" />}
            {systemHealth.openai === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
            {systemHealth.openai === 'unknown' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Database</span>
            </div>
            {systemHealth.supabase === 'connected' && <CheckCircle className="w-4 h-4 text-green-500" />}
            {systemHealth.supabase === 'error' && <XCircle className="w-4 h-4 text-red-500" />}
            {systemHealth.supabase === 'unknown' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone - Delete All */}
      <div className="flex justify-end">
        <Button
          variant="destructive"
          onClick={() => setDeleteAllModalOpen(true)}
          disabled={assistants.length === 0}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
        >
          <Trash2 className="w-4 h-4" />
          Delete All ({assistants.length})
        </Button>
      </div>

      {connectionStatus === 'connected' && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="text-green-700 font-medium">OpenAI connection successful!</p>
              <p className="text-sm text-green-600">
                All systems operational. You can now sync assistants, create new ones, and manage your AI assistants seamlessly.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {connectionStatus === 'error' && (
        <Alert>
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>OpenAI integration issues detected. This could be due to:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Missing or invalid OpenAI API key</li>
                <li>Network connectivity issues</li>
                <li>OpenAI service downtime</li>
                <li>Edge Function configuration problems</li>
              </ul>
              <p className="text-sm font-medium">
                Please run System Health check and verify your OpenAI API key is set correctly.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {diagnostics.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>Enhanced diagnostic logs available from last operation ({diagnostics.length} entries)</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDiagnostics(!showDiagnostics)}
              >
                {showDiagnostics ? 'Hide' : 'Show'} Diagnostics
              </Button>
            </div>
            {showDiagnostics && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-xs max-h-40 overflow-y-auto">
                <pre>{JSON.stringify(diagnostics, null, 2)}</pre>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search assistants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        <div className="text-sm text-gray-500">
          {filteredAssistants.length} of {assistants.length} assistants
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredAssistants.map((assistant) => (
            <motion.div
              key={assistant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-5 h-5 text-purple-600" />
                      <CardTitle className="text-lg">{assistant.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Badge variant={assistant.is_active ? "default" : "secondary"}>
                        {assistant.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {assistant.id.startsWith('asst_') && (
                        <Badge variant="outline" className="text-xs">
                          OpenAI
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActiveStatus(assistant.id, assistant.is_active)}
                      >
                        {assistant.is_active ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {assistant.description && (
                    <p className="text-sm text-gray-600">{assistant.description}</p>
                  )}
                  <div className="text-xs text-gray-500 font-mono">
                    ID: {assistant.id}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Model:</span>
                    <Badge variant="outline">{assistant.model}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Temperature:</span>
                    <span>{assistant.temperature}</span>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-gray-500">System Prompt:</span>
                    <p className="mt-1 text-xs text-gray-700 line-clamp-3">
                      {assistant.system_prompt}
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(assistant)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(assistant.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAssistants.length === 0 && (
        <div className="text-center py-12">
          <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assistants found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'No assistants match your search.' : 'Get started by syncing with OpenAI or creating your first assistant.'}
          </p>
          <div className="flex justify-center space-x-2">
            {!searchTerm && (
              <>
                <Button onClick={syncWithOpenAI} variant="outline" disabled={syncing}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  Sync from OpenAI
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assistant
                </Button>
              </>
            )}
          </div>
        </div>
      )}

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
                This will permanently delete ALL {assistants.length} assistants from both the database and OpenAI. 
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
