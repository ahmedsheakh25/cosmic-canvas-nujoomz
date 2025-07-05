
import { useState } from 'react';
import { type ChatMessage } from '@/utils/sessionManager';
import { type IntentContext } from '../useIntentAnalysis';
import { type ConversationMemoryHook } from '@/types/conversationMemory';
import { useMessageSender } from './useMessageSender';
import { useMessageBlocking } from './useMessageBlocking';
import { useAdvancedMessageProcessor } from './useAdvancedMessageProcessor';
import { usePersonalizedMessages } from './usePersonalizedMessages';

export const useMessageProcessing = (
  sessionId: string,
  currentLanguage: 'en' | 'ar',
  messages: ChatMessage[],
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setSuggestedReplies: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const messageSender = useMessageSender(sessionId, currentLanguage, messages, setMessages);
  const messageBlocking = useMessageBlocking(sessionId, setMessages, setSuggestedReplies);
  const advancedProcessor = useAdvancedMessageProcessor(sessionId, currentLanguage, messages, setMessages);
  const personalizedMessages = usePersonalizedMessages();

  const processMessage = async (
    finalMessage: string,
    effectiveLanguage: 'en' | 'ar',
    intentContext: IntentContext,
    conversationMemory: ConversationMemoryHook
  ) => {
    // Check if message is blocked
    const isBlocked = await messageBlocking.handleBlockedMessage(finalMessage, effectiveLanguage);
    if (isBlocked) return { blocked: true };

    // Add user message to UI
    await messageSender.addUserMessage(finalMessage, effectiveLanguage);

    return { blocked: false };
  };

  const processEnhancedChat = async (
    finalMessage: string,
    effectiveLanguage: 'en' | 'ar',
    intentContext: IntentContext,
    conversationMemory: ConversationMemoryHook
  ): Promise<string> => {
    try {
      const enhancedResponse = await advancedProcessor.processEnhancedChat(
        finalMessage,
        effectiveLanguage,
        intentContext,
        conversationMemory.memory
      );

      return conversationMemory.getPersonalizedResponse(enhancedResponse, intentContext);
    } catch (apiError) {
      console.error('Enhanced API Error:', apiError);
      return personalizedMessages.getApiErrorMessage(effectiveLanguage, conversationMemory.memory);
    }
  };

  return {
    messageSender,
    messageBlocking,
    advancedProcessor,
    personalizedMessages,
    processMessage,
    processEnhancedChat
  };
};
