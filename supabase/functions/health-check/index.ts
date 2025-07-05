
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, createResponse, validateEnvironmentVars } from '../_shared/utils.ts';

serve(async (req) => {
  const startTime = Date.now();
  console.log('🏥 Health Check Function Started');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request handled');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🔍 Performing comprehensive health check...');
    
    const healthCheck = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      services: {
        edgeFunction: { status: 'healthy', latency: 0 },
        supabase: { status: 'unknown', latency: 0 },
        openai: { status: 'unknown', latency: 0 }
      },
      environment: {
        hasOpenAIKey: false,
        hasSupabaseUrl: false,
        hasSupabaseKey: false
      },
      diagnostics: [] as any[]
    };

    // Check environment variables
    console.log('🔑 Checking environment variables...');
    const envCheck = validateEnvironmentVars([
      'OPENAI_API_KEY', 
      'SUPABASE_URL', 
      'SUPABASE_SERVICE_ROLE_KEY'
    ]);
    
    healthCheck.environment = {
      hasOpenAIKey: envCheck.present.includes('OPENAI_API_KEY'),
      hasSupabaseUrl: envCheck.present.includes('SUPABASE_URL'),
      hasSupabaseKey: envCheck.present.includes('SUPABASE_SERVICE_ROLE_KEY')
    };

    // Test Supabase connection
    console.log('🗄️ Testing Supabase connection...');
    const supabaseStart = Date.now();
    try {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const { data, error } = await supabase
        .from('assistants')
        .select('count')
        .limit(1);
      
      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }
      
      healthCheck.services.supabase = {
        status: 'healthy',
        latency: Date.now() - supabaseStart
      };
      console.log('✅ Supabase connection: OK');
    } catch (error: any) {
      healthCheck.services.supabase = {
        status: 'error',
        latency: Date.now() - supabaseStart,
        error: error.message
      };
      console.error('❌ Supabase connection: FAILED', error.message);
    }

    // Test OpenAI connection (if API key is available)
    if (healthCheck.environment.hasOpenAIKey) {
      console.log('🤖 Testing OpenAI connection...');
      const openaiStart = Date.now();
      try {
        const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
        
        const response = await fetch('https://api.openai.com/v1/models', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        healthCheck.services.openai = {
          status: 'healthy',
          latency: Date.now() - openaiStart,
          modelCount: data.data?.length || 0
        };
        console.log('✅ OpenAI connection: OK');
      } catch (error: any) {
        healthCheck.services.openai = {
          status: 'error',
          latency: Date.now() - openaiStart,
          error: error.message
        };
        console.error('❌ OpenAI connection: FAILED', error.message);
      }
    } else {
      healthCheck.services.openai = {
        status: 'not_configured',
        latency: 0,
        error: 'OpenAI API key not configured'
      };
      console.warn('⚠️ OpenAI API key not configured');
    }

    // Determine overall health status
    const hasErrors = Object.values(healthCheck.services).some(
      service => service.status === 'error'
    );
    
    healthCheck.status = hasErrors ? 'degraded' : 'healthy';
    healthCheck.services.edgeFunction.latency = Date.now() - startTime;

    console.log('✅ Health check completed:', healthCheck.status);
    
    const executionTime = Date.now() - startTime;
    return createResponse(healthCheck, null, 200, executionTime);

  } catch (error: any) {
    console.error('❌ Health check function error:', error);
    const executionTime = Date.now() - startTime;
    return createResponse(null, `Health check failed: ${error.message}`, 500, executionTime);
  }
});
