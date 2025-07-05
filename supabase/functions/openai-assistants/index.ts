import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, createResponse, logError, validateEnvironmentVars } from '../_shared/utils.ts';

interface OpenAIAssistant {
  id: string;
  object: string;
  created_at: number;
  name: string | null;
  description: string | null;
  model: string;
  instructions: string | null;
  tools: any[];
  file_ids: string[];
  metadata: Record<string, any>;
  top_p: number | null;
  temperature: number | null;
  response_format: any;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const log = (step: string, data: any) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    step,
    data: typeof data === 'object' ? data : { message: data }
  };
  console.log(`[OpenAI Assistants] ${step}:`, logEntry.data);
  return logEntry;
};

const callOpenAI = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY in Edge Function secrets.');
  }

  const url = `https://api.openai.com/v1${endpoint}`;
  log('Making OpenAI API call', { url, method: options.method || 'GET' });

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
        ...options.headers,
      },
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    log('OpenAI API response', { status: response.status, ok: response.ok });

    if (!response.ok) {
      const errorText = await response.text();
      log('OpenAI API error', { status: response.status, error: errorText });
      
      if (response.status === 401) {
        throw new Error('OpenAI API authentication failed. Please check your API key.');
      } else if (response.status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please try again later.');
      } else if (response.status === 404) {
        throw new Error('OpenAI API endpoint not found. Please check the request.');
      } else {
        throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
      }
    }

    const responseData = await response.json();
    log('OpenAI API success', { dataType: typeof responseData, hasData: !!responseData });
    return responseData;
  } catch (error: any) {
    log('OpenAI API call failed', { error: error.message, stack: error.stack });
    throw error;
  }
};

const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('assistants')
      .select('count')
      .limit(1);
    
    if (error) {
      throw new Error(`Supabase connection failed: ${error.message}`);
    }
    
    log('Supabase connection test successful', { hasData: !!data });
    return true;
  } catch (error: any) {
    log('Supabase connection test failed', { error: error.message });
    throw error;
  }
};

