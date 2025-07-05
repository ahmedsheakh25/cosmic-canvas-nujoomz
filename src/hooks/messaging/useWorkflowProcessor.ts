
import { type ChatMessage } from '@/utils/sessionManager';

export const useWorkflowProcessor = () => {
  const generateSuccessMessage = (
    effectiveLanguage: 'en' | 'ar',
    workflowResult: any
  ): string => {
    const trelloInfo = workflowResult.trelloCard 
      ? (effectiveLanguage === 'ar' ? ' وبطاقة متابعة في Trello' : ' and a Trello follow-up card')
      : '';
    
    return effectiveLanguage === 'ar' 
      ? `يا الله! ما شاء الله عليك! 🎉 خلصنا موجز مشروعك بنجاح!\n\n✨ تم إنشاء:\n• موجز مشروع مفصل مع اقتراحات ذكية من الذكاء الاصطناعي\n• نسخة PDF جاهزة للطباعة${trelloInfo}\n\nفريقنا بيراجع طلبك ويتواصل معك خلال 24 ساعة! يلا ننتظر نشوف إبداعك! 🚀`
      : `That's absolutely fantastic! 🎉 We've successfully created your project brief!\n\n✨ Created:\n• Detailed project brief with AI-powered suggestions\n• Print-ready PDF version${trelloInfo}\n\nOur amazing team will review your request and reach out within 24 hours! Can't wait to bring your vision to life! 🚀`;
  };

  const generateFallbackMessage = (effectiveLanguage: 'en' | 'ar'): string => {
    return effectiveLanguage === 'ar'
      ? "صار خلل بسيط في المعالجة 👨‍💻 بس لا تشيل هم، معلوماتك محفوظة! الفريق بيصلح المشكلة ويتواصل معك قريباً! يلا ما نشيل هم 🚀"
      : "Tiny processing glitch 👨‍💻 Don't worry though, your info is safe! Our team will fix this and follow up soon! No stress at all 🚀";
  };

  const generateTechErrorMessage = (effectiveLanguage: 'en' | 'ar'): string => {
    return effectiveLanguage === 'ar'
      ? "صار خلل تقني بسيط 👨‍💻 بس معلوماتك محفوظة، والفريق بيتواصل معك قريباً لاستكمال مشروعك الإبداعي! يلا نكمل الحماس! 🎨✨"
      : "Minor tech hiccup 👨‍💻 Your info is totally safe though, and our team will reach out soon to continue your amazing creative project! Let's keep the excitement going! 🎨✨";
  };

  const generateFinalFallbackMessage = (effectiveLanguage: 'en' | 'ar'): string => {
    return effectiveLanguage === 'ar'
      ? "واجهت مشكلة تقنية في الفضاء 😅 بس لا تشيل هم! أرسل لي فكرتك مرة ثانية أو تواصل مع الفريق مباشرة عبر الموقع! يلا ما نوقف الإبداع 🚀"
      : "Houston, we have a problem in space 😅 Don't worry though! Send me your idea again or contact our team directly through the website! Let's keep the creativity flowing 🚀";
  };

  return {
    generateSuccessMessage,
    generateFallbackMessage,
    generateTechErrorMessage,
    generateFinalFallbackMessage
  };
};
