
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Users, Plus, Edit, Palette, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface UserPersona {
  id: string;
  name: string;
  description?: string;
  default_greeting?: string;
  voice_settings: any;
  ui_theme: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PersonaFormData {
  name: string;
  description?: string;
  default_greeting?: string;
  voice_settings: any;
  ui_theme: any;
  is_active: boolean;
}

const PersonaProfiles: React.FC = () => {
  const [personas, setPersonas] = useState<UserPersona[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPersona, setEditingPersona] = useState<UserPersona | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      const { data, error } = await supabase
        .from('user_personas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPersonas(data || []);
    } catch (error) {
      console.error('Error fetching personas:', error);
      toast.error('Failed to load personas');
    } finally {
      setLoading(false);
    }
  };

  const savePersona = async (personaData: PersonaFormData) => {
    try {
      if (editingPersona) {
        // Update existing persona
        const { error } = await supabase
          .from('user_personas')
          .update({
            name: personaData.name,
            description: personaData.description,
            default_greeting: personaData.default_greeting,
            voice_settings: personaData.voice_settings,
            ui_theme: personaData.ui_theme,
            is_active: personaData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPersona.id);

        if (error) throw error;
        toast.success('Persona updated successfully');
      } else {
        // Create new persona
        const { error } = await supabase
          .from('user_personas')
          .insert({
            name: personaData.name,
            description: personaData.description,
            default_greeting: personaData.default_greeting,
            voice_settings: personaData.voice_settings,
            ui_theme: personaData.ui_theme,
            is_active: personaData.is_active
          });

        if (error) throw error;
        toast.success('Persona created successfully');
      }

      fetchPersonas();
      setIsDialogOpen(false);
      setEditingPersona(null);
    } catch (error) {
      console.error('Error saving persona:', error);
      toast.error('Failed to save persona');
    }
  };

  const togglePersonaStatus = async (personaId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('user_personas')
        .update({ 
          is_active: isActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', personaId);

      if (error) throw error;

      setPersonas(prev => 
        prev.map(p => p.id === personaId ? { ...p, is_active: isActive } : p)
      );

      toast.success(`Persona ${isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error toggling persona status:', error);
      toast.error('Failed to update persona status');
    }
  };

  const PersonaForm: React.FC<{ persona?: UserPersona | null }> = ({ persona }) => {
    const [formData, setFormData] = useState<PersonaFormData>({
      name: persona?.name || '',
      description: persona?.description || '',
      default_greeting: persona?.default_greeting || '',
      voice_settings: persona?.voice_settings || { voice_id: 'alloy', language: 'ar' },
      ui_theme: persona?.ui_theme || { primary: '#3B82F6', accent: '#1E40AF' },
      is_active: persona?.is_active ?? true
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name.trim()) {
        toast.error('Persona name is required');
        return;
      }
      savePersona(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Persona name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe this persona's characteristics"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Default Greeting</label>
          <Textarea
            value={formData.default_greeting}
            onChange={(e) => setFormData({ ...formData, default_greeting: e.target.value })}
            placeholder="How should Nujmooz greet users with this persona?"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Voice ID</label>
            <Input
              value={formData.voice_settings.voice_id}
              onChange={(e) => setFormData({
                ...formData,
                voice_settings: { ...formData.voice_settings, voice_id: e.target.value }
              })}
              placeholder="alloy, nova, echo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <Input
              value={formData.voice_settings.language}
              onChange={(e) => setFormData({
                ...formData,
                voice_settings: { ...formData.voice_settings, language: e.target.value }
              })}
              placeholder="ar, en"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Primary Color</label>
            <Input
              type="color"
              value={formData.ui_theme.primary}
              onChange={(e) => setFormData({
                ...formData,
                ui_theme: { ...formData.ui_theme, primary: e.target.value }
              })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Accent Color</label>
            <Input
              type="color"
              value={formData.ui_theme.accent}
              onChange={(e) => setFormData({
                ...formData,
                ui_theme: { ...formData.ui_theme, accent: e.target.value }
              })}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
          <label className="text-sm font-medium">Active</label>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit">
            {persona ? 'Update' : 'Create'} Persona
          </Button>
        </div>
      </form>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Persona Profiles
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Persona Profiles & Adaptive UI
              </CardTitle>
              <CardDescription>
                Manage user personas and their adaptive interface settings
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingPersona(null);
                    setIsDialogOpen(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Persona
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingPersona ? 'Edit Persona' : 'Create New Persona'}
                  </DialogTitle>
                  <DialogDescription>
                    Configure persona settings including voice, UI theme, and behavior
                  </DialogDescription>
                </DialogHeader>
                <PersonaForm persona={editingPersona} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {personas.map((persona) => (
              <Card key={persona.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{persona.name}</h3>
                      <Badge variant={persona.is_active ? "default" : "secondary"}>
                        {persona.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    {persona.description && (
                      <p className="text-sm text-gray-600 mb-2">{persona.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Volume2 className="w-3 h-3" />
                        {persona.voice_settings.voice_id} ({persona.voice_settings.language})
                      </span>
                      <span className="flex items-center gap-1">
                        <Palette className="w-3 h-3" />
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: persona.ui_theme.primary }}
                        />
                        Theme
                      </span>
                    </div>
                    
                    {persona.default_greeting && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <strong>Greeting:</strong> {persona.default_greeting}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPersona(persona);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Switch
                      checked={persona.is_active}
                      onCheckedChange={(checked) => togglePersonaStatus(persona.id, checked)}
                    />
                  </div>
                </div>
              </Card>
            ))}
            
            {personas.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-gray-500">No personas configured yet</p>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonaProfiles;
