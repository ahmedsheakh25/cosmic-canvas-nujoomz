
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, createResponse, logError, validateEnvironmentVars } from '../_shared/utils.ts';

interface WorkflowRequest {
  sessionId: string;
  projectData: {
    service: string;
    description: string;
    audience?: string;
    style?: string;
    budget?: string;
    deadline?: string;
    language?: string;
    [key: string]: any; // Allow additional fields
  };
  conversationHistory: string[];
  clientName?: string;
  clientEmail?: string;
  skipTrello?: boolean;
}

interface WorkflowResponse {
  success: boolean;
  message: string;
  briefId?: string;
  suggestions?: string;
  trelloCard?: {
    name: string;
    url: string;
    shortUrl: string;
  };
  timestamp: string;
  workflowAnalysis?: string;
  projectBrief?: any;
  tasksDistributed?: boolean;
  trelloCardCreated?: boolean;
  completedSteps?: {
    analysis: boolean;
    briefCreation: boolean;
    taskDistribution?: boolean;
    trelloIntegration?: boolean;
  };
  metadata?: {
    executionTime: number;
    language: string;
    clientName?: string;
  };
}

serve(async (req) => {
  const startTime = Date.now();
  console.log('🚀 Nujmooz Workflow Function Started');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request handled');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🔍 Validating environment variables...');
    
    // Validate environment variables first
    const envCheck = validateEnvironmentVars([
      'OPENAI_API_KEY', 
      'SUPABASE_URL', 
      'SUPABASE_SERVICE_ROLE_KEY'
    ]);
    
    if (!envCheck.valid) {
      console.error('❌ Missing environment variables:', envCheck.missing.join(', '));
      const executionTime = Date.now() - startTime;
      return createResponse(null, `Missing environment variables: ${envCheck.missing.join(', ')}`, 500, executionTime);
    }

    console.log('✅ Environment variables validated');

    // Parse request body with enhanced error handling
    let requestBody: WorkflowRequest;
    try {
      const rawBody = await req.text();
      console.log('📝 Raw request body length:', rawBody.length);
      
      if (!rawBody.trim()) {
        throw new Error('Request body is empty');
      }
      
      requestBody = JSON.parse(rawBody);
      console.log('✅ Request body parsed successfully');
    } catch (error) {
      console.error('❌ Failed to parse request body:', error);
      const executionTime = Date.now() - startTime;
      return createResponse(null, `Invalid JSON in request body: ${error.message}`, 400, executionTime);
    }

    const { sessionId, projectData, conversationHistory, clientName, clientEmail, skipTrello = false } = requestBody;
    
    // Enhanced validation with detailed error messages
    const validationErrors: string[] = [];
    
    if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
      validationErrors.push('sessionId is required and must be a non-empty string');
    }
    
    if (!projectData) {
      validationErrors.push('projectData is required');
    } else {
      if (!projectData.service || typeof projectData.service !== 'string' || projectData.service.trim() === '') {
        validationErrors.push('projectData.service is required and must be a non-empty string');
      }
      if (!projectData.description || typeof projectData.description !== 'string' || projectData.description.trim() === '') {
        validationErrors.push('projectData.description is required and must be a non-empty string');
      }
    }
    
    if (!conversationHistory) {
      validationErrors.push('conversationHistory is required');
    } else if (!Array.isArray(conversationHistory)) {
      validationErrors.push('conversationHistory must be an array');
    } else if (!conversationHistory.every(msg => typeof msg === 'string')) {
      validationErrors.push('All items in conversationHistory must be strings');
    }

    if (validationErrors.length > 0) {
      console.error('❌ Validation errors:', validationErrors);
      const executionTime = Date.now() - startTime;
      return createResponse(null, `Validation errors: ${validationErrors.join(', ')}`, 400, executionTime);
    }

    console.log('✅ Request validation passed');
    console.log('📊 Processing workflow for session:', sessionId);

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Test Supabase connection with better error handling
    try {
      const { data: testData, error: testError } = await supabase
        .from('user_sessions')
        .select('count')
        .limit(1);
      
      if (testError) {
        console.error('❌ Supabase connection test failed:', testError.message);
        throw new Error(`Supabase connection failed: ${testError.message}`);
      }
      console.log('✅ Supabase connection verified');
    } catch (error) {
      console.error('❌ Supabase connection error:', error);
      const executionTime = Date.now() - startTime;
      return createResponse(null, `Database connection failed: ${error.message}`, 503, executionTime);
    }

    // Test OpenAI API with timeout
    console.log('🤖 Testing OpenAI API...');
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
        throw new Error(`OpenAI API error (${testResponse.status}): ${errorText}`);
      }
      console.log('✅ OpenAI API connection verified');
    } catch (error) {
      console.error('❌ OpenAI API connection error:', error);
      const executionTime = Date.now() - startTime;
      return createResponse(null, `OpenAI API connection failed: ${error.message}`, 503, executionTime);
    }

    // Set default values for optional fields
    const safeProjectData = {
      service: projectData.service,
      description: projectData.description,
      audience: projectData.audience || 'General audience',
      style: projectData.style || 'Professional',
      budget: projectData.budget || 'To be discussed',
      deadline: projectData.deadline || 'Flexible',
      language: projectData.language || 'en',
      ...projectData // Include any additional fields
    };

    // Generate workflow analysis with better prompt structure
    console.log('🧠 Generating workflow analysis...');
    const conversationSample = conversationHistory.slice(-10).join('\n'); // Use last 10 messages to avoid token limits
    
    const workflowPrompt = safeProjectData.language === 'ar' 
      ? `أنت نجموز 👽، مساعد إبداعي خبير. حلل هذا المشروع وقدم خطة عمل شاملة:

المشروع: ${safeProjectData.service}
الوصف: ${safeProjectData.description}
الجمهور: ${safeProjectData.audience}
الأسلوب: ${safeProjectData.style}
الميزانية: ${safeProjectData.budget}
المهلة الزمنية: ${safeProjectData.deadline}

تاريخ المحادثة: ${conversationSample}

قدم استجابة تشمل:
1. تحليل المتطلبات
2. خطة العمل المقترحة
3. التقديرات الزمنية
4. التوصيات الإبداعية`
      : `You are Nujmooz 👽, an expert creative assistant. Analyze this project and provide a comprehensive workflow plan:

Project: ${safeProjectData.service}
Description: ${safeProjectData.description}
Audience: ${safeProjectData.audience}
Style: ${safeProjectData.style}
Budget: ${safeProjectData.budget}
Timeline: ${safeProjectData.deadline}

Conversation History: ${conversationSample}

Provide a response that includes:
1. Requirements analysis
2. Suggested workflow plan
3. Time estimates
4. Creative recommendations`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14', // Updated to supported model
        messages: [
          {
            role: 'system',
            content: safeProjectData.language === 'ar' 
              ? 'أنت نجموز 👽، مساعد إبداعي متخصص في تحليل المشاريع وتطوير خطط العمل الشاملة.'
              : 'You are Nujmooz 👽, a creative assistant specialized in project analysis and comprehensive workflow development.'
          },
          {
            role: 'user',
            content: workflowPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      }),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI workflow analysis failed:', response.status, errorText);
      const executionTime = Date.now() - startTime;
      return createResponse(null, `OpenAI API error (${response.status}): ${errorText}`, 503, executionTime);
    }

    const aiData = await response.json();
    const workflowAnalysis = aiData.choices[0]?.message?.content;
    
    if (!workflowAnalysis) {
      console.error('❌ No workflow analysis returned from OpenAI');
      const executionTime = Date.now() - startTime;
      return createResponse(null, 'No workflow analysis returned from OpenAI', 500, executionTime);
    }

    console.log('✅ Workflow analysis generated successfully');

    // Create project brief with better error handling
    console.log('📝 Creating project brief...');
    
    // First, get or create user session
    const { data: sessionData, error: sessionError } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (sessionError && sessionError.code !== 'PGRST116') {
      console.error('❌ Error fetching session:', sessionError);
      const executionTime = Date.now() - startTime;
      return createResponse(null, `Session lookup error: ${sessionError.message}`, 500, executionTime);
    }

    // If session doesn't exist, create it
    if (!sessionData) {
      console.log('🆕 Creating new user session...');
      const { data: newSession, error: createError } = await supabase
        .from('user_sessions')
        .insert({
          session_id: sessionId,
          language_preference: safeProjectData.language
        })
        .select()
        .maybeSingle();

      if (createError) {
        console.error('❌ Error creating session:', createError);
        const executionTime = Date.now() - startTime;
        return createResponse(null, `Failed to create session: ${createError.message}`, 500, executionTime);
      }
    }

    // Create project brief - using only sessionId, not user_id
    const { data: briefData, error: briefError } = await supabase
      .from('project_briefs')
      .insert({
        session_id: sessionId, // Use session_id instead of user_id
        brief_data: safeProjectData,
        client_info: { 
          name: clientName || null,
          email: clientEmail || null
        },
        language: safeProjectData.language,
        status: 'New'
      })
      .select()
      .maybeSingle();

    if (briefError) {
      console.error('❌ Error creating project brief:', briefError);
      const executionTime = Date.now() - startTime;
      return createResponse(null, `Brief creation error: ${briefError.message}`, 500, executionTime);
    }

    console.log('✅ Project brief created successfully');

    // Try to distribute tasks (optional - graceful failure)
    let tasksDistributed = false;
    if (briefData?.id) {
      try {
        console.log('📋 Attempting to distribute tasks...');
        const { data: tasksData, error: tasksError } = await supabase.functions.invoke('distribute-tasks', {
          body: { projectBriefId: briefData.id }
        });
        
        if (!tasksError && tasksData?.success) {
          tasksDistributed = true;
          console.log('✅ Tasks distributed successfully');
        } else {
          console.warn('⚠️ Task distribution failed but continuing:', tasksError?.message || 'Unknown error');
        }
      } catch (error) {
        console.warn('⚠️ Task distribution failed but continuing:', error.message);
      }
    }

    // Try to create Trello card (optional - graceful failure)
    let trelloCardCreated = false;
    let trelloCardInfo = null;
    if (!skipTrello && briefData?.id) {
      try {
        console.log('📋 Attempting to create Trello card...');
        const { data: trelloData, error: trelloError } = await supabase.functions.invoke('create-trello-card', {
          body: { 
            briefId: briefData.id, 
            briefData: {
              ...safeProjectData,
              client_info: { 
                name: clientName || null,
                email: clientEmail || null
              },
              created_at: briefData.created_at
            }
          }
        });
        
        if (!trelloError && trelloData?.success) {
          trelloCardCreated = true;
          trelloCardInfo = {
            name: `Project: ${safeProjectData.service}`,
            url: trelloData.cardUrl || '#',
            shortUrl: trelloData.cardUrl || '#'
          };
          console.log('✅ Trello card created successfully');
        } else {
          console.warn('⚠️ Trello card creation failed but continuing:', trelloError?.message || 'Unknown error');
        }
      } catch (error) {
        console.warn('⚠️ Trello card creation failed but continuing:', error.message);
      }
    }

    const executionTime = Date.now() - startTime;
    console.log(`✅ Workflow completed successfully in ${executionTime}ms`);

    // Prepare response in the expected format for WorkflowTester
    const workflowResponse: WorkflowResponse = {
      success: true,
      message: safeProjectData.language === 'ar' 
        ? `تم إنشاء موجز المشروع بنجاح! 👽✨`
        : `Project brief created successfully! 👽✨`,
      briefId: briefData?.id || 'unknown',
      suggestions: workflowAnalysis,
      trelloCard: trelloCardInfo,
      timestamp: new Date().toISOString(),
      workflowAnalysis,
      projectBrief: briefData,
      tasksDistributed,
      trelloCardCreated,
      completedSteps: {
        analysis: true,
        briefCreation: true,
        taskDistribution: tasksDistributed,
        trelloIntegration: trelloCardCreated
      },
      metadata: {
        executionTime,
        language: safeProjectData.language,
        clientName: clientName || null
      }
    };

    return createResponse(workflowResponse, null, 200, executionTime);

  } catch (error) {
    console.error('❌ Workflow function error:', error);
    await logError('nujmooz-workflow', error);
    const executionTime = Date.now() - startTime;
    
    // Return error in expected format
    const errorResponse: WorkflowResponse = {
      success: false,
      message: `Workflow error: ${error.message}`,
      timestamp: new Date().toISOString()
    };
    
    return createResponse(errorResponse, `Workflow error: ${error.message}`, 500, executionTime);
  }
});
