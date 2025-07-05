import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

// Real OpenAI Assistant ID for Nujmooz
const NUJMOOZ_ASSISTANT_ID = 'asst_XxD170Mun5XRxvXo4GauLvI1';

// Enhanced language detection with Gulf dialect support
const detectLanguage = (message: string): 'ar' | 'en' => {
  const arabicPattern = /[\u0600-\u06FF]/;
  const gulfDialectWords = [
    'ابي', 'ابغى', 'أريد', 'احتاج', 'عايز', 'بدي', 
    'وش', 'شلون', 'كيف', 'متى', 'وين', 'ليش', 'ايش',
    'يلا', 'زين', 'ما شاء الله', 'الله يعطيك العافية',
    'هاي', 'اهلين', 'مرحبا', 'السلام عليكم', 'تسلم',
    'مشكور', 'يعطيك العافية', 'ان شاء الله', 'ماشي'
  ];
  
  if (arabicPattern.test(message)) return 'ar';
  
  const messageLower = message.toLowerCase();
  if (gulfDialectWords.some(word => messageLower.includes(word))) return 'ar';
  
  return 'en';
};

// Response type detection
const detectResponseType = (message: string): 'professional' | 'creative' | 'technical' | 'casual' => {
  const technicalKeywords = ['api', 'integration', 'database', 'server', 'code', 'development', 'programming'];
  const creativeKeywords = ['design', 'creative', 'idea', 'innovative', 'artistic', 'visual', 'branding'];
  const professionalKeywords = ['business', 'strategy', 'plan', 'budget', 'timeline', 'requirements'];
  
  const messageLower = message.toLowerCase();
  
  if (technicalKeywords.some(keyword => messageLower.includes(keyword))) {
    return 'technical';
  }
  
  if (creativeKeywords.some(keyword => messageLower.includes(keyword))) {
    return 'creative';
  }
  
  if (professionalKeywords.some(keyword => messageLower.includes(keyword))) {
    return 'professional';
  }
  
  return 'casual';
};

