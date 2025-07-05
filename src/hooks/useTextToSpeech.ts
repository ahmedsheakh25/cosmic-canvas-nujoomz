
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdvancedVoiceSettings } from './useAdvancedVoiceSettings';

export const useTextToSpeech = (currentLanguage: 'en' | 'ar', sessionId?: string) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { getVoiceSettingsForService } = useAdvancedVoiceSettings(sessionId || '');

  const speakText = useCallback(async (text: string, serviceType?: string): Promise<boolean> => {
    if (!text.trim()) return false;

    try {
      setIsSpeaking(true);
      
      // Get voice settings for specific service or default
      const voiceSettings = serviceType 
        ? getVoiceSettingsForService(serviceType)
        : { voice_provider: 'openai', voice_id: 'alloy', language: currentLanguage };

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          language: voiceSettings.language,
          voice: voiceSettings.voice_id,
          provider: voiceSettings.voice_provider
        }
      });

      if (error) throw error;

      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      
      await audio.play();
      return true;
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      setIsSpeaking(false);
      return false;
    }
  }, [currentLanguage, getVoiceSettingsForService]);

  const stopSpeaking = useCallback(() => {
    setIsSpeaking(false);
  }, []);

  return {
    isSpeaking,
    speakText,
    stopSpeaking
  };
};
