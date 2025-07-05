import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, createResponse, logError, validateEnvironmentVars } from '../_shared/utils.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const log = (step: string, data: any) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    step,
    data: typeof data === 'object' ? data : { message: data }
  };
  console.log(`[OpenAI Prompts Sync] ${step}:`, logEntry.data);
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
      signal: AbortSignal.timeout(30000)
    });

    if (!response.ok) {
      const errorText = await response.text();
      log('OpenAI API error', { status: response.status, error: errorText });
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    const responseData = await response.json();
    log('OpenAI API success', { dataType: typeof responseData, hasData: !!responseData });
    return responseData;
  } catch (error: any) {
    log('OpenAI API call failed', { error: error.message, stack: error.stack });
    throw error;
  }
};

// Sample design and creative prompts based on the image shown
const getBuiltInPrompts = () => [
  {
    title: "Design System Creation",
    description: "Comprehensive prompt for creating cohesive design systems",
    content: "Create a comprehensive design system for [PROJECT_TYPE]. Include color palette, typography, spacing, component library, and usage guidelines. Consider accessibility, scalability, and brand consistency.",
    category: "design",
    tags: ["design-system", "branding", "ui", "components"],
    is_template: true,
    is_public: true,
    openai_prompt_type: "creative",
    openai_source: "openai"
  },
  {
    title: "Dashboard UI Design Prompt",
    description: "Specialized prompt for dashboard interface design",
    content: "Design a modern, intuitive dashboard interface for [INDUSTRY/PURPOSE]. Include data visualization, navigation, responsive layout, and user experience considerations. Focus on information hierarchy and usability.",
    category: "design",
    tags: ["dashboard", "ui", "data-visualization", "ux"],
    is_template: true,
    is_public: true,
    openai_prompt_type: "creative",
    openai_source: "openai"
  },
  {
    title: "Presentation Design Prompt",
    description: "Professional presentation design guidance",
    content: "Create a compelling presentation design for [TOPIC]. Include slide layouts, visual hierarchy, color scheme, typography, and visual elements. Ensure clarity and engagement throughout.",
    category: "design",
    tags: ["presentation", "slides", "visual-design", "communication"],
    is_template: true,
    is_public: true,
    openai_prompt_type: "creative",
    openai_source: "openai"
  },
  {
    title: "Social Media Design",
    description: "Social media content design prompts",
    content: "Design engaging social media content for [PLATFORM] about [TOPIC]. Include post dimensions, brand consistency, call-to-action, and platform-specific best practices.",
    category: "marketing",
    tags: ["social-media", "content-design", "branding", "marketing"],
    is_template: true,
    is_public: true,
    openai_prompt_type: "creative",
    openai_source: "openai"
  },
  {
    title: "Web Design Prompt",
    description: "Comprehensive web design guidance",
    content: "Design a modern, responsive website for [BUSINESS_TYPE]. Include homepage layout, navigation structure, content hierarchy, mobile optimization, and conversion optimization.",
    category: "design",
    tags: ["web-design", "responsive", "ui", "ux"],
    is_template: true,
    is_public: true,
    openai_prompt_type: "creative",
    openai_source: "openai"
  },
  {
    title: "App Design Prompt | تصميم التطبيقات",
    description: "Mobile application design guidelines",
    content: "Design a user-friendly mobile application for [PURPOSE]. Include user interface, user experience, navigation flow, accessibility, and platform-specific guidelines.",
    category: "design",
    tags: ["mobile-app", "ui", "ux", "arabic", "bilingual"],
    is_template: true,
    is_public: true,
    openai_prompt_type: "creative",
    openai_source: "openai"
  },
  {
    title: "Website Design",
    description: "Professional website design approach",
    content: "Create a professional website design for [INDUSTRY]. Focus on user experience, conversion optimization, brand representation, and technical implementation considerations.",
    category: "design",
    tags: ["website", "professional", "conversion", "branding"],
    is_template: true,
    is_public: true,
    openai_prompt_type: "creative",
    openai_source: "openai"
  },
  {
    title: "Content Writing",
    description: "Comprehensive content creation guidance",
    content: "Write engaging content for [CONTENT_TYPE] targeting [AUDIENCE]. Include SEO optimization, brand voice, call-to-action, and engagement strategies.",
    category: "copywriting",
    tags: ["content-writing", "seo", "marketing", "engagement"],
    is_template: true,
    is_public: true,
    openai_prompt_type: "creative",
    openai_source: "openai"
  },
  {
    title: "Digital Marketing",
    description: "Strategic digital marketing guidance",
    content: "Develop a comprehensive digital marketing strategy for [BUSINESS]. Include target audience analysis, channel selection, content strategy, and performance metrics.",
    category: "marketing",
    tags: ["digital-marketing", "strategy", "analytics", "growth"],
    is_template: true,
    is_public: true,
    openai_prompt_type: "creative",
    openai_source: "openai"
  },
  {
    title: "Redesign",
    description: "Systematic redesign approach",
    content: "Redesign [EXISTING_DESIGN] with modern best practices. Analyze current issues, propose improvements, maintain brand consistency, and enhance user experience.",
    category: "design",
    tags: ["redesign", "improvement", "modernization", "ux"],
    is_template: true,
    is_public: true,
    openai_prompt_type: "creative",
    openai_source: "openai"
  }
];

