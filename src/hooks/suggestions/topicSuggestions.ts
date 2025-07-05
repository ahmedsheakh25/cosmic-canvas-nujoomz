
import { type AdvancedSuggestion } from './types';

export const generateTopicSuggestions = (
  topics: string[],
  language: 'en' | 'ar'
): AdvancedSuggestion[] => {
  const topicSuggestions = {
    ar: {
      branding: [
        { text: 'ممكن نشوف أمثلة على الهوية البصرية؟', type: 'action' as const },
        { text: 'وش الألوان المفضلة عندك؟', type: 'question' as const }
      ],
      website: [
        { text: 'تحتاج الموقع يكون متجاوب؟', type: 'question' as const },
        { text: 'أي نوع مواقع تفضل؟', type: 'clarification' as const }
      ]
    },
    en: {
      branding: [
        { text: 'Can we look at brand identity examples?', type: 'action' as const },
        { text: 'What are your preferred colors?', type: 'question' as const }
      ],
      website: [
        { text: 'Do you need a responsive website?', type: 'question' as const },
        { text: 'What type of websites do you prefer?', type: 'clarification' as const }
      ]
    }
  };

  const suggestions: AdvancedSuggestion[] = [];
  topics.forEach((topic, topicIndex) => {
    const topicSuggs = topicSuggestions[language][topic as keyof typeof topicSuggestions['ar']] || [];
    topicSuggs.forEach((suggestion, index) => {
      suggestions.push({
        id: `topic-${topic}-${index}`,
        text: suggestion.text,
        type: suggestion.type,
        priority: 0.6,
        contextRelevance: 0.7
      });
    });
  });

  return suggestions;
};
