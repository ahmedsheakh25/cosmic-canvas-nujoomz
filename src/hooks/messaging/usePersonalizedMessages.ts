
import { type ConversationMemory } from '../useConversationMemory';

export const usePersonalizedMessages = () => {
  const getEnhancedSuccessMessage = (
    language: 'en' | 'ar',
    workflowResult: any,
    memory: ConversationMemory
  ): string => {
    const userName = memory.userPreferences.communicationStyle === 'formal' ? 
      (language === 'ar' ? 'سيدي/سيدتي' : 'Dear client') :
      (language === 'ar' ? 'صديقي' : 'my friend');

    const trelloInfo = workflowResult.trelloCard 
      ? (language === 'ar' ? ' وبطاقة متابعة في Trello' : ' and a Trello follow-up card')
      : '';
    
    return language === 'ar' 
      ? `${userName}! ما شاء الله عليك! 🎉 خلصنا موجز مشروعك بنجاح!\n\n✨ تم إنشاء:\n• موجز مشروع مفصل مع اقتراحات ذكية من الذكاء الاصطناعي\n• نسخة PDF جاهزة للطباعة${trelloInfo}\n\nفريقنا بيراجع طلبك ويتواصل معك خلال 24 ساعة! يلا ننتظر نشوف إبداعك! 🚀`
      : `${userName}! That's absolutely fantastic! 🎉 We've successfully created your project brief!\n\n✨ Created:\n• Detailed project brief with AI-powered suggestions\n• Print-ready PDF version${trelloInfo}\n\nOur amazing team will review your request and reach out within 24 hours! Can't wait to bring your vision to life! 🚀`;
  };

  const getFallbackMessage = (language: 'en' | 'ar', memory: ConversationMemory): string => {
    const style = memory.userPreferences.communicationStyle;
    
    if (style === 'formal') {
      return language === 'ar'
        ? "نعتذر لحدوث خلل تقني بسيط. معلوماتكم محفوظة بأمان، وسيتواصل معكم فريقنا قريباً لاستكمال العملية."
        : "We apologize for a minor technical issue. Your information is safely stored, and our team will contact you shortly to complete the process.";
    } else {
      return language === 'ar'
        ? "صار خلل بسيط في المعالجة 👨‍💻 بس لا تشيل هم، معلوماتك محفوظة! الفريق بيصلح المشكلة ويتواصل معك قريباً! يلا ما نشيل هم 🚀"
        : "Tiny processing glitch 👨‍💻 Don't worry though, your info is safe! Our team will fix this and follow up soon! No stress at all 🚀";
    }
  };

  const getTechErrorMessage = (language: 'en' | 'ar', memory: ConversationMemory): string => {
    const style = memory.userPreferences.communicationStyle;
    
    if (style === 'formal') {
      return language === 'ar'
        ? "حدث خلل تقني مؤقت. معلوماتكم محفوظة، وسيتم التواصل معكم لاستكمال مشروعكم."
        : "A temporary technical issue occurred. Your information is preserved, and we'll contact you to continue your project.";
    } else {
      return language === 'ar'
        ? "صار خلل تقني بسيط 👨‍💻 بس معلوماتك محفوظة، والفريق بيتواصل معك قريباً لاستكمال مشروعك الإبداعي! يلا نكمل الحماس! 🎨✨"
        : "Minor tech hiccup 👨‍💻 Your info is totally safe though, and our team will reach out soon to continue your amazing creative project! Let's keep the excitement going! 🎨✨";
    }
  };

  const getApiErrorMessage = (language: 'en' | 'ar', memory: ConversationMemory): string => {
    const style = memory.userPreferences.communicationStyle;
    
    if (style === 'formal') {
      return language === 'ar'
        ? "نعتذر لحدوث مشكلة في الاتصال. يرجى المحاولة مرة أخرى خلال دقائق."
        : "We apologize for a connection issue. Please try again in a few minutes.";
    } else {
      return language === 'ar'
        ? "أهلًا! صار خلل بسيط في الاتصال 👨‍💻 يلا نجرب مرة ثانية خلال دقايق! أو أرسل لي فكرتك والفريق بيتواصل معك مباشرة! ما نشيل هم 🚀"
        : "Hello! Connection hiccup 👨‍💻 Let's try again in a few minutes! Or send me your idea and our team will reach out directly! No worries at all 🚀";
    }
  };

  const getFinalFallbackMessage = (language: 'en' | 'ar'): string => {
    return language === 'ar'
      ? "واجهت مشكلة تقنية في الفضاء 😅 بس لا تشيل هم! أرسل لي فكرتك مرة ثانية أو تواصل مع الفريق مباشرة عبر الموقع! يلا ما نوقف الإبداع 🚀"
      : "Houston, we have a problem in space 😅 Don't worry though! Send me your idea again or contact our team directly through the website! Let's keep the creativity flowing 🚀";
  };

  return {
    getEnhancedSuccessMessage,
    getFallbackMessage,
    getTechErrorMessage,
    getApiErrorMessage,
    getFinalFallbackMessage
  };
};
