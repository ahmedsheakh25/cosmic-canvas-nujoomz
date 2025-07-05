
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { corsHeaders, createResponse, logError, validateEnvironmentVars } from '../_shared/utils.ts';

interface VoiceToTextRequest {
  file?: File;
  language?: string;
}

serve(async (req) => {
  const startTime = Date.now();
  console.log('🚀 Voice to Text Function Started');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request handled');
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔍 Validating environment variables...');
    
    // Validate environment variables
    const envCheck = validateEnvironmentVars(['OPENAI_API_KEY']);
    if (!envCheck.valid) {
      console.error('❌ Missing environment variables:', envCheck.missing.join(', '));
      throw new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`);
    }

    console.log('✅ Environment variables validated');

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    let audioFile: File | null = null;
    let language = 'en';

    // Handle different content types
    const contentType = req.headers.get('content-type') || '';
    console.log('📨 Processing content type:', contentType);
    
    if (contentType.includes('multipart/form-data')) {
      console.log('📁 Processing FormData...');
      // Handle FormData
      const formData = await req.formData();
      audioFile = formData.get('file') as File;
      language = (formData.get('language') as string) || 'en';
      console.log('✅ FormData processed');
    } else if (contentType.includes('application/json')) {
      console.log('📄 Processing JSON...');
      // Handle JSON with base64 audio
      const { file, language: reqLanguage } = await req.json();
      language = reqLanguage || 'en';
      
      if (typeof file === 'string') {
        // Convert base64 to File object
        try {
          console.log('🔄 Converting base64 to File...');
          const base64Data = file.replace(/^data:audio\/[^;]+;base64,/, '');
          const binaryData = atob(base64Data);
          const bytes = new Uint8Array(binaryData.length);
          
          for (let i = 0; i < binaryData.length; i++) {
            bytes[i] = binaryData.charCodeAt(i);
          }
          
          audioFile = new File([bytes], 'audio.webm', { type: 'audio/webm' });
          console.log('✅ Base64 conversion completed');
        } catch (decodeError) {
          console.error('❌ Base64 decode error:', decodeError);
          throw new Error(`Failed to decode base64 audio: ${decodeError.message}`);
        }
      }
    } else {
      console.error('❌ Unsupported content type:', contentType);
      throw new Error('Unsupported content type. Use multipart/form-data or application/json');
    }

    if (!audioFile) {
      console.error('❌ No audio file provided');
      return createResponse(null, 'No audio file provided. Please provide either a FormData with a file field or a JSON with a base64-encoded audio file.', 400);
    }

    console.log(`📊 Processing audio file: ${audioFile.name}, size: ${audioFile.size} bytes, language: ${language}`);

    // Validate file size (max 25MB for OpenAI Whisper)
    if (audioFile.size > 25 * 1024 * 1024) {
      console.error('❌ File too large:', audioFile.size);
      throw new Error('Audio file too large. Maximum size is 25MB');
    }

    // Test OpenAI API connection first
    console.log('🤖 Testing OpenAI API connection...');
    try {
      const testResponse = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
        },
      });

      if (!testResponse.ok) {
        console.error('❌ OpenAI API test failed:', testResponse.status, testResponse.statusText);
        const errorText = await testResponse.text();
        throw new Error(`OpenAI API connection failed (${testResponse.status}): ${errorText}`);
      }
      console.log('✅ OpenAI API connection verified');
    } catch (error) {
      console.error('❌ OpenAI API connection error:', error);
      throw new Error(`Failed to connect to OpenAI API: ${error.message}`);
    }

    // Prepare form data for OpenAI
    console.log('📤 Preparing request for OpenAI Whisper...');
    const openAIFormData = new FormData();
    openAIFormData.append('file', audioFile);
    openAIFormData.append('model', 'whisper-1');
    openAIFormData.append('language', language === 'ar' ? 'ar' : 'en');
    openAIFormData.append('response_format', 'json');

    console.log('🎙️ Sending request to OpenAI Whisper API...');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
      },
      body: openAIFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI Whisper API error:', response.status, errorText);
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    
    if (!result.text) {
      console.error('❌ No transcription text returned');
      throw new Error('No transcription text returned from OpenAI');
    }

    const executionTime = Date.now() - startTime;
    console.log(`✅ Transcription completed successfully in ${executionTime}ms`);
    console.log(`📝 Transcribed text length: ${result.text.length} characters`);

    return createResponse({
      text: result.text,
      language: language,
      confidence: result.confidence || null,
      duration: result.duration || null,
      audioSize: audioFile.size,
      processingTime: executionTime
    }, null, 200, executionTime);

  } catch (error) {
    console.error('❌ Voice to text function error:', error);
    await logError('voice-to-text', error);
    const executionTime = Date.now() - startTime;
    return createResponse(null, `Voice to text error: ${error.message}`, 500, executionTime);
  }
});
