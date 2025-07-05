
import { supabase } from '@/integrations/supabase/client';

export interface ModernChatMessage {
  id: string;
  sender: 'user' | 'nujmooz';
  content: string;
  timestamp: Date;
  generatedFiles?: string[];
}

export const detectLanguage = (text: string): 'ar' | 'en' => {
  const arabicPattern = /[\u0600-\u06FF]/;
  const gulfDialectWords = [
    'ابي', 'ابغى', 'أريد', 'احتاج', 'عايز', 'بدي', 
    'وش', 'شلون', 'كيف', 'متى', 'وين', 'ليش', 'ايش',
    'يلا', 'زين', 'ما شاء الله', 'الله يعطيك العافية',
    'هاي', 'اهلين', 'مرحبا', 'السلام عليكم', 'تسلم'
  ];
  
  if (arabicPattern.test(text)) return 'ar';
  
  const messageLower = text.toLowerCase();
  if (gulfDialectWords.some(word => messageLower.includes(word))) return 'ar';
  
  return 'en';
};

export const sendMessageToAI = async (
  message: string, 
  sessionId: string, 
  language: 'ar' | 'en'
): Promise<string> => {
  try {
    const { data, error } = await supabase.functions.invoke('chat-with-nujmooz', {
      body: {
        message,
        sessionId,
        language
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    return data?.response || getDefaultResponse(language);
  } catch (error) {
    console.error('Error calling AI:', error);
    return getErrorResponse(language);
  }
};

export const getDefaultResponse = (language: 'ar' | 'en'): string => {
  return language === 'ar' 
    ? 'أهلًا وسهلًا! ما فهمت عليك تماماً 🤔 ممكن توضحلي أكثر عن الفكرة الإبداعية اللي في بالك؟ يلا نشوف! ✨'
    : 'Hello there! I didn\'t quite catch that 🤔 Could you tell me more about the amazing creative idea you have in mind? Let\'s explore it together! ✨';
};

export const getErrorResponse = (language: 'ar' | 'en'): string => {
  return language === 'ar'
    ? 'أهلًا! صار خلل بسيط في النظام 👨‍💻 بس لا تشيل هم، يلا نجرب مرة ثانية خلال دقايق! 🚀'
    : 'Hello! Tiny tech hiccup 👨‍💻 No worries - let\'s try again in a few minutes! 🚀';
};

export const extractServiceKeywords = (message: string): string[] => {
  const keywords = {
    branding: ['brand', 'logo', 'identity', 'branding', 'visual identity', 'هوية', 'علامة', 'شعار', 'براند', 'لوجو'],
    ui_ux: ['ui', 'ux', 'design', 'interface', 'user experience', 'app design', 'website design', 'تصميم', 'واجهة', 'تجربة', 'يوزر'],
    website: ['website', 'web', 'site', 'webpage', 'online presence', 'موقع', 'ويب', 'صفحة', 'مووقع'],
    motion: ['video', 'animation', 'motion', 'graphics', 'visual storytelling', 'فيديو', 'حركة', 'رسوم', 'متحرك', 'انيميشن'],
    ecommerce: ['store', 'shop', 'ecommerce', 'online store', 'selling online', 'متجر', 'تجارة', 'بيع', 'تسوق'],
    marketing: ['marketing', 'social media', 'advertising', 'promotion', 'digital marketing', 'content', 'تسويق', 'إعلان', 'ترويج', 'محتوى', 'سوشيال']
  };

  const messageLower = message.toLowerCase();
  const detectedServices: string[] = [];

  for (const [service, serviceKeywords] of Object.entries(keywords)) {
    if (serviceKeywords.some(keyword => messageLower.includes(keyword))) {
      detectedServices.push(service);
    }
  }

  return detectedServices;
};
