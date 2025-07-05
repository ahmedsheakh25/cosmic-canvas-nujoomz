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

export const getDefaultSuggestedReplies = (): string[] => [
  'أخبرني عن خدماتكم',
  'أريد تصميم هوية تجارية', 
  'ما هي أسعاركم؟',
  'كيف يمكنني البدء؟'
]; 