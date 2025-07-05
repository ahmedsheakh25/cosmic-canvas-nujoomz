
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type SavedConversation } from '@/types/conversation';

export const useConversationList = (sessionId: string) => {
  const [savedConversations, setSavedConversations] = useState<SavedConversation[]>([]);

  const loadSavedConversations = useCallback(async (): Promise<SavedConversation[]> => {
    if (!sessionId) return [];

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const conversations: SavedConversation[] = (data || []).map(row => {
        const chatData = row.chat_data as any;
        
        return {
          id: row.id,
          title: chatData.title,
          messages: chatData.messages,
          createdAt: new Date(chatData.created_at),
          updatedAt: new Date(chatData.updated_at),
          language: chatData.language,
          sessionId: chatData.session_id
        };
      });

      setSavedConversations(conversations);
      return conversations;
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    }
  }, [sessionId]);

  const removeConversationFromList = useCallback((conversationId: string) => {
    setSavedConversations(prev => prev.filter(c => c.id !== conversationId));
  }, []);

  const updateConversationInList = useCallback((conversationId: string, newTitle: string) => {
    setSavedConversations(prev => 
      prev.map(c => c.id === conversationId ? { ...c, title: newTitle.trim() } : c)
    );
  }, []);

  return {
    savedConversations,
    loadSavedConversations,
    removeConversationFromList,
    updateConversationInList
  };
};
