interface TextToSpeechOptions {
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  speakerBoost?: boolean;
  voiceId?: string;
}

class ElevenLabsClient {
  private static instance: ElevenLabsClient;
  private apiKey: string | null = null;
  private voiceId: string | null = null;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  private constructor() {
    this.initialize();
  }

  public static getInstance(): ElevenLabsClient {
    if (!ElevenLabsClient.instance) {
      ElevenLabsClient.instance = new ElevenLabsClient();
    }
    return ElevenLabsClient.instance;
  }

  private initialize() {
    this.apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || null;
    this.voiceId = import.meta.env.VITE_ELEVENLABS_VOICE_ID || null;

    if (!this.apiKey) {
      console.warn('ElevenLabs API key not found in environment variables');
    }
    if (!this.voiceId) {
      console.warn('ElevenLabs Voice ID not found in environment variables');
    }
  }

  public isConfigured(): boolean {
    // Since we're using Edge Functions, we'll assume it's configured
    // and let the Edge Function handle the actual validation
    return true;
  }

  public async textToSpeech(
    text: string,
    options: TextToSpeechOptions = {}
  ): Promise<Blob | null> {
    try {
      console.log('🎤 Requesting text-to-speech for:', text.substring(0, 50) + '...');
      
      // Use secure Edge Function instead of direct API call
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          voice: options.voiceId || this.voiceId,
          modelId: options.modelId || 'eleven_multilingual_v2',
          stability: options.stability ?? 0.5,
          similarityBoost: options.similarityBoost ?? 0.75,
          speakerBoost: options.speakerBoost ?? true,
        }
      });

      if (error) {
        console.error('❌ Edge Function error:', error);
        throw new Error(`Text-to-speech failed: ${error.message}`);
      }

      if (!data?.success || !data?.audioContent) {
        console.error('❌ Invalid response from text-to-speech service:', data);
        throw new Error(data?.error || 'Invalid response from text-to-speech service');
      }

      // Convert base64 back to blob
      const binaryString = atob(data.audioContent);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      console.log('✅ Successfully generated audio blob:', bytes.length, 'bytes');
      return new Blob([bytes], { type: 'audio/mpeg' });

    } catch (error) {
      console.error('❌ Error in text-to-speech conversion:', error);
      
      // Graceful degradation - return null so calling code can handle fallback
      return null;
    }
  }

  public async getVoices(): Promise<any[] | null> {
    try {
      console.log('🎤 Fetching available voices...');
      
      // Use secure Edge Function for voice listing
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('get-elevenlabs-voices');

      if (error) {
        console.error('❌ Error fetching voices:', error);
        return null;
      }

      return data?.voices || null;
    } catch (error) {
      console.error('❌ Error fetching voices:', error);
      return null;
    }
  }
}

export const elevenLabsClient = ElevenLabsClient.getInstance(); 