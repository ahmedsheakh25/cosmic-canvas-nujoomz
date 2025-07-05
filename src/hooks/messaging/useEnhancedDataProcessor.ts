
import { type ChatMessage } from '@/utils/sessionManager';
import { type IntentContext } from '../useIntentAnalysis';
import { type ConversationMemoryHook } from '@/types/conversationMemory';
import { useSmartSuggestions } from '../useSmartSuggestions';
import { useProactiveGuidance } from '../useProactiveGuidance';

export const useEnhancedDataProcessor = (
  currentLanguage: 'en' | 'ar'
) => {
  const smartSuggestions = useSmartSuggestions(currentLanguage);
  const proactiveGuidance = useProactiveGuidance(currentLanguage);

  const processContextualData = (
    intentContext: IntentContext,
    conversationMemory: ConversationMemoryHook,
    messages: ChatMessage[]
  ) => {
    // Update conversation memory with new insights
    conversationMemory.updateMemory(messages, intentContext, messages[messages.length - 1]?.message || '');

    // Generate smart suggestions based on context
    const contextualSuggestions = smartSuggestions.generateSmartSuggestions(
      intentContext,
      conversationMemory.memory,
      messages
    );

    // Analyze conversation flow for proactive guidance
    const guidanceActions = proactiveGuidance.analyzeConversationFlow(
      messages,
      intentContext,
      conversationMemory.memory
    );

    return {
      contextualSuggestions,
      guidanceActions
    };
  };

  const processGuidanceActions = (
    guidanceActions: any[],
    messages: ChatMessage[],
    intentContext: IntentContext,
    conversationMemory: ConversationMemoryHook
  ) => {
    if (guidanceActions.length > 0) {
      proactiveGuidance.activateGuidance(guidanceActions);
    }

    // Add proactive guidance if appropriate
    const nextGuidance = proactiveGuidance.getNextGuidanceMessage();
    if (nextGuidance && proactiveGuidance.shouldShowGuidance(messages, intentContext)) {
      const guidanceHints = proactiveGuidance.generateContextualHints(
        intentContext,
        conversationMemory.memory
      );
      
      if (guidanceHints.length > 0) {
        const hintsText = '\n\n' + guidanceHints.join('\n');
        proactiveGuidance.dismissGuidance(nextGuidance.id);
        return hintsText;
      }
      
      proactiveGuidance.dismissGuidance(nextGuidance.id);
    }

    return '';
  };

  return {
    smartSuggestions,
    proactiveGuidance,
    processContextualData,
    processGuidanceActions
  };
};
