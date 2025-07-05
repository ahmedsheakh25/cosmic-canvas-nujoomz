
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, createResponse, logError, validateEnvironmentVars } from '../_shared/utils.ts';

interface SuggestServicesRequest {
  sessionId: string;
  conversationHistory: string[];
  userContext?: {
    language?: string;
    intent?: string;
    industry?: string;
  };
}

serve(async (req) => {
  const startTime = Date.now();
  console.log('🚀 Suggest Services Function Started');
  
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request handled');
    return new Response('ok', { headers: corsHeaders });
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

    // Parse request body with better error handling
    let requestBody: SuggestServicesRequest;
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

    const { sessionId, conversationHistory, userContext } = requestBody;
    
    // Enhanced validation with detailed error messages
    const validationErrors: string[] = [];
    
    if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
      validationErrors.push('sessionId is required and must be a non-empty string');
    }
    
    if (!conversationHistory) {
      validationErrors.push('conversationHistory is required');
    } else if (!Array.isArray(conversationHistory)) {
      validationErrors.push('conversationHistory must be an array');
    } else if (conversationHistory.length === 0) {
      validationErrors.push('conversationHistory cannot be empty');
    } else if (!conversationHistory.every(msg => typeof msg === 'string')) {
      validationErrors.push('All items in conversationHistory must be strings');
    }

    if (validationErrors.length > 0) {
      console.error('❌ Validation errors:', validationErrors);
      const executionTime = Date.now() - startTime;
      return createResponse(null, `Validation errors: ${validationErrors.join(', ')}`, 400, executionTime);
    }

    console.log('✅ Request validation passed');
    console.log('🎯 Generating service suggestions for session:', sessionId);

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    const language = userContext?.language || 'en';

    // Test OpenAI API connection with better error handling
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

    // Prepare analysis prompt with better structure
    const conversationSample = conversationHistory.slice(-10).join('\n'); // Use last 10 messages to avoid token limits
    
    const analysisPrompt = language === 'ar' 
      ? `أنت نجموز 👽، مساعد إبداعي خبير في تحليل احتياجات العملاء واقتراح الخدمات المناسبة.

تاريخ المحادثة:
${conversationSample}

معلومات إضافية:
- اللغة: ${language}
- القصد: ${userContext?.intent || 'غير محدد'}
- المجال: ${userContext?.industry || 'غير محدد'}

بناءً على هذه المحادثة، اقترح 3-5 خدمات إبداعية مناسبة مع شرح مختصر لكل خدمة وسبب مناسبتها.

أجب بصيغة JSON صالحة فقط:
{
  "suggestions": [
    {
      "service": "اسم الخدمة",
      "description": "وصف الخدمة",
      "reasoning": "سبب الاقتراح",
      "priority": "high"
    }
  ],
  "analysis": "تحليل عام للاحتياجات"
}`
      : `You are Nujmooz 👽, a creative assistant expert in analyzing client needs and suggesting appropriate services.

Conversation History:
${conversationSample}

Additional Context:
- Language: ${language}
- Intent: ${userContext?.intent || 'not specified'}
- Industry: ${userContext?.industry || 'not specified'}

Based on this conversation, suggest 3-5 appropriate creative services with brief explanations.

Respond with valid JSON only:
{
  "suggestions": [
    {
      "service": "Service Name",
      "description": "Service description",
      "reasoning": "Why this service is suggested",
      "priority": "high"
    }
  ],
  "analysis": "General needs analysis"
}`;

    console.log('🧠 Analyzing conversation for service suggestions...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: language === 'ar' 
              ? 'أنت نجموز 👽، خبير في التحليل الإبداعي واقتراح الخدمات المناسبة. أجب دائماً بصيغة JSON صحيحة فقط.'
              : 'You are Nujmooz 👽, an expert in creative analysis and service suggestions. Always respond with valid JSON only.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI analysis failed:', response.status, errorText);
      const executionTime = Date.now() - startTime;
      return createResponse(null, `OpenAI API error (${response.status}): ${errorText}`, 503, executionTime);
    }

    const aiData = await response.json();
    const aiResponse = aiData.choices[0]?.message?.content;
    
    if (!aiResponse) {
      console.error('❌ No response returned from OpenAI');
      const executionTime = Date.now() - startTime;
      return createResponse(null, 'No response returned from OpenAI', 500, executionTime);
    }

    console.log('✅ AI analysis completed');

    // Parse AI response with better error handling
    let parsedSuggestions;
    try {
      // Clean the response to extract JSON if it's wrapped in markdown
      const cleanResponse = aiResponse
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      parsedSuggestions = JSON.parse(cleanResponse);
      console.log('✅ AI response parsed successfully');
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError);
      console.log('Raw AI response:', aiResponse);
      
      // Fallback response if parsing fails
      parsedSuggestions = {
        suggestions: [
          {
            service: language === 'ar' ? 'استشارة إبداعية' : 'Creative Consultation',
            description: language === 'ar' ? 'جلسة استشارية لتحديد احتياجاتك الإبداعية' : 'Consultation session to identify your creative needs',
            reasoning: language === 'ar' ? 'بناءً على المحادثة، تحتاج إلى استشارة مخصصة' : 'Based on the conversation, you need personalized consultation',
            priority: 'high'
          }
        ],
        analysis: language === 'ar' ? 'تم إنشاء اقتراح افتراضي بسبب خطأ في التحليل' : 'Fallback suggestion generated due to analysis error'
      };
    }

    // Validate response structure
    if (!parsedSuggestions.suggestions || !Array.isArray(parsedSuggestions.suggestions)) {
      console.error('❌ Invalid AI response structure');
      const executionTime = Date.now() - startTime;
      return createResponse(null, 'Invalid AI response structure - missing suggestions array', 500, executionTime);
    }

    // Ensure all suggestions have required fields
    parsedSuggestions.suggestions = parsedSuggestions.suggestions.map((suggestion: any) => ({
      service: suggestion.service || 'Unknown Service',
      description: suggestion.description || 'No description available',
      reasoning: suggestion.reasoning || 'No reasoning provided',
      priority: ['high', 'medium', 'low'].includes(suggestion.priority?.toLowerCase()) 
        ? suggestion.priority.toLowerCase() 
        : 'medium'
    }));

    console.log(`✅ Generated ${parsedSuggestions.suggestions.length} service suggestions`);

    // Store suggestions in database
    if (Deno.env.get('SUPABASE_URL') && Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
      try {
        console.log('💾 Storing suggestions in database...');
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL')!,
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        // Verify session exists first
        const { data: sessionExists, error: sessionError } = await supabase
          .from('user_sessions')
          .select('session_id')
          .eq('session_id', sessionId)
          .maybeSingle();

        if (sessionError) {
          console.warn('⚠️ Session verification failed:', sessionError.message);
        } else if (!sessionExists) {
          console.log('🆕 Creating new session...');
          const { error: createSessionError } = await supabase
            .from('user_sessions')
            .insert([{
              session_id: sessionId,
              language_preference: language
            }]);
          
          if (createSessionError) {
            console.warn('⚠️ Failed to create session:', createSessionError.message);
          }
        }

        // Insert suggestions
        const suggestionsToInsert = parsedSuggestions.suggestions.map((suggestion: any) => ({
          session_id: sessionId,
          service: suggestion.service,
          description: suggestion.description,
          reasoning: suggestion.reasoning,
          priority: suggestion.priority,
          created_at: new Date().toISOString()
        }));

        const { data: insertedSuggestions, error: insertError } = await supabase
          .from('service_suggestions')
          .insert(suggestionsToInsert)
          .select();

        if (insertError) {
          console.warn('⚠️ Failed to store suggestions:', insertError.message);
        } else {
          console.log(`✅ Stored ${insertedSuggestions?.length || 0} suggestions in database`);
        }
      } catch (dbError) {
        console.warn('⚠️ Database operation failed:', dbError);
      }
    }

    const executionTime = Date.now() - startTime;
    console.log(`✅ Service suggestions generated successfully in ${executionTime}ms`);

    return createResponse({
      success: true,
      suggestions: parsedSuggestions.suggestions,
      analysis: parsedSuggestions.analysis,
      metadata: {
        sessionId,
        language,
        suggestionCount: parsedSuggestions.suggestions.length,
        executionTime
      }
    }, null, 200, executionTime);

  } catch (error) {
    console.error('❌ Suggest services function error:', error);
    await logError('suggest-services', error);
    const executionTime = Date.now() - startTime;
    return createResponse(null, `Function error: ${error.message}`, 500, executionTime);
  }
});
