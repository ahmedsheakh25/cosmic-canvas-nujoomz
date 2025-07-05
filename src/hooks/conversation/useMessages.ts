import { useState, useEffect } from 'react';
import type { ConversationMessage } from './types';
import { getWelcomeMessage } from './languageUtils';

export const useMessages = (initialLanguage: 'ar' | 'en' = 'ar') => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ConversationMessage = {
      id: 'welcome-1',
      sender: 'nujmooz',
      content: getWelcomeMessage(initialLanguage),
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [initialLanguage]);

  const addMessage = (message: ConversationMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const updateLastMessage = (content: string) => {
    setMessages(prev => 
      prev.map((msg, index) => 
        index === prev.length - 1 ? { ...msg, content } : msg
      )
    );
  };

  return {
    messages,
    setMessages,
    addMessage,
    updateLastMessage
  };
}; 