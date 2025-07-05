import { useCallback } from 'react';
import type { MessageHandlerProps } from './types';
import { ChatMessage as SessionChatMessage } from '@/utils/sessionManager';

export const useMessageHandler = ({
  sessionId,
  inputMessage,
  clearInput,
  isLoading,
  detectLanguage,
  processMessage,
  processMessageForFiles
}: MessageHandlerProps) => {
  const handleSendMessage = useCallback(async (content?: string) => {
    const messageToSend = content || inputMessage.trim();
    if (!messageToSend || isLoading) return;

    clearInput();
    await processMessage(messageToSend);

    // Process message for potential file generation with enhanced detection
    if (sessionId) {
      const aiMessage: SessionChatMessage = {
        id: `ai-${Date.now()}`,
        session_id: sessionId,
        message: messageToSend,
        sender: 'user',
        language: detectLanguage(messageToSend),
        created_at: new Date().toISOString()
      };
      
      await processMessageForFiles(aiMessage);
    }
  }, [sessionId, inputMessage, isLoading, clearInput, detectLanguage, processMessage, processMessageForFiles]);

  return {
    handleSendMessage
  };
}; 