
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Settings, History, ToggleLeft, Activity, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface FeatureToggle {
  id: string;
  feature_name: string;
  is_enabled: boolean;
  description?: string;
  category: string;
  required_role: 'admin' | 'moderator' | 'user';
  created_by?: string;
  updated_at: string;
}

interface UsageHistory {
  feature: string;
  count: number;
  lastUsed: string;
}

const FeatureManagement: React.FC = () => {
  const [features, setFeatures] = useState<FeatureToggle[]>([]);
  const [usageHistory, setUsageHistory] = useState<UsageHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FeatureToggle | null>(null);
  const [formData, setFormData] = useState({
    feature_name: '',
    description: '',
    category: 'general',
    required_role: 'user' as 'admin' | 'moderator' | 'user',
    is_enabled: true
  });

  const categories = ['interaction', 'ai', 'workflow', 'system', 'analytics', 'general'];
  const roles = ['user', 'moderator', 'admin'];

  useEffect(() => {
    fetchFeatures();
    fetchUsageHistory();
  }, []);

  const fetchFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('feature_toggles')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error('Error fetching features:', error);
      toast.error('Failed to load feature toggles');
    }
  };

  const fetchUsageHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('feature, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process usage data
      const usageMap = new Map();
      const lastUsedMap = new Map();

      data?.forEach(event => {
        const count = usageMap.get(event.feature) || 0;
        usageMap.set(event.feature, count + 1);
        
        if (!lastUsedMap.has(event.feature)) {
          lastUsedMap.set(event.feature, event.created_at);
        }
      });

      const history = Array.from(usageMap.entries()).map(([feature, count]) => ({
        feature,
        count,
        lastUsed: lastUsedMap.get(feature) || ''
      }));

      setUsageHistory(history);
    } catch (error) {
      console.error('Error fetching usage history:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      feature_name: '',
      description: '',
      category: 'general',
      required_role: 'user',
      is_enabled: true
    });
    setEditingFeature(null);
  };

  const openEditDialog = (feature: FeatureToggle) => {
    setEditingFeature(feature);
    setFormData({
      feature_name: feature.feature_name,
      description: feature.description || '',
      category: feature.category,
      required_role: feature.required_role,
      is_enabled: feature.is_enabled
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.feature_name.trim()) {
      toast.error('Feature name is required');
      return;
    }

    try {
      const currentUser = await supabase.auth.getUser();
      
      const featureData = {
        feature_name: formData.feature_name,
        description: formData.description,
        category: formData.category,
        required_role: formData.required_role,
        is_enabled: formData.is_enabled,
        updated_at: new Date().toISOString()
      };

      if (editingFeature) {
        const { error } = await supabase
          .from('feature_toggles')
          .update(featureData)
          .eq('id', editingFeature.id);

        if (error) throw error;
        toast.success('Feature updated successfully');
      } else {
        const { error } = await supabase
          .from('feature_toggles')
          .insert({
            ...featureData,
            created_by: currentUser.data.user?.id
          });

        if (error) throw error;
        toast.success('Feature created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchFeatures();
    } catch (error) {
      console.error('Error saving feature:', error);
      toast.error('Failed to save feature');
    }
  };

  const deleteFeature = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature toggle?')) return;

    try {
      const { error } = await supabase
        .from('feature_toggles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Feature deleted successfully');
      fetchFeatures();
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast.error('Failed to delete feature');
    }
  };

  const toggleFeature = async (featureId: string, newState: boolean) => {
    try {
      const { error } = await supabase
        .from('feature_toggles')
        .update({ 
          is_enabled: newState,
          updated_at: new Date().toISOString()
        })
        .eq('id', featureId);

      if (error) throw error;

      setFeatures(prev => 
        prev.map(f => f.id === featureId ? { ...f, is_enabled: newState } : f)
      );

      toast.success(`Feature ${newState ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      console.error('Error toggling feature:', error);
      toast.error('Failed to update feature');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      interaction: 'bg-blue-100 text-blue-800',
      ai: 'bg-purple-100 text-purple-800',
      workflow: 'bg-green-100 text-green-800',
      system: 'bg-orange-100 text-orange-800',
      analytics: 'bg-pink-100 text-pink-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      moderator: 'bg-yellow-100 text-yellow-800',
      user: 'bg-blue-100 text-blue-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const groupedFeatures = features.reduce((groups, feature) => {
    const category = feature.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(feature);
    return groups;
  }, {} as Record<string, FeatureToggle[]>);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Feature Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Feature Management & Usage History
          </CardTitle>
          <CardDescription>
            Control feature availability and monitor usage patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="features" className="flex items-center gap-2">
                <ToggleLeft className="w-4 h-4" />
                Feature Toggles
              </TabsTrigger>
              <TabsTrigger value="usage" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Usage History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="space-y-6">
              <div className="flex justify-end">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      New Feature
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingFeature ? 'Edit Feature Toggle' : 'Create New Feature Toggle'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingFeature ? 'Update the feature toggle settings' : 'Create a new feature toggle for the system'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="feature_name">Feature Name</Label>
                        <Input
                          id="feature_name"
                          value={formData.feature_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, feature_name: e.target.value }))}
                          placeholder="e.g., advanced_analytics"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe what this feature does"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
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
                        <div>
                          <Label htmlFor="required_role">Required Role</Label>
                          <Select value={formData.required_role} onValueChange={(value: 'admin' | 'moderator' | 'user') => setFormData(prev => ({ ...prev, required_role: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map(role => (
                                <SelectItem key={role} value={role}>
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_enabled"
                          checked={formData.is_enabled}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_enabled: checked }))}
                        />
                        <Label htmlFor="is_enabled">Enable feature</Label>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button onClick={handleSubmit} className="flex-1">
                          {editingFeature ? 'Update Feature' : 'Create Feature'}
                        </Button>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
                    <Badge className={getCategoryColor(category)}>
                      {category}
                    </Badge>
                  </h3>
                  <div className="space-y-3">
                    {categoryFeatures.map((feature) => (
                      <Card key={feature.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium">{feature.feature_name}</h4>
                              <Badge variant={feature.is_enabled ? "default" : "secondary"}>
                                {feature.is_enabled ? 'Enabled' : 'Disabled'}
                              </Badge>
                              <Badge className={getRoleColor(feature.required_role)}>
                                {feature.required_role}+
                              </Badge>
                            </div>
                            {feature.description && (
                              <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                            )}
                            <p className="text-xs text-gray-500">
                              Last updated: {new Date(feature.updated_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(feature)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteFeature(feature.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                            <Switch
                              checked={feature.is_enabled}
                              onCheckedChange={(checked) => toggleFeature(feature.id, checked)}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="usage" className="space-y-4">
              <div className="grid gap-4">
                {usageHistory.map((usage) => (
                  <Card key={usage.feature} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{usage.feature}</h4>
                        <p className="text-sm text-gray-600">
                          Used {usage.count} times
                        </p>
                        {usage.lastUsed && (
                          <p className="text-xs text-gray-500">
                            Last used: {new Date(usage.lastUsed).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" />
                        <Badge variant="outline">{usage.count}</Badge>
                      </div>
                    </div>
                  </Card>
                ))}
                {usageHistory.length === 0 && (
                  <Card className="p-8 text-center">
                    <p className="text-gray-500">No usage data available yet</p>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeatureManagement;
