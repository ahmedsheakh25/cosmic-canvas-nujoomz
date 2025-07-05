import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { logSystemError, errorResponse, createResponse, validateEnvironmentVars } from '../_shared/utils.ts';

const REQUIRED_ENV = ['ELEVENLABS_API_KEY', 'ELEVENLABS_VOICE_ID'];

serve(async (req) => {
  try {
    // Validate environment
    const envCheck = validateEnvironmentVars(REQUIRED_ENV);
    if (!envCheck.valid) {
      throw new Error(`Missing required environment variables: ${envCheck.missing.join(', ')}`);
    }

    const { text, voiceId = Deno.env.get('ELEVENLABS_VOICE_ID') } = await req.json();

    if (!text) {
      return errorResponse('Text is required', 400);
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY')!
        },
        body: JSON.stringify({
          text,
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const audioBlob = await response.blob();
    return new Response(audioBlob, {
      headers: { 'Content-Type': 'audio/mpeg' }
    });

  } catch (error) {
    await logSystemError('text-to-speech', error, {
      timestamp: new Date().toISOString()
    });
    return errorResponse('Failed to synthesize speech', 500);
  }
});
