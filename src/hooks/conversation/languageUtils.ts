export const detectLanguage = (text: string): 'ar' | 'en' => {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text) ? 'ar' : 'en';
};

export const getWelcomeMessage = (language: 'ar' | 'en'): string => {
  return language === 'ar'
    ? 'أهلًا وسهلًا! أنا نجموز 👽، شريكك الإبداعي الكوني من استوديو الفضاء ✨\n\nهنا لأساعدك تحول أفكارك إلى موجز مشروع واضح ومنظم. الفريق بيشوف الموجز بعدين ويتواصل معك.\n\nيلا نبدأ هذه الرحلة الإبداعية معًا! وش الفكرة اللي في بالك؟ 🚀'
    : 'Hello! I\'m Nujmooz 👽, your cosmic creative partner from Space Studio ✨\n\nI\'m here to help you transform your ideas into a clear and organized project brief. The team will review the brief later and get in touch with you.\n\nLet\'s start this creative journey together! What\'s the idea you have in mind? 🚀';
}; 