serve(async (req) => {
  const startTime = Date.now();
  const diagnostics: any[] = [];
  
  console.log('🚀 OpenAI Assistants Function Started');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate environment configuration
    console.log('🔍 Validating environment variables...');
    const envCheck = validateEnvironmentVars([
      'OPENAI_API_KEY', 
      'SUPABASE_URL', 
      'SUPABASE_SERVICE_ROLE_KEY'
    ]);
    
    if (!envCheck.valid) {
      diagnostics.push(log('Environment validation failed', { issues: envCheck.missing }));
      const executionTime = Date.now() - startTime;
      return createResponse(null, `Configuration issues: ${envCheck.missing.join(', ')}`, 500, executionTime, diagnostics);
    }

    diagnostics.push(log('Environment validation passed', { variables: envCheck.valid }));

    // Validate request method
    if (req.method !== 'POST') {
      const error = `Method ${req.method} not allowed. Only POST requests are supported.`;
      diagnostics.push(log('Invalid request method', { method: req.method }));
      const executionTime = Date.now() - startTime;
      return createResponse(null, error, 405, executionTime, diagnostics);
    }

    // Parse request body
    let requestBody;
    try {
      const rawBody = await req.text();
      
      if (!rawBody.trim()) {
        throw new Error('Request body is empty');
      }
      
      requestBody = JSON.parse(rawBody);
      diagnostics.push(log('Request body parsed', { 
        hasAction: !!requestBody.action,
        action: requestBody.action,
        bodyKeys: Object.keys(requestBody || {})
      }));
    } catch (parseError: any) {
      const error = 'Invalid JSON in request body';
      diagnostics.push(log('JSON parse error', { error: parseError.message }));
      const executionTime = Date.now() - startTime;
      return createResponse(null, error, 400, executionTime, diagnostics);
    }

    // Extract action from request body
    const action = requestBody?.action;
    
    if (!action) {
      const error = 'Missing action parameter in request body';
      diagnostics.push(log('Missing action parameter', { requestBody }));
      const executionTime = Date.now() - startTime;
      return createResponse(null, error, 400, executionTime, diagnostics);
    }

    diagnostics.push(log('Processing action', { action }));

    switch (action) {
      case 'test': {
        diagnostics.push(log('Testing connections', { step: 'starting' }));
        
        try {
          // Test OpenAI connection
          const openaiTest = await callOpenAI('/models');
          diagnostics.push(log('OpenAI connection test successful', {
            modelsCount: openaiTest.data?.length || 0
          }));

          // Test Supabase connection
          await testSupabaseConnection();
          diagnostics.push(log('Supabase connection test successful', {}));

          const executionTime = Date.now() - startTime;
          return createResponse({
            connectionStatus: 'connected',
            openaiModels: openaiTest.data?.length || 0,
            supabaseConnected: true
          }, null, 200, executionTime, diagnostics);

        } catch (error: any) {
          diagnostics.push(log('Connection test failed', { error: error.message }));
          const executionTime = Date.now() - startTime;
          return createResponse(null, `Connection test failed: ${error.message}`, 503, executionTime, diagnostics);
        }
      }

      case 'list': {
        diagnostics.push(log('Fetching assistants from OpenAI', { endpoint: '/assistants' }));
        
        try {
          const response = await callOpenAI('/assistants?limit=100&order=desc');
          
          diagnostics.push(log('OpenAI assistants response', {
            status: 'success',
            count: response.data?.length || 0,
            assistants: response.data?.map((a: any) => ({ id: a.id, name: a.name, model: a.model })).slice(0, 5) || []
          }));

          const executionTime = Date.now() - startTime;
          return createResponse(response.data as OpenAIAssistant[], null, 200, executionTime, diagnostics);

        } catch (error: any) {
          diagnostics.push(log('List assistants failed', { error: error.message }));
          const executionTime = Date.now() - startTime;
          return createResponse(null, `Failed to list assistants: ${error.message}`, 503, executionTime, diagnostics);
        }
      }

      case 'get': {
        const { assistantId } = requestBody;
        
        if (!assistantId) {
          const error = 'Missing assistantId parameter for get action';
          diagnostics.push(log('Missing assistantId', { requestBody }));
          return new Response(JSON.stringify({ 
            success: false, 
            error,
            diagnostics 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        diagnostics.push(log('Fetching single assistant', { assistantId }));
        
        const assistant = await callOpenAI(`/assistants/${assistantId}`);
        
        diagnostics.push(log('Single assistant response', {
          status: 'success',
          assistant: {
            id: assistant.id,
            name: assistant.name,
            instructions: assistant.instructions?.substring(0, 100) + '...'
          }
        }));

        return new Response(JSON.stringify({
          success: true,
          data: assistant as OpenAIAssistant,
          diagnostics
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'create': {
        const { name, description, instructions, model, tools, temperature, top_p, metadata } = requestBody;
        
        if (!name || !instructions || !model) {
          const error = 'Missing required parameters for create action: name, instructions, model';
          diagnostics.push(log('Missing required create parameters', { 
            hasName: !!name, 
            hasInstructions: !!instructions, 
            hasModel: !!model 
          }));
          return new Response(JSON.stringify({ 
            success: false, 
            error,
            diagnostics 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        diagnostics.push(log('Creating new assistant on OpenAI', { name, model }));

        const newAssistant = await callOpenAI('/assistants', {
          method: 'POST',
          body: JSON.stringify({
            name,
            description,
            instructions,
            model,
            tools: tools || [],
            temperature,
            top_p,
            metadata: metadata || {}
          })
        });

        diagnostics.push(log('Assistant creation response', {
          status: 'success',
          assistantId: newAssistant.id,
          name: newAssistant.name
        }));

        return new Response(JSON.stringify({
          success: true,
          data: newAssistant as OpenAIAssistant,
          diagnostics
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update': {
        const { assistantId, updates } = requestBody;
        
        if (!assistantId || !updates) {
          const error = 'Missing assistantId or updates parameter for update action';
          diagnostics.push(log('Missing update parameters', { 
            hasAssistantId: !!assistantId, 
            hasUpdates: !!updates 
          }));
          return new Response(JSON.stringify({ 
            success: false, 
            error,
            diagnostics 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        diagnostics.push(log('Updating assistant on OpenAI', { assistantId, updates }));

        const updatedAssistant = await callOpenAI(`/assistants/${assistantId}`, {
          method: 'POST',
          body: JSON.stringify({
            name: updates.name,
            description: updates.description,
            instructions: updates.instructions,
            model: updates.model,
            tools: updates.tools || [],
            temperature: updates.temperature,
            top_p: updates.top_p,
            metadata: updates.metadata || {}
          })
        });

        diagnostics.push(log('Assistant update response', {
          status: 'success',
          assistantId,
          updatedFields: Object.keys(updates)
        }));

        return new Response(JSON.stringify({
          success: true,
          data: updatedAssistant as OpenAIAssistant,
          diagnostics
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'delete': {
        const { assistantId } = requestBody;
        
        if (!assistantId) {
          const error = 'Missing assistantId parameter for delete action';
          diagnostics.push(log('Missing assistantId for delete', { requestBody }));
          return new Response(JSON.stringify({ 
            success: false, 
            error,
            diagnostics 
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        diagnostics.push(log('Deleting assistant from OpenAI', { assistantId }));

        await callOpenAI(`/assistants/${assistantId}`, {
          method: 'DELETE'
        });

        diagnostics.push(log('Assistant deletion response', {
          status: 'success',
          assistantId
        }));

        return new Response(JSON.stringify({
          success: true,
          data: { deleted: true },
          diagnostics
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'sync': {
        diagnostics.push(log('Starting sync operation', { timestamp: new Date().toISOString() }));

        try {
          // Fetch assistants from OpenAI
          const response = await callOpenAI('/assistants?limit=100&order=desc');
          const openaiAssistants = response.data as OpenAIAssistant[];

          diagnostics.push(log('Fetched assistants from OpenAI', { count: openaiAssistants.length }));

          const errors: any[] = [];
          let synced = 0;

          // Test Supabase connection before syncing
          await testSupabaseConnection();

          // Sync each assistant to database with OpenAI ID
          for (const assistant of openaiAssistants) {
            try {
              diagnostics.push(log('Syncing assistant to database', { 
                id: assistant.id, 
                name: assistant.name,
                isOpenAIId: assistant.id.startsWith('asst_')
              }));

              const { error } = await supabase
                .from('assistants')
                .upsert({
                  id: assistant.id,
                  name: assistant.name || 'Unnamed Assistant',
                  description: assistant.description,
                  system_prompt: assistant.instructions || '',
                  model: assistant.model,
                  temperature: assistant.temperature || 0.7,
                  max_tokens: 1000,
                  top_p: assistant.top_p || 1.0,
                  frequency_penalty: 0.0,
                  presence_penalty: 0.0,
                  tools: assistant.tools || [],
                  metadata: assistant.metadata || {},
                  is_active: true,
                  created_at: new Date(assistant.created_at * 1000).toISOString(),
                  updated_at: new Date().toISOString()
                }, {
                  onConflict: 'id'
                });

              if (error) {
                errors.push({ assistantId: assistant.id, error: error.message });
                diagnostics.push(log('Sync error for assistant', { assistantId: assistant.id, error: error.message }));
              } else {
                synced++;
                diagnostics.push(log('Successfully synced assistant', { assistantId: assistant.id, name: assistant.name }));
              }
            } catch (syncError: any) {
              errors.push({ assistantId: assistant.id, error: syncError.message });
              diagnostics.push(log('Sync exception for assistant', { assistantId: assistant.id, error: syncError.message }));
            }
          }

          diagnostics.push(log('Sync operation completed', {
            totalAssistants: openaiAssistants.length,
            synced,
            errors: errors.length
          }));

          const executionTime = Date.now() - startTime;
          return createResponse({ synced, errors }, null, 200, executionTime, diagnostics);

        } catch (error: any) {
          diagnostics.push(log('Sync operation failed', { error: error.message }));
          const executionTime = Date.now() - startTime;
          return createResponse(null, `Sync failed: ${error.message}`, 503, executionTime, diagnostics);
        }
      }

      default:
        const error = `Invalid action: ${action}. Supported actions: test, list, get, create, update, delete, sync`;
        diagnostics.push(log('Invalid action', { action, supportedActions: ['test', 'list', 'get', 'create', 'update', 'delete', 'sync'] }));
        const executionTime = Date.now() - startTime;
        return createResponse(null, error, 400, executionTime, diagnostics);
    }
  } catch (error: any) {
    diagnostics.push(log('Unhandled error in openai-assistants function', {
      error: error.message,
      stack: error.stack
    }));

    await logError('openai-assistants', error);
    const executionTime = Date.now() - startTime;
    return createResponse(null, `Function error: ${error.message}`, 500, executionTime, diagnostics);
  }
});
