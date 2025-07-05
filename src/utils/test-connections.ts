import OpenAI from 'openai';
import { supabase } from '../integrations/supabase/client';

export async function testConnections() {
  console.log('🔍 Testing API Connections...\n');

  // Test OpenAI Connection
  try {
    const openai = new OpenAI({
      apiKey: process.env.VITE_OPENAI_API_KEY,
      organization: process.env.VITE_OPENAI_ORG_ID,
    });
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Hello!' }],
    });
    
    if (response.choices[0].message.content) {
      console.log('✅ OpenAI Connection: Success');
    } else {
      console.log('❌ OpenAI Connection: Failed - No response content');
    }
  } catch (error) {
    console.error('❌ OpenAI Connection Error:', error.message);
  }

  // Test ElevenLabs Connection
  try {
    const elevenLabsApiKey = process.env.VITE_ELEVENLABS_API_KEY;
    const elevenLabsVoiceId = process.env.VITE_ELEVENLABS_VOICE_ID;
    
    if (!elevenLabsApiKey || !elevenLabsVoiceId) {
      console.log('❌ ElevenLabs Connection: Failed - Missing credentials');
    } else {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': elevenLabsApiKey,
        },
      });
      
      if (response.ok) {
        console.log('✅ ElevenLabs Connection: Success');
      } else {
        console.log('❌ ElevenLabs Connection: Failed - API Error');
      }
    }
  } catch (error) {
    console.error('❌ ElevenLabs Connection Error:', error.message);
  }

  // Test Supabase Connection
  try {
    const { data, error } = await supabase.from('feature_toggles').select('*').limit(1);
    if (error) throw error;
    console.log('✅ Supabase Connection: Success');
  } catch (error) {
    console.error('❌ Supabase Connection Error:', error.message);
  }

  // Test Color Services
  try {
    const huemintApiKey = process.env.VITE_HUEMINT_API_KEY;
    
    if (!huemintApiKey) {
      console.log('❌ Huemint Connection: Failed - Missing API key');
    } else {
      const response = await fetch('https://api.huemint.com/color', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${huemintApiKey}`,
        },
        body: JSON.stringify({
          mode: 'transformer',
          num_results: 1,
          temperature: 0.5,
        }),
      });
      
      if (response.ok) {
        console.log('✅ Huemint Connection: Success');
      } else {
        console.log('❌ Huemint Connection: Failed - API Error');
      }
    }
  } catch (error) {
    console.error('❌ Huemint Connection Error:', error.message);
  }

  console.log('\n🔍 Connection Tests Complete');
} 