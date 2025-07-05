
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, createResponse, logError, validateEnvironmentVars } from '../_shared/utils.ts';

interface ModelRequest {
  action: 'test' | 'list';
}

serve(async (req) => {
  const startTime = Date.now();
  console.log('🚀 Get OpenAI Models Function Started');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request handled');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🔍 Validating environment variables...');
    
    const envCheck = validateEnvironmentVars(['OPENAI_API_KEY']);
    
    if (!envCheck.valid) {
      console.error('❌ Missing environment variables:', envCheck.missing.join(', '));
      const executionTime = Date.now() - startTime;
      return createResponse(null, `Missing environment variables: ${envCheck.missing.join(', ')}`, 500, executionTime);
    }

    console.log('✅ Environment variables validated');

    // Parse request body
    let requestBody: ModelRequest;
    try {
      const rawBody = await req.text();
      console.log('📝 Raw request body length:', rawBody.length);
      
      if (!rawBody.trim()) {
        throw new Error('Request body is empty');
      }
      
      requestBody = JSON.parse(rawBody);
      console.log('✅ Request body parsed successfully:', requestBody);
    } catch (error) {
      console.error('❌ Failed to parse request body:', error);
      const executionTime = Date.now() - startTime;
      return createResponse(null, `Invalid JSON in request body: ${error.message}`, 400, executionTime);
    }

    const { action } = requestBody;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

    console.log(`🎯 Processing action: ${action}`);

    if (action === 'test') {
      // Test OpenAI API connection
      console.log('🧪 Testing OpenAI API connection...');
      
      try {
        const testResponse = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        });

        if (!testResponse.ok) {
          const errorText = await testResponse.text();
          console.error('❌ OpenAI API test failed:', testResponse.status, testResponse.statusText, errorText);
          const executionTime = Date.now() - startTime;
          return createResponse(null, `OpenAI API error (${testResponse.status}): ${errorText}`, 503, executionTime);
        }

        const testData = await testResponse.json();
        console.log('✅ OpenAI API connection test successful');
        
        const executionTime = Date.now() - startTime;
        return createResponse({
          connectionStatus: 'connected',
          modelCount: testData.data?.length || 0,
          apiKeyValid: true
        }, null, 200, executionTime);

      } catch (error: any) {
        console.error('❌ OpenAI API connection error:', error);
        const executionTime = Date.now() - startTime;
        return createResponse(null, `OpenAI API connection failed: ${error.message}`, 503, executionTime);
      }
    }

    if (action === 'list') {
      // Fetch available models
      console.log('📋 Fetching OpenAI models...');
      
      try {
        const modelsResponse = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(15000) // 15 second timeout
        });

        if (!modelsResponse.ok) {
          const errorText = await modelsResponse.text();
          console.error('❌ OpenAI models fetch failed:', modelsResponse.status, errorText);
          const executionTime = Date.now() - startTime;
          return createResponse(null, `OpenAI API error (${modelsResponse.status}): ${errorText}`, 503, executionTime);
        }

        const modelsData = await modelsResponse.json();
        console.log('✅ OpenAI models fetched successfully:', modelsData.data?.length || 0);
        
        const executionTime = Date.now() - startTime;
        return createResponse({
          models: modelsData.data || [],
          totalCount: modelsData.data?.length || 0
        }, null, 200, executionTime);

      } catch (error: any) {
        console.error('❌ OpenAI models fetch error:', error);
        const executionTime = Date.now() - startTime;
        return createResponse(null, `Failed to fetch OpenAI models: ${error.message}`, 503, executionTime);
      }
    }

    // Invalid action
    const executionTime = Date.now() - startTime;
    return createResponse(null, `Invalid action: ${action}. Supported actions: test, list`, 400, executionTime);

  } catch (error: any) {
    console.error('❌ Get OpenAI Models function error:', error);
    await logError('get-openai-models', error);
    const executionTime = Date.now() - startTime;
    return createResponse(null, `Function error: ${error.message}`, 500, executionTime);
  }
});
