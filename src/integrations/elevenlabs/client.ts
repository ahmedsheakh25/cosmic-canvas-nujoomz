interface TextToSpeechOptions {
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  speakerBoost?: boolean;
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
    return !!(this.apiKey && this.voiceId);
  }

  public async textToSpeech(
    text: string,
    options: TextToSpeechOptions = {}
  ): Promise<Blob | null> {
    if (!this.isConfigured()) {
      console.error('ElevenLabs client is not properly configured');
      return null;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/text-to-speech/${this.voiceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey!,
          },
          body: JSON.stringify({
            text,
            model_id: options.modelId || 'eleven_multilingual_v2',
            voice_settings: {
              stability: options.stability || 0.5,
              similarity_boost: options.similarityBoost || 0.75,
              speaker_boost: options.speakerBoost || true,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('Error in text-to-speech conversion:', error);
      return null;
    }
  }

  public async getVoices(): Promise<any[] | null> {
    if (!this.apiKey) {
      console.error('ElevenLabs API key not configured');
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const data = await response.json();
      return data.voices;
    } catch (error) {
      console.error('Error fetching voices:', error);
      return null;
    }
  }
}

export const elevenLabsClient = ElevenLabsClient.getInstance(); 