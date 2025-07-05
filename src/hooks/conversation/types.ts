import { RefObject } from 'react';

export interface ConversationMessage {
  id: string;
  sender: 'user' | 'nujmooz';
  content: string;
  timestamp: Date;
  generatedFiles?: string[];
}

export interface ConversationState {
  // State
  messages: ConversationMessage[];
  inputMessage: string;
  isLoading: boolean;
  currentLanguage: 'en' | 'ar';
  messagesEndRef: RefObject<HTMLDivElement>;
  
  // Actions
  setMessages: (messages: ConversationMessage[]) => void;
  setInputMessage: (message: string) => void;
  setIsLoading: (loading: boolean) => void;
  setCurrentLanguage: (language: 'en' | 'ar') => void;
  addMessage: (message: ConversationMessage) => void;
  updateLastMessage: (content: string) => void;
  clearInput: () => void;
  detectLanguage: (text: string) => 'ar' | 'en';
  scrollToBottom: () => void;
} 