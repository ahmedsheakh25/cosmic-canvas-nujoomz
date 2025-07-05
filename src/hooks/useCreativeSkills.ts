
import { supabase } from '@/integrations/supabase/client';

export const useCreativeSkills = (sessionId: string, currentLanguage: 'en' | 'ar') => {
  // Extract text for creative enhancement
  const extractTextForRewrite = (message: string): string => {
    const patterns = [
      /أعد صياغة/gi, /حسن/gi, /طور/gi, /اجعله أجمل/gi,
      /rewrite/gi, /improve/gi, /enhance/gi, /make it better/gi, /polish/gi
    ];
    
    let cleanText = message;
    patterns.forEach(pattern => {
      cleanText = cleanText.replace(pattern, '').trim();
    });
    
    cleanText = cleanText.replace(/^(this|هذا|هذه|the|التالي|التالية)[\s:]/gi, '').trim();
    return cleanText || message;
  };

  // Send to OpenAI for creative skills with enhanced persona
  const sendToOpenAI = async (prompt: string, skillType: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-nujmooz', {
        body: {
          message: prompt,
          sessionId: sessionId,
          language: currentLanguage,
          conversationHistory: [], // Less history for focused creative tasks
          skillType: skillType
        }
      });

      if (error) throw new Error(error.message);
      
      return data?.response || (currentLanguage === 'ar' 
        ? 'أعتذر، واجهت مشكلة في معالجة طلبك الإبداعي. ممكن تجرب مرة ثانية؟ 🎨'
        : 'I apologize, but I encountered an issue with your creative request. Mind trying again? 🎨');
    } catch (error) {
      console.error('Error calling OpenAI for creative skill:', error);
      return currentLanguage === 'ar' 
        ? 'عذراً، حدث خطأ في معالجة طلبك الإبداعي. دعنا نجرب مرة أخرى! ✨'
        : 'Sorry, there was an error with your creative request. Let\'s try again! ✨';
    }
  };

  const detectAndHandleCreativeSkills = async (userMessage: string, currentService?: any): Promise<string | null> => {
    const message = userMessage.toLowerCase();

    // Creative Text Enhancement Skill
    if (/أعد صياغة|حسن|طور|اجعله أجمل|أبدع/i.test(userMessage) || 
        /rewrite|improve|enhance|make it better|polish|creative/i.test(userMessage)) {
      const targetText = extractTextForRewrite(userMessage);
      const prompt = currentLanguage === 'ar'
        ? `كشريك إبداعي، أعد صياغة هذا النص بطريقة إبداعية وجذابة ومهنية:\n\n"${targetText}"\n\nاجعله أكثر تأثيراً وإلهاماً مع لمسة فنية مميزة. ✨`
        : `As your creative partner, please rewrite this text in a more creative, engaging and professional way:\n\n"${targetText}"\n\nMake it more impactful and inspiring with a unique artistic touch. ✨`;
      
      return await sendToOpenAI(prompt, 'rewrite');
    }

    // Creative Idea Analysis Skill  
    if (/حلل الفكرة|قيم|اقتراح إبداعي|تحسين|رأيك/i.test(userMessage) || 
        /analyze idea|creative feedback|suggestions|improve|what do you think/i.test(userMessage)) {
      const prompt = currentLanguage === 'ar'
        ? `كشريك إبداعي، حلل هذه الفكرة أو المشروع وقدم لي ملاحظات إبداعية واقتراحات فنية لتطويرها:\n\n"${userMessage}"\n\nركز على الجوانب البصرية والعاطفية والإبداعية. 🎨`
        : `As your creative partner, please analyze this idea or project and provide creative feedback and artistic suggestions for development:\n\n"${userMessage}"\n\nFocus on visual, emotional, and creative aspects. 🎨`;

      return await sendToOpenAI(prompt, 'analyze');
    }

    // Creative Planning/Strategy Skill
    if (/خطة إبداعية|خطوات|كيف أبدأ|استراتيجية/i.test(userMessage) || 
        /creative plan|steps|how to start|strategy|roadmap/i.test(userMessage)) {
      const serviceContext = currentService ? currentService : (currentLanguage === 'ar' ? 'المشروع الإبداعي' : 'creative project');
      const prompt = currentLanguage === 'ar'
        ? `كشريك إبداعي، اقترح خطة إبداعية مفصلة وخطوات فنية لهذا المشروع:\n\n"${userMessage}"\n\nنوع الخدمة: ${serviceContext}\n\nقدم خطوات إبداعية واضحة مع نصائح فنية عملية. ✨`
        : `As your creative partner, suggest a detailed creative plan and artistic steps for this project:\n\n"${userMessage}"\n\nService Type: ${serviceContext}\n\nProvide clear creative steps with practical artistic advice. ✨`;

      return await sendToOpenAI(prompt, 'planning');
    }

    // Creative Brand Naming/Identity Skill
    if (/اسم إبداعي|علامة تجارية|شعار|هوية/i.test(userMessage) || 
        /creative name|brand name|company name|naming|slogan|tagline|identity/i.test(userMessage)) {
      const prompt = currentLanguage === 'ar'
        ? `كشريك إبداعي، اقترح أسماء تجارية مبتكرة وشعارات إبداعية بناءً على هذا المشروع:\n\n"${userMessage}"\n\nقدم 5-7 اقتراحات إبداعية مع شرح الرؤية الفنية وراء كل اسم. 🌟`
        : `As your creative partner, suggest innovative brand names and creative taglines based on this project:\n\n"${userMessage}"\n\nProvide 5-7 creative suggestions with the artistic vision behind each name. 🌟`;

      return await sendToOpenAI(prompt, 'naming');
    }

    return null;
  };

  const getSkillSuggestions = () => {
    return currentLanguage === 'ar' 
      ? ['حسن نص آخر', 'حلل فكرة إبداعية', 'اقترح خطة فنية', 'أحتاج اسم إبداعي']
      : ['Enhance another text', 'Analyze creative idea', 'Suggest artistic plan', 'I need a creative name'];
  };

  return {
    detectAndHandleCreativeSkills,
    getSkillSuggestions
  };
};