serve(async (req) => {
  const startTime = Date.now();
  const diagnostics: any[] = [];
  
  console.log('🚀 OpenAI Prompts Sync Function Started');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate environment configuration
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

    // Parse request body
    let requestBody;
    try {
      const rawBody = await req.text();
      requestBody = rawBody ? JSON.parse(rawBody) : {};
    } catch (parseError) {
      requestBody = {};
    }

    const action = requestBody?.action || 'sync';
    diagnostics.push(log('Processing action', { action }));

    switch (action) {
      case 'sync': {
        diagnostics.push(log('Starting comprehensive prompts sync', {}));
        
        // Create sync operation record
        const { data: syncOp, error: syncOpError } = await supabase
          .from('openai_sync_operations')
          .insert({
            operation_type: 'sync_prompts',
            status: 'running',
            started_at: new Date().toISOString(),
            operation_details: { service: 'openai_prompts_comprehensive' }
          })
          .select()
          .single();

        if (syncOpError) {
          diagnostics.push(log('Failed to create sync operation record', { error: syncOpError.message }));
          throw new Error(`Failed to create sync operation: ${syncOpError.message}`);
        }

        try {
          const allPrompts = [];
          const errors = [];
          
          // 1. Fetch existing prompts that need to be synced to OpenAI
          const { data: localPrompts, error: localPromptsError } = await supabase
            .from('prompts')
            .select('*')
            .eq('openai_source', 'local')
            .is('openai_assistant_id', null);

          if (localPromptsError) {
            errors.push({ source: 'local_prompts', error: localPromptsError.message });
            diagnostics.push(log('Error fetching local prompts', { error: localPromptsError.message }));
          } else if (localPrompts) {
            allPrompts.push(...localPrompts);
            diagnostics.push(log('Found local prompts to sync', { count: localPrompts.length }));
          }
          
          // 2. Fetch assistants and extract their instructions
          try {
            const assistantsResponse = await callOpenAI('/assistants?limit=100&order=desc');
            const assistants = assistantsResponse.data || [];
            
            diagnostics.push(log('Fetched assistants from OpenAI', { count: assistants.length }));
            
            for (const assistant of assistants) {
              if (assistant.instructions) {
                allPrompts.push({
                  title: `${assistant.name || 'Untitled Assistant'} - System Instructions`,
                  description: `System instructions from OpenAI Assistant: ${assistant.name}`,
                  content: assistant.instructions,
                  category: 'system',
                  tags: ['openai', 'assistant', 'system'],
                  is_template: true,
                  is_public: false,
                  usage_count: 0,
                  rating: 0,
                  openai_assistant_id: assistant.id,
                  openai_prompt_type: 'system',
                  openai_source: 'openai',
                  openai_synced_at: new Date().toISOString()
                });
              }
            }
          } catch (assistantError) {
            errors.push({ source: 'assistants', error: assistantError.message });
            diagnostics.push(log('Error fetching assistants', { error: assistantError.message }));
          }

          // 3. Add built-in creative and design prompts
          const builtInPrompts = getBuiltInPrompts();
          allPrompts.push(...builtInPrompts.map(prompt => ({
            ...prompt,
            usage_count: 0,
            rating: 0,
            openai_synced_at: new Date().toISOString()
          })));
          
          diagnostics.push(log('Added built-in prompts', { count: builtInPrompts.length }));

          // 4. Sync all prompts to database AND create in OpenAI
          let synced = 0;
          let openaiCreated = 0;
          const syncErrors = [];

          for (const prompt of allPrompts) {
            try {
              // Check if prompt already exists in database
              const { data: existingPrompt } = await supabase
                .from('prompts')
                .select('id, openai_assistant_id')
                .eq('title', prompt.title)
                .maybeSingle();

              let openaiAssistantId = prompt.openai_assistant_id;

              // If this is a local prompt without an OpenAI assistant ID, create it in OpenAI
              if (prompt.openai_source === 'local' && !openaiAssistantId) {
                try {
                  diagnostics.push(log('Creating OpenAI assistant for local prompt', { title: prompt.title }));
                  
                  const assistantResponse = await callOpenAI('/assistants', {
                    method: 'POST',
                    body: JSON.stringify({
                      name: prompt.title,
                      description: prompt.description || `AI Assistant for ${prompt.title}`,
                      instructions: prompt.content,
                      model: 'gpt-4.1-2025-04-14', 
                      tools: [],
                      metadata: {
                        source: 'ofspace_studio',
                        category: prompt.category,
                        tags: prompt.tags?.join(',') || '',
                        created_via: 'prompt_sync',
                        original_source: 'local'
                      }
                    })
                  });

                  openaiAssistantId = assistantResponse.id;
                  openaiCreated++;
                  
                  diagnostics.push(log('Successfully created OpenAI assistant for local prompt', { 
                    title: prompt.title,
                    assistantId: openaiAssistantId 
                  }));
                } catch (openaiError: any) {
                  diagnostics.push(log('Failed to create OpenAI assistant for local prompt', {
                    title: prompt.title,
                    error: openaiError.message
                  }));
                  
                  syncErrors.push({
                    promptTitle: prompt.title,
                    operation: 'create_openai_assistant',
                    error: openaiError.message
                  });
                  continue; // Skip database update if OpenAI creation fails
                }
              }

              // Only update database for successfully created OpenAI assistants or existing ones
              if (openaiAssistantId || prompt.openai_source === 'openai') {
                const dbPromptData = {
                  title: prompt.title,
                  description: prompt.description || '',
                  content: prompt.content,
                  category: prompt.category || 'general',
                  tags: prompt.tags || [],
                  is_template: prompt.is_template || false,
                  is_public: prompt.is_public || false,
                  openai_assistant_id: openaiAssistantId,
                  openai_prompt_type: prompt.openai_prompt_type || 'custom',
                  openai_source: openaiAssistantId 
                    ? 'synced' 
                    : (prompt.openai_source === 'openai' ? 'openai' : 'local'),
                  openai_synced_at: openaiAssistantId ? new Date().toISOString() : null
                };

                const { error } = existingPrompt
                  ? await supabase
                      .from('prompts')
                      .update(dbPromptData)
                      .eq('id', existingPrompt.id)
                  : await supabase
                      .from('prompts')
                      .insert({
                        ...dbPromptData,
                        usage_count: prompt.usage_count || 0,
                        rating: prompt.rating || 0
                      });

                if (error) {
                  syncErrors.push({
                    promptTitle: prompt.title,
                    error: error.message
                  });
                  diagnostics.push(log('Database sync error for prompt', {
                    title: prompt.title,
                    error: error.message
                  }));
                } else {
                  synced++;
                  diagnostics.push(log('Successfully synced prompt to database', {
                    title: prompt.title,
                    isUpdate: !!existingPrompt,
                    hasOpenAIAssistant: !!openaiAssistantId
                  }));
                }
              }
            } catch (syncError: any) {
              syncErrors.push({
                promptTitle: prompt.title,
                error: syncError.message
              });
              diagnostics.push(log('Sync exception for prompt', {
                title: prompt.title,
                error: syncError.message
              }));
            }
          }

          // Update sync operation
          const finalStatus = syncErrors.length === 0 
            ? 'completed' 
            : (synced > 0 ? 'completed_with_errors' : 'failed');

          await supabase
            .from('openai_sync_operations')
            .update({
              status: finalStatus,
              completed_at: new Date().toISOString(),
              items_processed: allPrompts.length,
              items_synced: synced,
              error_count: syncErrors.length,
              error_details: [...errors, ...syncErrors]
            })
            .eq('id', syncOp.id);

          diagnostics.push(log('Comprehensive prompts sync completed', {
            totalPrompts: allPrompts.length,
            synced,
            openaiCreated,
            errors: syncErrors.length + errors.length
          }));

          const executionTime = Date.now() - startTime;
          return createResponse({
            synced,
            openaiCreated,
            totalProcessed: allPrompts.length,
            errors: [...errors, ...syncErrors],
            operation: { ...syncOp, status: finalStatus }
          }, null, 200, executionTime, diagnostics);

        } catch (error: any) {
          // Update sync operation as failed
          await supabase
            .from('openai_sync_operations')
            .update({
              status: 'failed',
              error_details: [{ operation: 'comprehensive_sync', error: error.message }]
            })
            .eq('id', syncOp.id);

          diagnostics.push(log('Comprehensive sync failed', { error: error.message }));
          const executionTime = Date.now() - startTime;
          return createResponse(null, `Comprehensive sync failed: ${error.message}`, 503, executionTime, diagnostics);
        }
      }

      default:
        const error = `Invalid action: ${action}. Supported actions: sync`;
        diagnostics.push(log('Invalid action', { action, supportedActions: ['sync'] }));
        const executionTime = Date.now() - startTime;
        return createResponse(null, error, 400, executionTime, diagnostics);
    }
  } catch (error: any) {
    diagnostics.push(log('Unhandled error in openai-prompts-sync function', {
      error: error.message,
      stack: error.stack
    }));

    await logError('openai-prompts-sync', error);
    const executionTime = Date.now() - startTime;
    return createResponse(null, `Function error: ${error.message}`, 500, executionTime, diagnostics);
  }
});