// Helper function to validate UUID format
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Thread management function
async function getOrCreateThreadId(sessionId: string, supabase: any): Promise<string> {
  try {
    console.log(`Getting or creating thread for session: ${sessionId}`);
    
    if (!isValidUUID(sessionId)) {
      throw new Error(`Invalid session ID format: ${sessionId}`);
    }
    
    const { data: existing, error } = await supabase
      .from('user_sessions')
      .select('thread_id')
      .eq('session_id', sessionId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching thread_id:', error);
      throw error;
    }

    if (existing?.thread_id) {
      console.log(`Found existing thread: ${existing.thread_id}`);
      return existing.thread_id;
    }

    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2',
      },
      body: JSON.stringify({}),
    });

    if (!threadResponse.ok) {
      throw new Error(`Thread creation failed: ${threadResponse.status}`);
    }

    const thread = await threadResponse.json();
    console.log(`Created new thread: ${thread.id}`);

    const { error: insertError } = await supabase
      .from('user_sessions')
      .upsert({
        session_id: sessionId,
        thread_id: thread.id,
      }, { onConflict: 'session_id' });

    if (insertError) {
      console.error('Error saving thread_id:', insertError);
      throw insertError;
    }

    return thread.id;
  } catch (error) {
    console.error('Error in getOrCreateThreadId:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const { message, sessionId, language: providedLanguage, conversationHistory = [], skillType } = await req.json();

    if (!message || !sessionId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: message and sessionId' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const detectedLanguage = providedLanguage || detectLanguage(message);
    const responseType = detectResponseType(message);
    console.log(`Language: ${detectedLanguage}, Response Type: ${responseType} for message: "${message.substring(0, 50)}..."`);

    const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

    if (!skillType) {
      try {
        const { error: saveError } = await supabase
          .from('chat_conversations')
          .insert({
            session_id: sessionId,
            message: message,
            sender: 'user',
            language: detectedLanguage
          });

        if (saveError) {
          console.error('Error saving user message:', saveError);
        }
      } catch (saveError) {
        console.error('Failed to save user message:', saveError);
      }
    }

    // Enhanced system instructions based on detected language and response type
    const getEnhancedSystemPrompt = (language: 'ar' | 'en', responseType: string) => {
      const baseInstructions = {
        ar: {
          professional: `أنت نجموز 👽، المساعد الفضائي المحترف من استوديو Of Space Studio.

🎯 أسلوب المحادثة المحترف:
- استخدم لهجة خليجية مهنية ومنظمة
- قدم إجاباتك بتنسيق واضح ومرتب مع العناوين والقوائم
- كن دقيقاً في التفاصيل التقنية
- استخدم المصطلحات المهنية المناسبة

📋 تنسيق الردود:
- ابدأ بترحيب مختصر ومهني
- قسم المعلومات إلى أقسام واضحة باستخدام ## للعناوين
- استخدم القوائم المرقمة والنقاط (•) لتنظيم المعلومات
- أضف ملخص في النهاية عند الحاجة

🎨 الخدمات المتخصصة:
- هوية تجارية: ركز على العلامة التجارية والرؤية
- تصميم مواقع: اهتم بتجربة المستخدم والوظائف
- تجارة إلكترونية: ناقش المنتجات وطرق الدفع
- تسويق رقمي: استكشف الجمهور والحملات
- موشن جرافيك: تحدث عن القصة البصرية

كن محترفاً، منظماً، ومفيداً في جميع ردودك.`,
          creative: `أنت نجموز 👽، المبدع الفضائي من استوديو Of Space Studio!

🎨 أسلوب إبداعي:
- كن متحمساً ومليئاً بالطاقة الإبداعية
- استخدم خيالك الواسع لتقديم أفكار مبتكرة
- شارك الأفكار بطريقة ملهمة ومثيرة
- استخدم الاستعارات والتشبيهات الإبداعية

✨ التفكير الإبداعي:
- اطرح أسئلة غير تقليدية
- اقترح حلولاً خارج الصندوق
- امزج بين التقنيات المختلفة
- فكر في التجارب التفاعلية

🚀 كن مصدر إلهام للعملاء وساعدهم على تحقيق رؤيتهم الإبداعية!`
        },
        en: {
          professional: `You are Nujmooz 👽, the professional cosmic assistant from Of Space Studio.

🎯 Professional Conversation Style:
- Use a professional, organized, and clear tone
- Present information in well-structured formats with headings and lists
- Be precise with technical details
- Use appropriate professional terminology

📋 Response Formatting:
- Start with a brief professional greeting
- Organize information into clear sections using ## for headings
- Use bullet points (•) and numbered lists for clarity
- Provide summaries when needed

🎨 Specialized Services:
- Branding: Focus on brand identity and vision
- Web Design: Emphasize user experience and functionality
- E-commerce: Discuss products and payment methods
- Digital Marketing: Explore audience and campaigns
- Motion Graphics: Talk about visual storytelling

Be professional, organized, and helpful in all your responses.`,
          creative: `You are Nujmooz 👽, the creative cosmic genius from Of Space Studio!

🎨 Creative Style:
- Be enthusiastic and full of creative energy
- Use your vast imagination to offer innovative ideas
- Share ideas in an inspiring and exciting way
- Use creative metaphors and analogies

✨ Creative Thinking:
- Ask unconventional questions
- Suggest out-of-the-box solutions
- Mix different techniques and approaches
- Think about interactive experiences

🚀 Be a source of inspiration and help clients achieve their creative vision!`
        }
      };

      return baseInstructions[language][responseType as keyof typeof baseInstructions['ar']] || 
             baseInstructions[language]['professional'];
    };

    // OpenAI Assistants v2 implementation with enhanced prompts
    try {
      const threadId = await getOrCreateThreadId(sessionId, supabase);
      console.log(`Using thread: ${threadId}`);

      const systemPrompt = getEnhancedSystemPrompt(detectedLanguage, responseType);
      
      await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2',
        },
        body: JSON.stringify({
          role: 'user',
          content: `${systemPrompt}\n\nUser message: ${message}`,
        }),
      });

      console.log('Enhanced system prompt and user message added to thread');

      const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2',
        },
        body: JSON.stringify({
          assistant_id: NUJMOOZ_ASSISTANT_ID,
        }),
      });

      if (!runResponse.ok) {
        throw new Error(`Run creation failed: ${runResponse.status}`);
      }

      const run = await runResponse.json();
      console.log(`Run created: ${run.id}`);

      let status = run.status;
      let attempts = 0;
      const maxAttempts = 30;

      while (status !== 'completed' && status !== 'failed' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${run.id}`, {
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'OpenAI-Beta': 'assistants=v2',
          },
        });

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          status = statusData.status;
          console.log(`Run status: ${status} (attempt ${attempts + 1})`);
        }
        
        attempts++;
      }

      if (status !== 'completed') {
        throw new Error(`Assistant run did not complete. Status: ${status}`);
      }

      const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'OpenAI-Beta': 'assistants=v2',
        },
      });

      if (!messagesResponse.ok) {
        throw new Error(`Messages retrieval failed: ${messagesResponse.status}`);
      }

      const messagesData = await messagesResponse.json();
      const assistantMessages = messagesData.data.filter((msg: any) => msg.role === 'assistant');
      
      if (assistantMessages.length === 0) {
        throw new Error('No assistant response found');
      }

      const latestMessage = assistantMessages[0];
      let responseText = '';
      
      for (const content of latestMessage?.content || []) {
        if (content.type === 'text') {
          responseText += content.text.value;
        }
      }

      if (!responseText) {
        const fallbackMessage = detectedLanguage === 'ar'
          ? 'أهلًا وسهلًا! وش الفكرة الإبداعية اللي في بالك؟ يلا نبدأ نشتغل عليها سوا! ✨'
          : 'Hello there! What creative idea is brewing in your mind? Let\'s bring it to life together! ✨';
        
        return new Response(
          JSON.stringify({ 
            success: true,
            response: fallbackMessage,
            detectedLanguage,
            responseType,
            sessionId,
            threadId
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log(`Enhanced assistant response: ${responseText.substring(0, 100)}...`);

      if (!skillType) {
        try {
          const { error: aiSaveError } = await supabase
            .from('chat_conversations')
            .insert({
              session_id: sessionId,
              message: responseText,
              sender: 'nujmooz',
              language: detectedLanguage
            });

          if (aiSaveError) {
            console.error('Error saving AI message:', aiSaveError);
          }
        } catch (aiSaveError) {
          console.error('Failed to save AI message:', aiSaveError);
        }
      }

      // Enhanced service detection
      const detectServices = (input: string) => {
        if (skillType) return [];

        const keywords = {
          branding: ['brand', 'logo', 'identity', 'branding', 'visual identity', 'هوية', 'علامة', 'شعار', 'براند', 'لوجو'],
          ui_ux: ['ui', 'ux', 'design', 'interface', 'user experience', 'app design', 'website design', 'تصميم', 'واجهة', 'تجربة', 'يوزر'],
          website: ['website', 'web', 'site', 'webpage', 'online presence', 'موقع', 'ويب', 'صفحة', 'مووقع'],
          motion: ['video', 'animation', 'motion', 'graphics', 'visual storytelling', 'فيديو', 'حركة', 'رسوم', 'متحرك', 'انيميشن'],
          ecommerce: ['store', 'shop', 'ecommerce', 'online store', 'selling online', 'متجر', 'تجارة', 'بيع', 'تسوق'],
          marketing: ['marketing', 'social media', 'advertising', 'promotion', 'digital marketing', 'content', 'تسويق', 'إعلان', 'ترويج', 'محتوى', 'سوشيال'],
          print: ['print', 'brochure', 'flyer', 'poster', 'packaging', 'مطبوعات', 'بروشور', 'فلاير', 'ملصق', 'طباعة']
        };

        const inputLower = input.toLowerCase();
        const detectedServices: string[] = [];

        for (const [service, serviceKeywords] of Object.entries(keywords)) {
          if (serviceKeywords.some(keyword => inputLower.includes(keyword))) {
            detectedServices.push(service);
          }
        }

        return detectedServices;
      };

      const detectedServices = detectServices(message);

      return new Response(
        JSON.stringify({
          success: true,
          response: responseText,
          detectedServices,
          detectedLanguage,
          responseType,
          sessionId,
          threadId,
          skillType: skillType || null
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (assistantError) {
      console.error('OpenAI Assistant API error:', assistantError);
      
      try {
        console.log('Falling back to chat completions...');
        
        const enhancedSystemPrompt = detectedLanguage === 'ar' 
          ? `أنت نجموز 👽، المساعد الكوني الإبداعي من استوديو الفضاء. تتكلم بلهجة خليجية ودية ومتحمسة. استخدم عبارات مثل "أهلًا وسهلًا!"، "يا الله! فكرة رهيبة!"، "يلا نشتغل عليها سوا!"، "زين كذا!"، "ما شاء الله عليك!". لا تخلط العربية بالإنجليزية أبداً.`
          : `You are Nujmooz 👽, the cosmic creative assistant from Of Space Studio. You speak with enthusiastic warmth and genuine excitement. Use phrases like "That's fantastic!", "I love where this is going!", "Let's make magic happen!", "This is going to be incredible!". Never mix Arabic and English.`;
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { 
                role: 'system', 
                content: enhancedSystemPrompt
              },
              { role: 'user', content: message }
            ],
            temperature: 0.8,
            max_tokens: 500,
          }),
        });

        if (response.ok) {
          const completion = await response.json();
          const aiResponse = completion.choices[0]?.message?.content || '';
          
          return new Response(
            JSON.stringify({
              success: true,
              response: aiResponse,
              detectedLanguage,
              responseType,
              sessionId,
              fallback: true
            }),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
      }
      
      const fallbackMessage = detectedLanguage === 'ar'
        ? 'أهلًا وسهلًا! صار خلل بسيط في النظام 👨‍💻 بس لا تشيل هم، يلا نجرب مرة ثانية خلال دقايق! الفريق شغال على الحل 🚀'
        : 'Hello there! Oops, tiny tech glitch 👨‍💻 No worries though - let\'s try again in a few minutes! Our dev team\'s working their magic 🚀';
      
      return new Response(
        JSON.stringify({ 
          success: true,
          response: fallbackMessage,
          detectedLanguage,
          responseType,
          sessionId,
          fallback: true
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Error in enhanced chat-with-nujmooz function:', error);
    
    let errorLanguage = 'en';
    try {
      const { message } = await req.json();
      errorLanguage = detectLanguage(message || '');
    } catch {}
    
    const errorMessage = errorLanguage === 'ar'
      ? 'أهلًا! صار خلل بسيط في النظام 👨‍💻 بس لا تشيل هم، يلا نجرب مرة ثانية خلال دقايق! 🚀'
      : 'Hello! Tiny tech hiccup 👨‍💻 No worries - let\'s try again in a few minutes! 🚀';

    return new Response(
      JSON.stringify({
        success: true,
        response: errorMessage,
        detectedLanguage: errorLanguage,
        fallback: true,
        error: 'Technical error handled gracefully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
