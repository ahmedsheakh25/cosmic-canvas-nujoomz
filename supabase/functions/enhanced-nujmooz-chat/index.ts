
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatRequest {
  message: string;
  language: 'en' | 'ar';
  persona: string;
  context: string;
  currentBrief?: any;
  sessionId: string;
}

serve(async (req) => {
  console.log('🚀 Enhanced Nujmooz Chat function called');
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const requestBody = await req.json();
    console.log('📝 Request received:', { 
      hasMessage: !!requestBody.message, 
      language: requestBody.language,
      sessionId: requestBody.sessionId 
    });
    
    const { message, language, persona, context, currentBrief, sessionId }: ChatRequest = requestBody;

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not found in environment');
      throw new Error('OpenAI API key not configured')
    }
    
    console.log('✅ OpenAI API key found');

    // Build enhanced prompt
    const systemPrompt = `${persona}

Previous conversation context:
${context}

Current project brief status: ${currentBrief ? `Collecting ${currentBrief.service} brief (${Object.keys(currentBrief.answers).length} answers collected)` : 'No active brief'}

Instructions:
- Respond naturally in ${language === 'ar' ? 'Gulf Arabic dialect' : 'English'}
- If collecting brief information, ask relevant follow-up questions
- Be encouraging and creative in your responses
- Keep responses conversational and helpful
- Use appropriate emojis and formatting`

    console.log('🤖 Calling OpenAI with model: gpt-4.1-2025-04-14');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.8,
        max_tokens: 1000
      }),
    })

    console.log('📡 OpenAI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content
    
    console.log('✅ OpenAI response received, length:', aiResponse?.length || 0);

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('❌ Error in enhanced-nujmooz-chat:', error);
    
    // Enhanced error response with more details
    const errorResponse = {
      error: error.message,
      timestamp: new Date().toISOString(),
      response: (requestBody?.language || 'en') === 'ar' 
        ? 'عذراً، حدث خطأ تقني. يرجى المحاولة مرة أخرى.'
        : 'Sorry, there was a technical error. Please try again.'
    };
    
    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
