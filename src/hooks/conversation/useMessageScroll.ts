import { useRef, useEffect } from 'react';
import type { ConversationMessage } from './types';

export const useMessageScroll = (messages: ConversationMessage[]) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return {
    messagesEndRef,
    scrollToBottom
  };
}; 