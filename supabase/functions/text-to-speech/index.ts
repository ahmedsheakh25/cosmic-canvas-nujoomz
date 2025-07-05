import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, voice, modelId, stability, similarityBoost, speakerBoost } = await req.json();

    if (!text) {
      throw new Error('Text is required for speech synthesis');
    }

    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    const defaultVoiceId = Deno.env.get('ELEVENLABS_VOICE_ID');

    if (!elevenLabsApiKey) {
      throw new Error('ElevenLabs API key not configured in Edge Function secrets');
    }

    if (!defaultVoiceId && !voice) {
      throw new Error('Voice ID not configured and none provided');
    }

    const voiceId = voice || defaultVoiceId;
    console.log(`🎤 Generating speech for text: "${text.substring(0, 50)}..." using voice: ${voiceId}`);

    // Call ElevenLabs Text-to-Speech API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey,
        },
        body: JSON.stringify({
          text,
          model_id: modelId || 'eleven_multilingual_v2',
          voice_settings: {
            stability: stability ?? 0.5,
            similarity_boost: similarityBoost ?? 0.75,
            style: 0.0,
            speaker_boost: speakerBoost ?? true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🚨 ElevenLabs API Error:', response.status, errorText);
      
      if (response.status === 401) {
        throw new Error('Invalid ElevenLabs API key - please check your configuration');
      } else if (response.status === 422) {
        throw new Error('Invalid voice ID or request parameters');
      } else {
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }
    }

    // Convert response to base64 for transmission
    const audioBuffer = await response.arrayBuffer();
    const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioBuffer)));

    console.log(`✅ Successfully generated ${audioBuffer.byteLength} bytes of audio`);

    return new Response(
      JSON.stringify({
        success: true,
        audioContent: base64Audio,
        contentType: 'audio/mpeg',
        voiceId: voiceId,
        textLength: text.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('🚨 Text-to-Speech Error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        details: 'Check Edge Function logs for more information'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});