
import { useState, useCallback, useMemo } from 'react';
import { type ChatMessage } from '@/utils/sessionManager';
import { type IntentContext } from './useIntentAnalysis';
import { type ConversationMemory } from './useConversationMemory';

export type SmartSuggestion = {
  id: string;
  text: string;
  type: 'question' | 'action' | 'information' | 'navigation';
  priority: number;
  context: string;
  followUp?: string[];
};

export const useSmartSuggestions = (currentLanguage: 'en' | 'ar') => {
  const [suggestionHistory, setSuggestionHistory] = useState<SmartSuggestion[]>([]);

  // Contextual suggestion templates
  const suggestionTemplates = useMemo(() => ({
    en: {
      discovery: [
        { text: "Tell me about your business vision", type: "question", priority: 9 },
        { text: "What's your main goal with this project?", type: "question", priority: 8 },
        { text: "Explore our creative services", type: "navigation", priority: 7 },
        { text: "See examples of our work", type: "information", priority: 6 }
      ],
      qualification: [
        { text: "What's your target audience?", type: "question", priority: 9 },
        { text: "What's your budget range?", type: "question", priority: 8 },
        { text: "When do you need this completed?", type: "question", priority: 7 },
        { text: "Start creating your project brief", type: "action", priority: 9 }
      ],
      briefing: [
        { text: "Add more project details", type: "action", priority: 9 },
        { text: "Review your brief so far", type: "information", priority: 8 },
        { text: "What style preferences do you have?", type: "question", priority: 7 },
        { text: "Export brief as PDF", type: "action", priority: 6 }
      ],
      completion: [
        { text: "Download your project brief", type: "action", priority: 9 },
        { text: "Start a new project", type: "navigation", priority: 8 },
        { text: "Contact our team directly", type: "action", priority: 7 },
        { text: "Schedule a consultation", type: "action", priority: 6 }
      ]
    },
    ar: {
      discovery: [
        { text: "أخبرني عن رؤية مشروعك", type: "question", priority: 9 },
        { text: "ما هو هدفك الأساسي من هذا المشروع؟", type: "question", priority: 8 },
        { text: "استكشف خدماتنا الإبداعية", type: "navigation", priority: 7 },
        { text: "شاهد أمثلة من أعمالنا", type: "information", priority: 6 }
      ],
      qualification: [
        { text: "من هو جمهورك المستهدف؟", type: "question", priority: 9 },
        { text: "ما هو نطاق ميزانيتك؟", type: "question", priority: 8 },
        { text: "متى تحتاج إنجاز المشروع؟", type: "question", priority: 7 },
        { text: "ابدأ إنشاء موجز مشروعك", type: "action", priority: 9 }
      ],
      briefing: [
        { text: "أضف المزيد من تفاصيل المشروع", type: "action", priority: 9 },
        { text: "راجع موجزك حتى الآن", type: "information", priority: 8 },
        { text: "ما تفضيلاتك في التصميم؟", type: "question", priority: 7 },
        { text: "صدّر الموجز كملف PDF", type: "action", priority: 6 }
      ],
      completion: [
        { text: "حمّل موجز مشروعك", type: "action", priority: 9 },
        { text: "ابدأ مشروعاً جديداً", type: "navigation", priority: 8 },
        { text: "تواصل مع فريقنا مباشرة", type: "action", priority: 7 },
        { text: "احجز استشارة مجانية", type: "action", priority: 6 }
      ]
    }
  }), []);

  const generateSmartSuggestions = useCallback((
    intentContext: IntentContext,
    conversationMemory: ConversationMemory,
    messages: ChatMessage[]
  ): SmartSuggestion[] => {
    const suggestions: SmartSuggestion[] = [];
    const phase = intentContext.conversationPhase;
    
    // Get base suggestions for current phase
    const baseTemplates = suggestionTemplates[currentLanguage][phase] || 
                         suggestionTemplates[currentLanguage].discovery;

    // Generate contextual suggestions
    baseTemplates.forEach((template, index) => {
      const suggestion: SmartSuggestion = {
        id: `${phase}-${index}`,
        text: template.text,
        type: template.type as any,
        priority: template.priority,
        context: phase,
        followUp: generateFollowUpSuggestions(template.text, intentContext)
      };

      // Adjust priority based on user preferences and context
      suggestion.priority = adjustPriorityBasedOnContext(
        suggestion,
        intentContext,
        conversationMemory,
        messages
      );

      suggestions.push(suggestion);
    });

    // Add intent-specific suggestions
    const intentSpecificSuggestions = generateIntentSpecificSuggestions(
      intentContext,
      conversationMemory
    );
    suggestions.push(...intentSpecificSuggestions);

    // Add personalized suggestions based on memory
    const personalizedSuggestions = generatePersonalizedSuggestions(
      conversationMemory,
      messages
    );
    suggestions.push(...personalizedSuggestions);

    // Sort by priority and return top suggestions
    return suggestions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 4)
      .filter(s => s.priority > 5); // Only show high-priority suggestions
  }, [currentLanguage, suggestionTemplates]);

  const generateFollowUpSuggestions = (
    originalText: string,
    intentContext: IntentContext
  ): string[] => {
    const followUps: Record<string, string[]> = currentLanguage === 'ar' ? {
      'أخبرني عن رؤية مشروعك': [
        'ما هي القيم الأساسية لمشروعك؟',
        'كيف تريد أن يظهر مشروعك؟',
        'ما هو الانطباع الذي تريد تركه؟'
      ],
      'من هو جمهورك المستهدف؟': [
        'ما الفئة العمرية المستهدفة؟',
        'أين يتواجد جمهورك؟',
        'ما اهتماماتهم الأساسية؟'
      ]
    } : {
      'Tell me about your business vision': [
        'What are your core values?',
        'How do you want to be perceived?',
        'What impression do you want to leave?'
      ],
      'What\'s your target audience?': [
        'What age group are you targeting?',
        'Where does your audience spend time?',
        'What are their main interests?'
      ]
    };

    return followUps[originalText] || [];
  };

  const adjustPriorityBasedOnContext = (
    suggestion: SmartSuggestion,
    intentContext: IntentContext,
    memory: ConversationMemory,
    messages: ChatMessage[]
  ): number => {
    let adjustedPriority = suggestion.priority;

    // Boost priority based on user preferences
    if (suggestion.type === 'action' && memory.sessionMetrics.engagementLevel === 'high') {
      adjustedPriority += 2;
    }

    // Boost based on previous conversation patterns
    const userMessages = messages.filter(m => m.sender === 'user');
    const lastUserMessage = userMessages[userMessages.length - 1]?.message.toLowerCase() || '';

    // If user recently asked about pricing, boost pricing-related suggestions
    if (lastUserMessage.includes('price') || lastUserMessage.includes('cost') ||
        lastUserMessage.includes('سعر') || lastUserMessage.includes('تكلفة')) {
      if (suggestion.text.toLowerCase().includes('budget') || 
          suggestion.text.includes('ميزانية')) {
        adjustedPriority += 3;
      }
    }

    // Boost timeline questions if user mentioned urgency
    if (lastUserMessage.includes('urgent') || lastUserMessage.includes('asap') ||
        lastUserMessage.includes('عاجل') || lastUserMessage.includes('سريع')) {
      if (suggestion.text.toLowerCase().includes('when') || 
          suggestion.text.includes('متى')) {
        adjustedPriority += 3;
      }
    }

    // Reduce priority if suggestion was recently used
    const recentSuggestions = suggestionHistory.slice(-5);
    if (recentSuggestions.some(s => s.text === suggestion.text)) {
      adjustedPriority -= 2;
    }

    return Math.max(adjustedPriority, 1);
  };

  const generateIntentSpecificSuggestions = (
    intentContext: IntentContext,
    memory: ConversationMemory
  ): SmartSuggestion[] => {
    const suggestions: SmartSuggestion[] = [];
    
    switch (intentContext.intent) {
      case 'pricing_question':
        suggestions.push({
          id: 'pricing-custom',
          text: currentLanguage === 'ar' ? 
            'احصل على عرض سعر مخصص' : 
            'Get a custom quote',
          type: 'action',
          priority: 10,
          context: 'pricing',
          followUp: currentLanguage === 'ar' ? 
            ['ما تفاصيل مشروعك؟', 'ما نطاق الخدمات المطلوبة؟'] :
            ['What are your project details?', 'What services do you need?']
        });
        break;

      case 'creative_assistance':
        suggestions.push({
          id: 'creative-custom',
          text: currentLanguage === 'ar' ? 
            'استكشف أفكار إبداعية معي' : 
            'Explore creative ideas with me',
          type: 'question',
          priority: 9,
          context: 'creative',
          followUp: currentLanguage === 'ar' ? 
            ['ما الأسلوب المفضل؟', 'أي أمثلة تعجبك؟'] :
            ['What style do you prefer?', 'Any examples you like?']
        });
        break;

      case 'portfolio_request':
        suggestions.push({
          id: 'portfolio-custom',
          text: currentLanguage === 'ar' ? 
            'شاهد أعمالنا في مجالك' : 
            'See our work in your industry',
          type: 'information',
          priority: 8,
          context: 'portfolio'
        });
        break;
    }

    return suggestions;
  };

  const generatePersonalizedSuggestions = (
    memory: ConversationMemory,
    messages: ChatMessage[]
  ): SmartSuggestion[] => {
    const suggestions: SmartSuggestion[] = [];

    // Based on mentioned services
    if (memory.projectContext.mentionedServices.length > 0) {
      const service = memory.projectContext.mentionedServices[0];
      suggestions.push({
        id: 'service-follow-up',
        text: currentLanguage === 'ar' ? 
          `دعنا نطور فكرة ${service} أكثر` :
          `Let's develop your ${service} idea further`,
        type: 'question',
        priority: 8,
        context: 'service-specific'
      });
    }

    // Based on completion likelihood
    if (memory.sessionMetrics.completionLikelihood > 0.7) {
      suggestions.push({
        id: 'completion-prompt',
        text: currentLanguage === 'ar' ? 
          'يبدو أنك جاهز لبدء المشروع!' :
          'Looks like you\'re ready to start the project!',
        type: 'action',
        priority: 9,
        context: 'completion'
      });
    }

    // Based on engagement level
    if (memory.sessionMetrics.engagementLevel === 'high') {
      suggestions.push({
        id: 'deep-dive',
        text: currentLanguage === 'ar' ? 
          'دعنا نتعمق في التفاصيل' :
          'Let\'s dive deeper into the details',
        type: 'question',
        priority: 7,
        context: 'engagement'
      });
    }

    return suggestions;
  };

  const recordSuggestionUsage = useCallback((suggestion: SmartSuggestion) => {
    setSuggestionHistory(prev => [...prev.slice(-9), suggestion]);
  }, []);

  const getSuggestionsByType = useCallback((type: SmartSuggestion['type']): SmartSuggestion[] => {
    return suggestionHistory.filter(s => s.type === type);
  }, [suggestionHistory]);

  return {
    generateSmartSuggestions,
    recordSuggestionUsage,
    getSuggestionsByType,
    suggestionHistory
  };
};
