
import { type ChatMessage } from '@/utils/sessionManager';
import { type StorableChatMessage } from '@/types/conversation';

export const convertToStorableMessage = (message: ChatMessage): StorableChatMessage => {
  return {
    id: message.id,
    session_id: message.session_id,
    message: message.message,
    sender: message.sender,
    language: message.language,
    created_at: message.created_at
  };
};

export const convertFromStorableMessage = (message: StorableChatMessage): ChatMessage => {
  return {
    id: message.id,
    session_id: message.session_id,
    message: message.message,
    sender: message.sender,
    language: message.language,
    created_at: message.created_at
  };
};

export const generateConversationTitle = (messages: ChatMessage[], language: 'en' | 'ar', providedTitle?: string): string => {
  if (providedTitle && providedTitle.trim()) {
    return providedTitle.trim();
  }

  const firstUserMessage = messages.find(m => m.sender === 'user' && m.message && m.message.trim());
  
  if (firstUserMessage && firstUserMessage.message) {
    const messageText = firstUserMessage.message.trim();
    if (messageText.length > 50) {
      return messageText.substring(0, 50) + '...';
    }
    return messageText;
  }

  return language === 'ar' ? 'محادثة جديدة' : 'New Conversation';
};
