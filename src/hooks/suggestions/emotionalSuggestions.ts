
import { type AdvancedSuggestion } from './types';

export const generateEmotionalSuggestions = (
  emotionalState: string,
  language: 'en' | 'ar'
): AdvancedSuggestion[] => {
  const emotionalSuggestions = {
    ar: {
      excited: [
        { text: 'يلا نبدأ نشتغل على الفكرة!', type: 'action' as const },
        { text: 'ما رأيك نضيف تفاصيل أكثر؟', type: 'question' as const }
      ],
      frustrated: [
        { text: 'خلني أساعدك خطوة بخطوة', type: 'guidance' as const },
        { text: 'ممكن نبسط الموضوع؟', type: 'clarification' as const }
      ],
      uncertain: [
        { text: 'لا تشيل هم، أنا هنا أساعدك', type: 'guidance' as const },
        { text: 'ممكن نناقش الخيارات المتاحة؟', type: 'question' as const }
      ]
    },
    en: {
      excited: [
        { text: 'Let\'s start working on this idea!', type: 'action' as const },
        { text: 'Should we add more details?', type: 'question' as const }
      ],
      frustrated: [
        { text: 'Let me help you step by step', type: 'guidance' as const },
        { text: 'Can we simplify this?', type: 'clarification' as const }
      ],
      uncertain: [
        { text: 'Don\'t worry, I\'m here to help', type: 'guidance' as const },
        { text: 'Shall we discuss the available options?', type: 'question' as const }
      ]
    }
  };

  const suggestions = emotionalSuggestions[language][emotionalState as keyof typeof emotionalSuggestions['ar']] || [];
  return suggestions.map((suggestion, index) => ({
    id: `emotion-${emotionalState}-${index}`,
    text: suggestion.text,
    type: suggestion.type,
    priority: 0.7,
    contextRelevance: 0.8
  }));
};
