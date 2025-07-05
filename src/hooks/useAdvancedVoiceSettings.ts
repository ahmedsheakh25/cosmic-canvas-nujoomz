
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VoiceSettings {
  id?: string;
  service_type?: string;
  voice_provider: 'openai' | 'elevenlabs' | 'azure';
  voice_id: string;
  language: 'ar' | 'en';
}

export const useAdvancedVoiceSettings = (sessionId: string) => {
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings[]>([]);
  const [defaultSettings, setDefaultSettings] = useState<VoiceSettings>({
    voice_provider: 'openai',
    voice_id: 'alloy',
    language: 'ar'
  });

  const loadVoiceSettings = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('voice_settings')
        .select('*')
        .eq('session_id', sessionId);

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = data?.map(item => ({
        id: item.id,
        service_type: item.service_type,
        voice_provider: (item.voice_provider as 'openai' | 'elevenlabs' | 'azure') || 'openai',
        voice_id: item.voice_id || 'alloy',
        language: (item.language as 'ar' | 'en') || 'ar'
      })) || [];
      
      setVoiceSettings(transformedData);
      
      // Set default settings if available
      const generalSettings = transformedData.find(s => !s.service_type);
      if (generalSettings) {
        setDefaultSettings({
          voice_provider: generalSettings.voice_provider,
          voice_id: generalSettings.voice_id,
          language: generalSettings.language
        });
      }
    } catch (error) {
      console.error('Error loading voice settings:', error);
    }
  }, [sessionId]);

  const updateVoiceSettings = useCallback(async (
    serviceType: string | null, 
    settings: Partial<VoiceSettings>
  ) => {
    try {
      const { data, error } = await supabase
        .from('voice_settings')
        .upsert({
          session_id: sessionId,
          service_type: serviceType,
          ...settings,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'session_id,service_type',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) throw error;

      if (!serviceType) {
        setDefaultSettings(prev => ({ ...prev, ...settings }));
      }
      
      await loadVoiceSettings();
    } catch (error) {
      console.error('Error updating voice settings:', error);
    }
  }, [sessionId, loadVoiceSettings]);

  const getVoiceSettingsForService = useCallback((serviceType: string) => {
    const serviceSettings = voiceSettings.find(s => s.service_type === serviceType);
    return serviceSettings || defaultSettings;
  }, [voiceSettings, defaultSettings]);

  useEffect(() => {
    if (sessionId) {
      loadVoiceSettings();
    }
  }, [sessionId, loadVoiceSettings]);

  return {
    voiceSettings,
    defaultSettings,
    updateVoiceSettings,
    getVoiceSettingsForService,
    loadVoiceSettings
  };
};
