
import { useState } from 'react';
import { type ChatMessage } from '@/utils/sessionManager';
import { getResponse } from '@/lib/responses';
import { useMessageProcessing } from './messaging/useMessageProcessing';
import { useConversationFlowManager } from './messaging/useConversationFlowManager';
import { useEnhancedDataProcessor } from './messaging/useEnhancedDataProcessor';
import { useAdvancedSmartSuggestions } from './useAdvancedSmartSuggestions';
import { useEnhancedContextProcessor } from './messaging/useEnhancedContextProcessor';
import { useEnhancedChatProcessor } from './messaging/useEnhancedChatProcessor';
import { usePersonalizedMessages } from './messaging/usePersonalizedMessages';

export const useRefactoredEnhancedMessageHandler = (
  sessionId: string,
  currentLanguage: 'en' | 'ar',
  messages: ChatMessage[],
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  
  const advancedSuggestions = useAdvancedSmartSuggestions(currentLanguage);
  const personalizedMessages = usePersonalizedMessages();
  
  const messageProcessing = useMessageProcessing(
    sessionId, 
    currentLanguage, 
    messages, 
    setMessages, 
    setSuggestedReplies
  );
  
  const conversationFlowManager = useConversationFlowManager(
    sessionId, 
    currentLanguage, 
    messages, 
    setMessages
  );
  
  const enhancedDataProcessor = useEnhancedDataProcessor(currentLanguage);
  const enhancedContextProcessor = useEnhancedContextProcessor(sessionId, currentLanguage, messages);
  const enhancedChatProcessor = useEnhancedChatProcessor(currentLanguage);

  const handleSendMessage = async (messageText?: string, userMessage?: string) => {
    const finalMessage = messageText || userMessage;
    if (!finalMessage || !sessionId) return;

    setSuggestedReplies([]);
    const effectiveLanguage = messageProcessing.messageSender.detectEffectiveLanguage(finalMessage);

    try {
      // Process message and check if blocked
      const messageResult = await messageProcessing.processMessage(
        finalMessage,
        effectiveLanguage,
        null,
        enhancedContextProcessor.conversationMemory
      );

      if (messageResult.blocked) return;

      // Process enhanced context
      const { contextWithServices, conversationMemory } = enhancedContextProcessor.processMessageContext(
        finalMessage,
        effectiveLanguage
      );

      // Process enhanced contextual data
      const { contextualSuggestions, guidanceActions } = enhancedDataProcessor.processContextualData(
        contextWithServices,
        conversationMemory,
        messages
      );

      let aiResponse = '';
      let nextSuggestions: string[] = [];

      // Check for creative skills first
      const { skillResponse, suggestions: skillSuggestions } = await conversationFlowManager.handleCreativeSkills(finalMessage);
      
      if (skillResponse) {
        aiResponse = await enhancedChatProcessor.processEnhancedChatWithAI(
          skillResponse,
          effectiveLanguage,
          contextWithServices,
          conversationMemory,
          messages,
          messageProcessing.processEnhancedChat
        );
        nextSuggestions = skillSuggestions;
      } 
      // Handle conversation flow with enhanced AI context
      else {
        const flowResult = conversationFlowManager.handleConversationFlow(
          finalMessage,
          conversationMemory,
          contextWithServices
        );
        
        if (flowResult) {
          aiResponse = await enhancedChatProcessor.processEnhancedChatWithAI(
            flowResult.response,
            effectiveLanguage,
            contextWithServices,
            conversationMemory,
            messages,
            messageProcessing.processEnhancedChat
          );
          nextSuggestions = flowResult.suggestions;

          // Handle brief completion with enhanced AI workflow
          if (flowResult.completeBrief && flowResult.briefData) {
            const completionResult = await conversationFlowManager.processBriefCompletion(
              flowResult.briefData,
              conversationMemory,
              contextWithServices,
              messageProcessing.advancedProcessor
            );

            if (completionResult.success) {
              const enhancedSuccessMessage = await personalizedMessages.getEnhancedSuccessMessage(
                effectiveLanguage,
                completionResult.workflowResult,
                conversationMemory.memory
              );
              
              await messageProcessing.messageSender.addAIMessage(enhancedSuccessMessage, effectiveLanguage);
              return;
            } else {
              console.error('Enhanced workflow error:', completionResult.error);
              
              const intelligentFallback = await enhancedChatProcessor.generateIntelligentFallback(
                effectiveLanguage, 
                conversationMemory.memory, 
                contextWithServices
              );
              await messageProcessing.messageSender.addAIMessage(intelligentFallback, effectiveLanguage);
              return;
            }
          }
        } 
        // Enhanced general chat with deep AI understanding
        else {
          aiResponse = await enhancedChatProcessor.processEnhancedChatWithAI(
            finalMessage,
            effectiveLanguage,
            contextWithServices,
            conversationMemory,
            messages,
            messageProcessing.processEnhancedChat
          );
          
          // Generate advanced smart suggestions
          const advancedSuggestionsList = advancedSuggestions.generateAdvancedSuggestions(
            contextWithServices,
            conversationMemory.memory,
            messages
          );
          
          nextSuggestions = advancedSuggestionsList.map(s => s.text);
        }
      }

      // Add proactive AI guidance
      const aiGuidanceHints = enhancedDataProcessor.processGuidanceActions(
        guidanceActions,
        messages,
        contextWithServices,
        conversationMemory
      );

      if (aiGuidanceHints) {
        aiResponse += aiGuidanceHints;
      }

      // Add additional AI insights based on enhanced context
      const contextualInsights = await enhancedChatProcessor.generateContextualInsights(
        contextWithServices,
        conversationMemory.memory,
        messages
      );

      if (contextualInsights) {
        aiResponse += contextualInsights;
      }

      // Add AI response with enhanced personalization
      await messageProcessing.messageSender.addAIMessage(aiResponse, effectiveLanguage);

      // Set AI-powered smart suggestions
      if (nextSuggestions.length > 0) {
        setSuggestedReplies(nextSuggestions);
      } else {
        const smartSuggestions = advancedSuggestions.generateAdvancedSuggestions(
          contextWithServices,
          conversationMemory.memory,
          messages
        );
        setSuggestedReplies(smartSuggestions.slice(0, 4).map(s => s.text));
      }

    } catch (error) {
      console.error('Enhanced AI message handler error:', error);
      
      const intelligentErrorResponse = await enhancedChatProcessor.generateIntelligentErrorResponse(
        effectiveLanguage,
        enhancedContextProcessor.enhancedContext,
        enhancedContextProcessor.conversationMemory.memory
      );
      await messageProcessing.messageSender.addAIMessage(intelligentErrorResponse, effectiveLanguage);
    }
  };

  // Update suggested replies when language changes
  const updateSuggestedRepliesLanguage = (newLanguage: 'en' | 'ar') => {
    if (suggestedReplies.length > 0 && enhancedContextProcessor.enhancedContext) {
      const freshSuggestions = advancedSuggestions.generateAdvancedSuggestions(
        enhancedContextProcessor.enhancedContext,
        enhancedContextProcessor.conversationMemory.memory,
        messages
      );
      setSuggestedReplies(freshSuggestions.slice(0, 4).map(s => s.text));
    }
  };

  return {
    handleSendMessage,
    suggestedReplies,
    setSuggestedReplies,
    updateSuggestedRepliesLanguage,
    conversationFlow: conversationFlowManager.conversationFlow,
    creativeSkills: conversationFlowManager.creativeSkills,
    enhancedContext: enhancedContextProcessor.enhancedContext,
    conversationMemory: enhancedContextProcessor.conversationMemory,
    smartSuggestions: advancedSuggestions,
    proactiveGuidance: enhancedDataProcessor.proactiveGuidance,
    enhancedProcessor: enhancedChatProcessor
  };
};
