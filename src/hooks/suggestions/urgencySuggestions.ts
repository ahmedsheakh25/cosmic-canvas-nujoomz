
import { type AdvancedSuggestion } from './types';

export const generateUrgencySuggestions = (
  urgencyLevel: string,
  language: 'en' | 'ar'
): AdvancedSuggestion[] => {
  const urgencySuggestions = {
    ar: {
      high: [
        { text: 'ممكن نسرع في العملية؟', type: 'action' as const },
        { text: 'وش أولوياتك العاجلة؟', type: 'question' as const }
      ],
      critical: [
        { text: 'يلا نركز على الأهم', type: 'guidance' as const },
        { text: 'ممكن نقسم المشروع لمراحل؟', type: 'clarification' as const }
      ]
    },
    en: {
      high: [
        { text: 'Can we expedite the process?', type: 'action' as const },
        { text: 'What are your urgent priorities?', type: 'question' as const }
      ],
      critical: [
        { text: 'Let\'s focus on what\'s most important', type: 'guidance' as const },
        { text: 'Can we break the project into phases?', type: 'clarification' as const }
      ]
    }
  };

  const suggestions = urgencySuggestions[language][urgencyLevel as keyof typeof urgencySuggestions['ar']] || [];
  return suggestions.map((suggestion, index) => ({
    id: `urgency-${urgencyLevel}-${index}`,
    text: suggestion.text,
    type: suggestion.type,
    priority: 0.9,
    contextRelevance: 0.8
  }));
};
