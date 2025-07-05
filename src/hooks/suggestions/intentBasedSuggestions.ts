
import { type EnhancedIntentContext } from '../intent/intentTypes';
import { type AdvancedSuggestion } from './types';

export const generateIntentBasedSuggestions = (
  context: EnhancedIntentContext,
  language: 'en' | 'ar'
): AdvancedSuggestion[] => {
  const intentSuggestions = {
    ar: {
      project_inquiry: [
        { text: 'ممكن تحكيلي أكثر عن المشروع؟', type: 'question' as const },
        { text: 'وش نوع الخدمة المطلوبة؟', type: 'clarification' as const },
        { text: 'متى تحتاج المشروع يكون جاهز؟', type: 'question' as const }
      ],
      service_exploration: [
        { text: 'أريد معرفة المزيد عن الخدمات', type: 'action' as const },
        { text: 'ما هي الأسعار؟', type: 'question' as const },
        { text: 'كم يستغرق التنفيذ؟', type: 'question' as const }
      ],
      brief_creation: [
        { text: 'يلا نبدأ نكتب الموجز', type: 'action' as const },
        { text: 'ما المعلومات المطلوبة؟', type: 'guidance' as const },
        { text: 'كيف أقدر أساعدك أكثر؟', type: 'question' as const }
      ]
    },
    en: {
      project_inquiry: [
        { text: 'Can you tell me more about your project?', type: 'question' as const },
        { text: 'What type of service do you need?', type: 'clarification' as const },
        { text: 'When do you need this completed?', type: 'question' as const }
      ],
      service_exploration: [
        { text: 'I want to learn more about services', type: 'action' as const },
        { text: 'What are your pricing options?', type: 'question' as const },
        { text: 'How long does implementation take?', type: 'question' as const }
      ],
      brief_creation: [
        { text: 'Let\'s start creating the brief', type: 'action' as const },
        { text: 'What information do you need?', type: 'guidance' as const },
        { text: 'How can I help you more?', type: 'question' as const }
      ]
    }
  };

  const suggestions = intentSuggestions[language][context.intent] || [];
  return suggestions.map((suggestion, index) => ({
    id: `intent-${context.intent}-${index}`,
    text: suggestion.text,
    type: suggestion.type,
    priority: 0.8,
    contextRelevance: 0.9
  }));
};
