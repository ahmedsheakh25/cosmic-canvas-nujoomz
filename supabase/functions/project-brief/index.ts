
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, createResponse, sanitizeSessionId, logError, validateEnvironmentVars } from '../_shared/utils.ts';

interface ProjectBriefRequest {
  session_id: string;
  briefData: {
    service: string;
    answers: Record<string, any>;
    language?: 'en' | 'ar';
    [key: string]: any;
  };
}

serve(async (req) => {
  const startTime = Date.now();
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return createResponse(null, `Method ${req.method} not allowed`, 405);
  }

  try {
    // Validate environment variables
    const envCheck = validateEnvironmentVars(['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']);
    if (!envCheck.valid) {
      throw new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`);
    }

    const requestBody = await req.json();
    const { session_id, briefData }: ProjectBriefRequest = requestBody;

    if (!session_id) {
      throw new Error('Missing session_id in request');
    }

    if (!briefData || !briefData.service) {
      throw new Error('Missing briefData or service in request');
    }

    // Sanitize session ID to ensure it's a valid UUID
    const validSessionId = sanitizeSessionId(session_id);
    console.log(`Processing project brief for session: ${validSessionId}`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get or create user by session_id
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('session_id', validSessionId)
      .maybeSingle();

    if (userError && userError.code !== 'PGRST116') {
      throw new Error(`User lookup error: ${userError.message}`);
    }

    // If user doesn't exist, create one
    if (!user) {
      console.log(`Creating new user for session: ${validSessionId}`);
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({ 
          session_id: validSessionId,
          language_preference: briefData.language || 'en'
        })
        .select('id')
        .single();

      if (createError) {
        throw new Error(`User creation error: ${createError.message}`);
      }
      user = newUser;
    }

    // Enhanced brief data with metadata
    const enhancedBriefData = {
      ...briefData,
      created_at: new Date().toISOString(),
      session_id: validSessionId,
      processing_status: 'completed'
    };

    // Insert the project brief
    const { data: briefResult, error: briefError } = await supabase
      .from('project_briefs')
      .insert({
        user_id: user.id,
        brief_data: enhancedBriefData,
        status: 'New'
      })
      .select()
      .single();

    if (briefError) {
      throw new Error(`Brief creation error: ${briefError.message}`);
    }

    // Log the activity
    await supabase
      .from('admin_activity_log')
      .insert({
        action_type: 'brief_created',
        description: `Project brief created for service: ${briefData.service}`,
        project_brief_id: briefResult.id,
        created_by: 'project_brief_function'
      });

    const executionTime = Date.now() - startTime;
    console.log(`Project brief created successfully with ID: ${briefResult.id} in ${executionTime}ms`);

    return createResponse({
      success: true,
      briefId: briefResult.id,
      sessionId: validSessionId,
      status: 'created',
      briefData: enhancedBriefData
    }, null, 200, executionTime);

  } catch (error) {
    await logError('project-brief', error);
    const executionTime = Date.now() - startTime;
    return createResponse(null, error.message, 500, executionTime);
  }
});
