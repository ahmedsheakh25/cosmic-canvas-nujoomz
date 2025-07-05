
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
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Bot, Plus, Edit, Trash2, Settings, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Assistant } from '../types/AssistantsTypes';

export const AssistantsManager: React.FC = () => {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    system_prompt: '',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    is_active: true
  });

  const models = [
    'gpt-4o-mini',
    'gpt-4o',
    'gpt-3.5-turbo',
    'gpt-4-turbo'
  ];

  useEffect(() => {
    fetchAssistants();
  }, []);

  const fetchAssistants = async () => {
    try {
      const { data, error } = await supabase
        .from('assistants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssistants(data as Assistant[] || []);
    } catch (error) {
      console.error('Error fetching assistants:', error);
      toast.error('Failed to load assistants');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingAssistant) {
        const { error } = await supabase
          .from('assistants')
          .update(formData)
          .eq('id', editingAssistant.id);

        if (error) throw error;
        toast.success('Assistant updated successfully');
      } else {
        // Generate a unique ID for new assistants since we're not using OpenAI for creation here
        const assistantData = {
          ...formData,
          id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        };

        const { error } = await supabase
          .from('assistants')
          .insert([assistantData]);

        if (error) throw error;
        toast.success('Assistant created successfully');
      }

      resetForm();
      fetchAssistants();
    } catch (error) {
      console.error('Error saving assistant:', error);
      toast.error('Failed to save assistant');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assistant?')) return;

    try {
      const { error } = await supabase
        .from('assistants')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Assistant deleted successfully');
      fetchAssistants();
    } catch (error) {
      console.error('Error deleting assistant:', error);
      toast.error('Failed to delete assistant');
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
      console.error('Error updating assistant status:', error);
      toast.error('Failed to update assistant status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      system_prompt: '',
      model: 'gpt-4o-mini',
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

  const filteredAssistants = assistants.filter(assistant =>
    assistant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assistant.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-600" />
            Assistants Manager
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Create and manage AI assistants with custom prompts and configurations
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
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
            {searchTerm ? 'No assistants match your search.' : 'Get started by creating your first assistant.'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Assistant
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
