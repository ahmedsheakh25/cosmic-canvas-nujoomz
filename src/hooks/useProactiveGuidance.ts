
import { useState, useCallback, useEffect } from 'react';
import { type ChatMessage } from '@/utils/sessionManager';
import { type IntentContext } from './useIntentAnalysis';
import { type ConversationMemory } from './useConversationMemory';

export type GuidanceAction = {
  id: string;
  type: 'hint' | 'redirect' | 'clarification' | 'completion_prompt';
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  trigger: string;
  timing: 'immediate' | 'delayed' | 'contextual';
};

export const useProactiveGuidance = (currentLanguage: 'en' | 'ar') => {
  const [activeGuidance, setActiveGuidance] = useState<GuidanceAction[]>([]);
  const [guidanceHistory, setGuidanceHistory] = useState<GuidanceAction[]>([]);

  // Define guidance patterns and triggers
  const guidancePatterns = {
    stagnation: {
      trigger: 'repeated_similar_questions',
      threshold: 3,
      action: {
        en: "I notice you're asking similar questions. Let me help you move forward with your project brief!",
        ar: "ألاحظ أنك تسأل أسئلة متشابهة. دعني أساعدك في المضي قدماً بموجز مشروعك!"
      }
    },
    confusion: {
      trigger: 'unclear_responses',
      threshold: 2,
      action: {
        en: "It seems like there might be some confusion. Would you like me to clarify our services?",
        ar: "يبدو أن هناك بعض الغموض. هل تريد مني توضيح خدماتنا؟"
      }
    },
    hesitation: {
      trigger: 'long_pause_before_brief',
      threshold: 5,
      action: {
        en: "Take your time! Creating a project brief is an important step. I'm here to guide you through it.",
        ar: "خذ وقتك! إنشاء موجز المشروع خطوة مهمة. أنا هنا لأرشدك خلالها."
      }
    },
    completion_ready: {
      trigger: 'high_completion_likelihood',
      threshold: 0.8,
      action: {
        en: "Great progress! You seem ready to complete your project brief. Shall we finalize it?",
        ar: "تقدم رائع! يبدو أنك مستعد لإكمال موجز مشروعك. هل نقوم بوضع اللمسة الأخيرة؟"
      }
    }
  };

  const analyzeConversationFlow = useCallback((
    messages: ChatMessage[],
    intentContext: IntentContext,
    memory: ConversationMemory
  ): GuidanceAction[] => {
    const guidance: GuidanceAction[] = [];
    
    // Check for stagnation patterns
    const stagnationGuidance = checkForStagnation(messages, intentContext);
    if (stagnationGuidance) guidance.push(stagnationGuidance);

    // Check for confusion indicators
    const confusionGuidance = checkForConfusion(messages, memory);
    if (confusionGuidance) guidance.push(confusionGuidance);

    // Check for hesitation in brief creation
    const hesitationGuidance = checkForHesitation(intentContext, memory);
    if (hesitationGuidance) guidance.push(hesitationGuidance);

    // Check if user is ready for completion
    const completionGuidance = checkForCompletionReadiness(memory, intentContext);
    if (completionGuidance) guidance.push(completionGuidance);

    // Check for conversation length and engagement
    const engagementGuidance = checkEngagementLevel(messages, memory);
    if (engagementGuidance) guidance.push(engagementGuidance);

    return guidance;
  }, [currentLanguage]);

  const checkForStagnation = (
    messages: ChatMessage[],
    intentContext: IntentContext
  ): GuidanceAction | null => {
    const recentUserMessages = messages
      .filter(m => m.sender === 'user')
      .slice(-5);

    // Check for repeated similar intents
    const intentCounts: Record<string, number> = {};
    recentUserMessages.forEach(msg => {
      // Simple intent similarity check
      const intent = intentContext.intent;
      intentCounts[intent] = (intentCounts[intent] || 0) + 1;
    });

    const maxRepeats = Math.max(...Object.values(intentCounts));
    if (maxRepeats >= 3) {
      return {
        id: `stagnation-${Date.now()}`,
        type: 'redirect',
        message: guidancePatterns.stagnation.action[currentLanguage],
        priority: 'medium',
        trigger: 'repeated_intents',
        timing: 'immediate'
      };
    }

    return null;
  };

  const checkForConfusion = (
    messages: ChatMessage[],
    memory: ConversationMemory
  ): GuidanceAction | null => {
    const recentMessages = messages.slice(-6);
    const userMessages = recentMessages.filter(m => m.sender === 'user');
    
    // Check for confusion indicators
    const confusionKeywords = currentLanguage === 'ar' ? [
      'لا أفهم', 'غير واضح', 'ماذا تقصد', 'مربك'
    ] : [
      'confused', 'don\'t understand', 'not clear', 'what do you mean'
    ];

    const hasConfusionIndicators = userMessages.some(msg =>
      confusionKeywords.some(keyword => 
        msg.message.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    if (hasConfusionIndicators || memory.sessionMetrics.engagementLevel === 'low') {
      return {
        id: `confusion-${Date.now()}`,
        type: 'clarification',
        message: guidancePatterns.confusion.action[currentLanguage],
        priority: 'high',
        trigger: 'confusion_detected',
        timing: 'immediate'
      };
    }

    return null;
  };

  const checkForHesitation = (
    intentContext: IntentContext,
    memory: ConversationMemory
  ): GuidanceAction | null => {
    // Check if user is in briefing phase but completion likelihood is low
    if (intentContext.conversationPhase === 'qualification' && 
        memory.sessionMetrics.completionLikelihood < 0.4 &&
        memory.sessionMetrics.messageCount > 8) {
      
      return {
        id: `hesitation-${Date.now()}`,
        type: 'hint',
        message: guidancePatterns.hesitation.action[currentLanguage],
        priority: 'medium',
        trigger: 'hesitation_in_briefing',
        timing: 'contextual'
      };
    }

    return null;
  };

  const checkForCompletionReadiness = (
    memory: ConversationMemory,
    intentContext: IntentContext
  ): GuidanceAction | null => {
    if (memory.sessionMetrics.completionLikelihood > 0.8 &&
        intentContext.conversationPhase !== 'completion') {
      
      return {
        id: `completion-ready-${Date.now()}`,
        type: 'completion_prompt',
        message: guidancePatterns.completion_ready.action[currentLanguage],
        priority: 'high',
        trigger: 'high_completion_likelihood',
        timing: 'contextual'
      };
    }

    return null;
  };

  const checkEngagementLevel = (
    messages: ChatMessage[],
    memory: ConversationMemory
  ): GuidanceAction | null => {
    // If conversation is very long but engagement is medium/low
    if (messages.length > 15 && 
        memory.sessionMetrics.engagementLevel !== 'high' &&
        memory.sessionMetrics.completionLikelihood < 0.5) {
      
      const message = currentLanguage === 'ar' ?
        "أرى أننا تحدثنا كثيراً! دعني ألخص ما فهمته وأساعدك في اتخاذ الخطوة التالية." :
        "I see we've been chatting for a while! Let me summarize what I understand and help you take the next step.";

      return {
        id: `engagement-${Date.now()}`,
        type: 'redirect',
        message,
        priority: 'medium',
        trigger: 'low_engagement_long_conversation',
        timing: 'contextual'
      };
    }

    return null;
  };

  const activateGuidance = useCallback((guidance: GuidanceAction[]) => {
    // Filter out duplicate guidance
    const newGuidance = guidance.filter(g => 
      !activeGuidance.some(ag => ag.trigger === g.trigger)
    );

    if (newGuidance.length > 0) {
      setActiveGuidance(prev => [...prev, ...newGuidance]);
      setGuidanceHistory(prev => [...prev.slice(-10), ...newGuidance]);
    }
  }, [activeGuidance]);

  const dismissGuidance = useCallback((guidanceId: string) => {
    setActiveGuidance(prev => prev.filter(g => g.id !== guidanceId));
  }, []);

  const getNextGuidanceMessage = useCallback((): GuidanceAction | null => {
    const sortedGuidance = activeGuidance.sort((a, b) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    return sortedGuidance[0] || null;
  }, [activeGuidance]);

  const shouldShowGuidance = useCallback((
    messages: ChatMessage[],
    intentContext: IntentContext
  ): boolean => {
    // Don't show guidance too frequently
    const lastGuidance = guidanceHistory[guidanceHistory.length - 1];
    if (lastGuidance) {
      const timeSinceLastGuidance = Date.now() - parseInt(lastGuidance.id.split('-')[1]);
      if (timeSinceLastGuidance < 30000) return false; // 30 seconds cooldown
    }

    // Don't show guidance if user is actively responding
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.sender === 'user') {
      const messageAge = Date.now() - new Date(lastMessage.created_at).getTime();
      if (messageAge < 10000) return false; // Don't interrupt recent user activity
    }

    return true;
  }, [guidanceHistory]);

  const generateContextualHints = useCallback((
    intentContext: IntentContext,
    memory: ConversationMemory
  ): string[] => {
    const hints: string[] = [];

    // Hints based on conversation phase
    switch (intentContext.conversationPhase) {
      case 'discovery':
        hints.push(
          currentLanguage === 'ar' ?
            "💡 ابدأ بوصف فكرة مشروعك بكلمات بسيطة" :
            "💡 Start by describing your project idea in simple terms"
        );
        break;
      
      case 'qualification':
        hints.push(
          currentLanguage === 'ar' ?
            "📝 كلما أعطيتني تفاصيل أكثر، كان الموجز أفضل" :
            "📝 The more details you provide, the better your brief will be"
        );
        break;
      
      case 'briefing':
        hints.push(
          currentLanguage === 'ar' ?
            "✨ نحن على وشك الانتهاء! استمر في الإجابة على الأسئلة" :
            "✨ We're almost done! Keep answering the questions"
        );
        break;
    }

    // Hints based on missing information
    if (!memory.projectContext.budgetRange) {
      hints.push(
        currentLanguage === 'ar' ?
          "💰 تحديد الميزانية يساعدني في تقديم اقتراحات مناسبة" :
          "💰 Knowing your budget helps me provide suitable suggestions"
      );
    }

    if (!memory.projectContext.timelinePreference) {
      hints.push(
        currentLanguage === 'ar' ?
          "⏰ أخبرني عن الجدول الزمني المناسب لك" :
          "⏰ Let me know about your preferred timeline"
      );
    }

    return hints.slice(0, 2); // Return max 2 hints
  }, [currentLanguage]);

  return {
    analyzeConversationFlow,
    activateGuidance,
    dismissGuidance,
    getNextGuidanceMessage,
    shouldShowGuidance,
    generateContextualHints,
    activeGuidance,
    guidanceHistory
  };
};
