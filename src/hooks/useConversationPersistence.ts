
import { useState } from 'react';
import { useConversationStorage } from './useConversationStorage';
import { useConversationList } from './useConversationList';
import { type ChatMessage } from '@/utils/sessionManager';

export const useConversationPersistence = (sessionId: string, currentLanguage: 'en' | 'ar') => {
  const [isLoading, setIsLoading] = useState(false);
  
  const storage = useConversationStorage(sessionId, currentLanguage);
  const list = useConversationList(sessionId);

  const saveConversation = async (messages: ChatMessage[], title?: string): Promise<string | null> => {
    setIsLoading(true);
    try {
      const result = await storage.saveConversation(messages, title);
      if (result) {
        await list.loadSavedConversations();
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversation = async (conversationId: string): Promise<ChatMessage[] | null> => {
    setIsLoading(true);
    try {
      return await storage.loadConversation(conversationId);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (conversationId: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await storage.deleteConversation(conversationId);
      if (success) {
        list.removeConversationFromList(conversationId);
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  const updateConversationTitle = async (conversationId: string, newTitle: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await storage.updateConversationTitle(conversationId, newTitle);
      if (success) {
        list.updateConversationInList(conversationId, newTitle);
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    savedConversations: list.savedConversations,
    isLoading,
    saveConversation,
    loadSavedConversations: list.loadSavedConversations,
    loadConversation,
    deleteConversation,
    updateConversationTitle
  };
};

export type { SavedConversation } from '@/types/conversation';
