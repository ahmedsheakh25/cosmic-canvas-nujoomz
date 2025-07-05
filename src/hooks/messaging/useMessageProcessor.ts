import { useState } from 'react';
import type { MessageProcessorProps, MessageProcessorState, ProcessorChatMessage } from './types';
import { getDefaultResponse, getErrorResponse, getDefaultSuggestedReplies } from './responseUtils';
import { processUserMessage, processAIResponse } from './messageService';

export const useMessageProcessor = ({
  sessionId,
  onAddMessage,
  onSetLoading,
  detectLanguage
}: MessageProcessorProps): MessageProcessorState => {
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>(getDefaultSuggestedReplies());

  const processMessage = async (messageToSend: string) => {
    if (!messageToSend.trim() || !sessionId) return;

    const detectedLanguage = detectLanguage(messageToSend);
    
    // Add user message immediately
    const userMessage: ProcessorChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: messageToSend,
      timestamp: new Date()
    };
    
    onAddMessage(userMessage);
    onSetLoading(true);

    try {
      // Process user message
      await processUserMessage(messageToSend, sessionId, detectedLanguage);

      // Get AI response
      const result = await processAIResponse(messageToSend, sessionId, detectedLanguage);

      const aiResponse = result.response || getDefaultResponse(detectedLanguage);

      // Add AI response
      const aiMessage: ProcessorChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'nujmooz',
        content: aiResponse,
        timestamp: new Date()
      };

      onAddMessage(aiMessage);

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ProcessorChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'nujmooz',
        content: getErrorResponse(detectedLanguage),
        timestamp: new Date()
      };
      
      onAddMessage(errorMessage);
    } finally {
      onSetLoading(false);
    }
  };

  return {
    processMessage,
    suggestedReplies,
    setSuggestedReplies
  };
}; 