
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type ChatMessage } from '@/utils/sessionManager';
import { type StorableConversationData, type SavedConversation } from '@/types/conversation';
import { convertToStorableMessage, convertFromStorableMessage, generateConversationTitle } from '@/utils/conversationConverters';

export const useConversationStorage = (sessionId: string, currentLanguage: 'en' | 'ar') => {
  const saveConversation = useCallback(async (
    messages: ChatMessage[], 
    title?: string
  ): Promise<string | null> => {
    if (!sessionId || !messages || messages.length === 0) {
      return null;
    }

    try {
      const conversationTitle = generateConversationTitle(messages, currentLanguage, title);
      const storableMessages = messages.map(convertToStorableMessage);

      const conversationData: StorableConversationData = {
        title: conversationTitle,
        messages: storableMessages,
        language: currentLanguage,
        session_id: sessionId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('conversations')
        .insert([{
          user_id: sessionId,
          chat_data: conversationData as any
        }])
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error saving conversation:', error);
      return null;
    }
  }, [sessionId, currentLanguage]);

  const loadConversation = useCallback(async (conversationId: string): Promise<ChatMessage[] | null> => {
    if (!conversationId) return null;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (error) throw error;

      const chatData = data.chat_data as any;
      const messages = chatData.messages.map(convertFromStorableMessage);
      return messages;
    } catch (error) {
      console.error('Error loading conversation:', error);
      return null;
    }
  }, []);

  const deleteConversation = useCallback(async (conversationId: string): Promise<boolean> => {
    if (!conversationId) return false;

    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      return false;
    }
  }, []);

  const updateConversationTitle = useCallback(async (
    conversationId: string, 
    newTitle: string
  ): Promise<boolean> => {
    if (!conversationId || !newTitle?.trim()) return false;

    try {
      const { data: currentData, error: fetchError } = await supabase
        .from('conversations')
        .select('chat_data')
        .eq('id', conversationId)
        .single();

      if (fetchError) throw fetchError;

      const chatData = currentData.chat_data as any;
      const updatedChatData: StorableConversationData = {
        ...chatData,
        title: newTitle.trim(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('conversations')
        .update({ 
          chat_data: updatedChatData as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating conversation title:', error);
      return false;
    }
  }, []);

  return {
    saveConversation,
    loadConversation,
    deleteConversation,
    updateConversationTitle
  };
};
