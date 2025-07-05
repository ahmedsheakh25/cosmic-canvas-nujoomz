
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, createResponse, logError, validateEnvironmentVars } from '../_shared/utils.ts';

interface DistributeTasksRequest {
  projectBriefId: string;
  priority?: 'low' | 'medium' | 'high';
  assignTo?: string;
}

serve(async (req) => {
  const startTime = Date.now();
  console.log('🚀 Distribute Tasks Function Started');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request handled');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🔍 Validating environment variables...');
    
    // Validate environment variables
    const envCheck = validateEnvironmentVars([
      'OPENAI_API_KEY', 
      'SUPABASE_URL', 
      'SUPABASE_SERVICE_ROLE_KEY'
    ]);
    if (!envCheck.valid) {
      console.error('❌ Missing environment variables:', envCheck.missing.join(', '));
      throw new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`);
    }

    console.log('✅ Environment variables validated');

    // Parse request body
    let requestBody: DistributeTasksRequest;
    try {
      requestBody = await req.json();
      console.log('✅ Request body parsed successfully');
    } catch (error) {
      console.error('❌ Failed to parse request body:', error);
      throw new Error('Invalid JSON in request body');
    }

    const { projectBriefId, priority = 'medium', assignTo } = requestBody;
    
    if (!projectBriefId) {
      console.error('❌ Missing projectBriefId');
      throw new Error('Project brief ID is required');
    }

    console.log('✅ Request validation passed');
    console.log(`📊 Distributing tasks for project brief: ${projectBriefId}`);

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Test Supabase connection
    console.log('🔗 Testing Supabase connection...');
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
      throw new Error('Failed to connect to Supabase');
    }

    // Test OpenAI API connection
    console.log('🤖 Testing OpenAI API connection...');
    try {
      const testResponse = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!testResponse.ok) {
        console.error('❌ OpenAI API test failed:', testResponse.status, testResponse.statusText);
        const errorText = await testResponse.text();
        throw new Error(`OpenAI API error (${testResponse.status}): ${errorText}`);
      }
      console.log('✅ OpenAI API connection verified');
    } catch (error) {
      console.error('❌ OpenAI API connection error:', error);
      throw new Error(`OpenAI API connection failed: ${error.message}`);
    }

    // Get project brief data
    console.log('📖 Fetching project brief data...');
    const { data: briefData, error: briefError } = await supabase
      .from('project_briefs')
      .select('*')
      .eq('id', projectBriefId)
      .single();

    if (briefError) {
      console.error('❌ Brief lookup error:', briefError.message);
      throw new Error(`Brief lookup error: ${briefError.message}`);
    }

    if (!briefData) {
      console.error('❌ Project brief not found');
      throw new Error('Project brief not found');
    }

    console.log('✅ Project brief data retrieved');

    // Get available team members (optional)
    console.log('👥 Fetching team members...');
    const { data: teamMembers, error: teamError } = await supabase
      .from('team_members')
      .select('*');

    if (teamError) {
      console.warn('⚠️ Team members lookup failed:', teamError.message);
      // Continue without team members if the table doesn't exist or is empty
    }

    console.log(`👥 Found ${teamMembers?.length || 0} team members`);

    // Use AI to analyze project and distribute tasks
    console.log('🧠 Generating task distribution with AI...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `أنت مدير مشاريع خبير في توزيع المهام. بناءً على بيانات المشروع وأعضاء الفريق المتاحين، قم بتحليل المشروع وإنشاء قائمة مهام مفصلة.

${teamMembers && teamMembers.length > 0 ? `أعضاء الفريق المتاحون:\n${JSON.stringify(teamMembers, null, 2)}` : 'لا توجد بيانات فريق متاحة - إنشاء مهام عامة'}

أجب بصيغة JSON مع المهام:
{
  "tasks": [
    {
      "title": "عنوان المهمة",
      "description": "وصف تفصيلي",
      "service_type": "نوع الخدمة",
      "assigned_to": "معرف عضو الفريق أو null",
      "priority": 1-5,
      "estimated_hours": عدد الساعات المقدرة
    }
  ]
}`
          },
          {
            role: 'user',
            content: `بيانات المشروع: ${JSON.stringify(briefData.brief_data)}`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI task distribution failed:', response.status, errorText);
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    const aiData = await response.json();
    const aiResponse = aiData.choices[0]?.message?.content;
    
    if (!aiResponse) {
      console.error('❌ No response from OpenAI');
      throw new Error('No response from OpenAI');
    }

    console.log('✅ AI analysis completed');

    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
      console.log('✅ AI response parsed successfully');
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError);
      console.log('Raw AI response:', aiResponse);
      throw new Error(`Failed to parse AI response: ${parseError.message}`);
    }

    if (!analysis.tasks || !Array.isArray(analysis.tasks)) {
      console.error('❌ Invalid AI response format - no tasks array');
      throw new Error('Invalid AI response format - no tasks array');
    }

    console.log(`📋 Generated ${analysis.tasks.length} tasks`);

    // Insert tasks into database
    const tasksToInsert = analysis.tasks.map((task: any) => ({
      project_brief_id: projectBriefId,
      title: task.title,
      description: task.description,
      service_type: task.service_type,
      assigned_to: assignTo || task.assigned_to,
      priority: task.priority || 3,
      estimated_hours: task.estimated_hours,
      status: 'pending'
    }));

    console.log('💾 Inserting tasks into database...');
    const { data: insertedTasks, error: insertError } = await supabase
      .from('tasks')
      .insert(tasksToInsert)
      .select('*');

    if (insertError) {
      console.error('❌ Task insertion error:', insertError.message);
      throw new Error(`Task insertion error: ${insertError.message}`);
    }

    console.log(`✅ ${insertedTasks?.length || 0} tasks inserted successfully`);

    // Log the activity
    try {
      await supabase
        .from('admin_activity_log')
        .insert({
          action_type: 'tasks_distributed',
          description: `${insertedTasks?.length || 0} tasks distributed for project brief`,
          project_brief_id: projectBriefId,
          created_by: 'distribute_tasks_function'
        });
      console.log('✅ Activity logged');
    } catch (logError) {
      console.warn('⚠️ Failed to log activity but continuing:', logError);
    }

    const executionTime = Date.now() - startTime;
    console.log(`✅ Task distribution completed successfully in ${executionTime}ms`);

    return createResponse({
      success: true,
      tasks: insertedTasks,
      totalTasks: insertedTasks?.length || 0,
      projectBriefId,
      distributionSummary: {
        priority,
        assignedTo: assignTo,
        createdAt: new Date().toISOString()
      }
    }, null, 200, executionTime);

  } catch (error) {
    console.error('❌ Distribute tasks function error:', error);
    await logError('distribute-tasks', error);
    const executionTime = Date.now() - startTime;
    return createResponse(null, `Task distribution error: ${error.message}`, 500, executionTime);
  }
});
