
import { type IntentContext } from './intentTypes';

export const getIntentBasedSuggestions = (context: IntentContext, currentLanguage: 'en' | 'ar'): string[] => {
  const suggestions = currentLanguage === 'ar' ? {
    project_inquiry: [
      'أخبرني أكثر عن فكرة مشروعك',
      'ما نوع الخدمة التي تحتاجها؟',
      'دعنا نبدأ بجمع التفاصيل'
    ],
    service_exploration: [
      'استكشف خدماتنا المتكاملة',
      'ما هو هدفك الأساسي؟',
      'دعني أوضح لك ما نقدمه'
    ],
    creative_assistance: [
      'شاركني رؤيتك الإبداعية',
      'ما الأسلوب المفضل لديك؟',
      'دعنا نطور الفكرة معاً'
    ],
    pricing_question: [
      'دعني أفهم احتياجاتك أولاً',
      'ما نطاق مشروعك؟',
      'سأعطيك تقدير مخصص'
    ]
  } : {
    project_inquiry: [
      'Tell me more about your project idea',
      'What type of service do you need?',
      'Let\'s start gathering the details'
    ],
    service_exploration: [
      'Explore our comprehensive services',
      'What\'s your main objective?',
      'Let me show you what we offer'
    ],
    creative_assistance: [
      'Share your creative vision with me',
      'What\'s your preferred style?',
      'Let\'s develop the idea together'
    ],
    pricing_question: [
      'Let me understand your needs first',
      'What\'s the scope of your project?',
      'I\'ll give you a customized estimate'
    ]
  };

  return suggestions[context.intent] || suggestions.project_inquiry;
};
