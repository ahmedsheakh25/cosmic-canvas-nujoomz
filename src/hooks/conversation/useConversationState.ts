import { useState } from 'react';
import type { ConversationState } from './types';
import { useMessages } from './useMessages';
import { useMessageScroll } from './useMessageScroll';
import { detectLanguage } from './languageUtils';

export const useConversationState = (): ConversationState => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('ar');

  const {
    messages,
    setMessages,
    addMessage,
    updateLastMessage
  } = useMessages(currentLanguage);

  const {
    messagesEndRef,
    scrollToBottom
  } = useMessageScroll(messages);

  const clearInput = () => {
    setInputMessage('');
  };

  return {
    // State
    messages,
    inputMessage,
    isLoading,
    currentLanguage,
    messagesEndRef,
    
    // Actions
    setMessages,
    setInputMessage,
    setIsLoading,
    setCurrentLanguage,
    addMessage,
    updateLastMessage,
    clearInput,
    detectLanguage,
    scrollToBottom
  };
}; 