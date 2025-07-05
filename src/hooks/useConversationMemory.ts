import { useState, useCallback, useRef } from 'react';
import { type ChatMessage } from '@/utils/sessionManager';
import { type UserIntent, type IntentContext } from './useIntentAnalysis';

export type ConversationMemory = {
  userPreferences: {
    communicationStyle: 'formal' | 'casual' | 'friendly';
    responseLength: 'brief' | 'detailed' | 'comprehensive';
    languagePreference: 'en' | 'ar';
    topicInterests: string[];
  };
  projectContext: {
    mentionedServices: string[];
    budgetRange?: string;
    timelinePreference?: string;
    industryFocus?: string;
    designPreferences: string[];
  };
  conversationPatterns: {
    frequentQuestions: string[];
    responsePatterns: Record<string, number>;
    satisfactionIndicators: number[];
  };
  sessionMetrics: {
    messageCount: number;
    avgResponseTime: number;
    engagementLevel: 'low' | 'medium' | 'high';
    completionLikelihood: number;
  };
};

export const useConversationMemory = (sessionId: string, currentLanguage: 'en' | 'ar') => {
  const [memory, setMemory] = useState<ConversationMemory>({
    userPreferences: {
      communicationStyle: 'friendly',
      responseLength: 'detailed',
      languagePreference: currentLanguage,
      topicInterests: []
    },
    projectContext: {
      mentionedServices: [],
      designPreferences: []
    },
    conversationPatterns: {
      frequentQuestions: [],
      responsePatterns: {},
      satisfactionIndicators: []
    },
    sessionMetrics: {
      messageCount: 0,
      avgResponseTime: 0,
      engagementLevel: 'medium',
      completionLikelihood: 0.5
    }
  });

  const responseTimeRef = useRef<number>(Date.now());

  const updateMemory = useCallback((
    messages: ChatMessage[],
    intentContext: IntentContext,
    userMessage: string
  ) => {
    setMemory(prev => {
      const updated = { ...prev };

      // Update user preferences based on message patterns
      updateUserPreferences(updated, userMessage, messages);

      // Update project context
      updateProjectContext(updated, intentContext, userMessage);

      // Update conversation patterns
      updateConversationPatterns(updated, messages, intentContext);

      // Update session metrics
      updateSessionMetrics(updated, messages);

      return updated;
    });
  }, []);

  const updateUserPreferences = (
    memory: ConversationMemory,
    message: string,
    messages: ChatMessage[]
  ) => {
    // Detect communication style preference
    const formalIndicators = ['please', 'thank you', 'could you', 'would you mind'];
    const casualIndicators = ['hey', 'cool', 'awesome', 'great'];
    
    if (currentLanguage === 'ar') {
      const arabicFormal = ['من فضلك', 'شكراً', 'هل يمكنك', 'لو سمحت'];
      const arabicCasual = ['أهلاً', 'رائع', 'ممتاز', 'يلا'];
      
      if (arabicFormal.some(indicator => message.includes(indicator))) {
        memory.userPreferences.communicationStyle = 'formal';
      } else if (arabicCasual.some(indicator => message.includes(indicator))) {
        memory.userPreferences.communicationStyle = 'casual';
      }
    } else {
      if (formalIndicators.some(indicator => message.toLowerCase().includes(indicator))) {
        memory.userPreferences.communicationStyle = 'formal';
      } else if (casualIndicators.some(indicator => message.toLowerCase().includes(indicator))) {
        memory.userPreferences.communicationStyle = 'casual';
      }
    }

    // Detect response length preference based on user message length
    const avgUserMessageLength = messages
      .filter(m => m.sender === 'user')
      .reduce((sum, m) => sum + m.message.length, 0) / 
      Math.max(messages.filter(m => m.sender === 'user').length, 1);

    if (avgUserMessageLength < 50) {
      memory.userPreferences.responseLength = 'brief';
    } else if (avgUserMessageLength > 150) {
      memory.userPreferences.responseLength = 'comprehensive';
    }

    // Extract topic interests
    const topicKeywords = currentLanguage === 'ar' ? [
      'تصميم', 'تطوير', 'تسويق', 'هوية', 'موقع', 'تجارة'
    ] : [
      'design', 'development', 'marketing', 'branding', 'website', 'ecommerce'
    ];

    topicKeywords.forEach(topic => {
      if (message.toLowerCase().includes(topic.toLowerCase()) && 
          !memory.userPreferences.topicInterests.includes(topic)) {
        memory.userPreferences.topicInterests.push(topic);
      }
    });
  };

  const updateProjectContext = (
    memory: ConversationMemory,
    intentContext: IntentContext,
    message: string
  ) => {
    // Extract mentioned services
    if (intentContext.entities.service && 
        !memory.projectContext.mentionedServices.includes(intentContext.entities.service)) {
      memory.projectContext.mentionedServices.push(intentContext.entities.service);
    }

    // Extract budget information
    if (intentContext.entities.budget) {
      memory.projectContext.budgetRange = intentContext.entities.budget;
    }

    // Extract timeline preferences
    if (intentContext.entities.timeline) {
      memory.projectContext.timelinePreference = intentContext.entities.timeline;
    }

    // Extract industry focus
    const industryKeywords = currentLanguage === 'ar' ? {
      'تجارة إلكترونية': ['متجر', 'بيع', 'منتجات'],
      'تعليم': ['تعليم', 'دورات', 'طلاب'],
      'صحة': ['طبي', 'صحة', 'مستشفى'],
      'تقنية': ['تطبيق', 'برمجة', 'تقنية']
    } : {
      'ecommerce': ['store', 'shop', 'products', 'sell'],
      'education': ['education', 'courses', 'students', 'learning'],
      'healthcare': ['medical', 'health', 'hospital', 'clinic'],
      'technology': ['app', 'software', 'tech', 'platform']
    };

    Object.entries(industryKeywords).forEach(([industry, keywords]) => {
      if (keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()))) {
        memory.projectContext.industryFocus = industry;
      }
    });

    // Extract design preferences
    const designKeywords = currentLanguage === 'ar' ? [
      'بسيط', 'عصري', 'كلاسيكي', 'ملون', 'أحادي اللون'
    ] : [
      'minimalist', 'modern', 'classic', 'colorful', 'monochrome'
    ];

    designKeywords.forEach(preference => {
      if (message.toLowerCase().includes(preference.toLowerCase()) &&
          !memory.projectContext.designPreferences.includes(preference)) {
        memory.projectContext.designPreferences.push(preference);
      }
    });
  };

  const updateConversationPatterns = (
    memory: ConversationMemory,
    messages: ChatMessage[],
    intentContext: IntentContext
  ) => {
    // Track frequent question patterns
    const questionIndicators = currentLanguage === 'ar' ? 
      ['هل', 'ماذا', 'كيف', 'متى', 'لماذا'] :
      ['what', 'how', 'when', 'why', 'can', 'do'];

    const lastUserMessage = messages.filter(m => m.sender === 'user').slice(-1)[0];
    if (lastUserMessage && questionIndicators.some(q => 
        lastUserMessage.message.toLowerCase().includes(q.toLowerCase()))) {
      
      const questionType = extractQuestionType(lastUserMessage.message);
      if (!memory.conversationPatterns.frequentQuestions.includes(questionType)) {
        memory.conversationPatterns.frequentQuestions.push(questionType);
      }
    }

    // Track response patterns
    const patternKey = intentContext.intent;
    memory.conversationPatterns.responsePatterns[patternKey] = 
      (memory.conversationPatterns.responsePatterns[patternKey] || 0) + 1;

    // Calculate satisfaction indicators
    const satisfactionKeywords = currentLanguage === 'ar' ? 
      ['ممتاز', 'رائع', 'شكراً', 'مفيد'] :
      ['great', 'excellent', 'thanks', 'helpful'];

    if (satisfactionKeywords.some(keyword => 
        lastUserMessage?.message.toLowerCase().includes(keyword.toLowerCase()))) {
      memory.conversationPatterns.satisfactionIndicators.push(1);
    } else {
      memory.conversationPatterns.satisfactionIndicators.push(0);
    }

    // Keep only last 10 satisfaction indicators
    if (memory.conversationPatterns.satisfactionIndicators.length > 10) {
      memory.conversationPatterns.satisfactionIndicators = 
        memory.conversationPatterns.satisfactionIndicators.slice(-10);
    }
  };

  const updateSessionMetrics = (
    memory: ConversationMemory,
    messages: ChatMessage[]
  ) => {
    memory.sessionMetrics.messageCount = messages.length;

    // Calculate engagement level based on message frequency and length
    const userMessages = messages.filter(m => m.sender === 'user');
    const avgMessageLength = userMessages.reduce((sum, m) => sum + m.message.length, 0) / 
      Math.max(userMessages.length, 1);

    if (avgMessageLength > 100 && userMessages.length > 5) {
      memory.sessionMetrics.engagementLevel = 'high';
    } else if (avgMessageLength < 30 || userMessages.length < 3) {
      memory.sessionMetrics.engagementLevel = 'low';
    } else {
      memory.sessionMetrics.engagementLevel = 'medium';
    }

    // Calculate completion likelihood based on conversation progression
    const intentProgression = memory.conversationPatterns.responsePatterns;
    const briefingMessages = intentProgression['brief_creation'] || 0;
    const totalMessages = Object.values(intentProgression).reduce((sum, count) => sum + count, 0);

    memory.sessionMetrics.completionLikelihood = Math.min(
      0.1 + (briefingMessages / Math.max(totalMessages, 1)) * 0.8 + 
      (memory.sessionMetrics.engagementLevel === 'high' ? 0.1 : 0),
      0.95
    );
  };

  const extractQuestionType = (message: string): string => {
    const questionTypes = currentLanguage === 'ar' ? {
      'pricing': ['سعر', 'تكلفة', 'كم'],
      'timeline': ['متى', 'مدة', 'وقت'],
      'services': ['خدمات', 'تقدمون', 'تعملون'],
      'process': ['كيف', 'عملية', 'خطوات']
    } : {
      'pricing': ['cost', 'price', 'how much'],
      'timeline': ['when', 'how long', 'timeline'],
      'services': ['services', 'what do you', 'can you'],
      'process': ['how do', 'process', 'steps']
    };

    for (const [type, keywords] of Object.entries(questionTypes)) {
      if (keywords.some(keyword => message.toLowerCase().includes(keyword.toLowerCase()))) {
        return type;
      }
    }

    return 'general';
  };

  const getPersonalizedResponse = (baseResponse: string, context: IntentContext): string => {
    let personalizedResponse = baseResponse;

    // Adjust for communication style
    if (memory.userPreferences.communicationStyle === 'formal') {
      personalizedResponse = currentLanguage === 'ar' ?
        personalizedResponse.replace(/يلا/g, 'دعنا').replace(/رائع/g, 'ممتاز') :
        personalizedResponse.replace(/Great!/g, 'Excellent!').replace(/Let\'s/g, 'Let us');
    } else if (memory.userPreferences.communicationStyle === 'casual') {
      personalizedResponse = currentLanguage === 'ar' ?
        `${personalizedResponse} 😊` :
        `${personalizedResponse} 😊`;
    }

    // Adjust for response length preference
    if (memory.userPreferences.responseLength === 'brief') {
      // Truncate long responses
      const sentences = personalizedResponse.split(/[.!?]/);
      if (sentences.length > 2) {
        personalizedResponse = sentences.slice(0, 2).join('. ') + '.';
      }
    }

    // Add project context references
    if (memory.projectContext.mentionedServices.length > 0) {
      const service = memory.projectContext.mentionedServices[0];
      const contextualNote = currentLanguage === 'ar' ?
        `\n\nبناءً على اهتمامك بـ${service}...` :
        `\n\nBased on your interest in ${service}...`;
      
      if (context.intent === 'project_inquiry') {
        personalizedResponse += contextualNote;
      }
    }

    return personalizedResponse;
  };

  const getSatisfactionScore = (): number => {
    const indicators = memory.conversationPatterns.satisfactionIndicators;
    if (indicators.length === 0) return 0.5;
    
    return indicators.reduce((sum, score) => sum + score, 0) / indicators.length;
  };

  return {
    memory,
    updateMemory,
    getPersonalizedResponse,
    getSatisfactionScore
  };
};
