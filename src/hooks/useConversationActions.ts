
import { useState } from 'react';
import { useConversationPersistence } from './useConversationPersistence';
import { useNotificationSystem } from './useNotificationSystem';
import { type ChatMessage } from '@/utils/sessionManager';

export const useConversationActions = (
  sessionId: string,
  currentLanguage: 'en' | 'ar'
) => {
  const [error, setError] = useState<string | null>(null);
  const persistence = useConversationPersistence(sessionId, currentLanguage);
  const notifications = useNotificationSystem(currentLanguage);

  const saveConversation = async (messages: ChatMessage[], title?: string): Promise<string | null> => {
    try {
      setError(null);
      
      if (!messages || messages.length === 0) {
        const errorMsg = currentLanguage === 'ar' ? 'لا توجد رسائل للحفظ' : 'No messages to save';
        setError(errorMsg);
        notifications.notifyError(errorMsg);
        return null;
      }

      if (!sessionId) {
        const errorMsg = currentLanguage === 'ar' ? 'معرف الجلسة غير صحيح' : 'Invalid session ID';
        setError(errorMsg);
        notifications.notifyError(errorMsg);
        return null;
      }

      console.log('Attempting to save conversation:', {
        sessionId,
        messageCount: messages.length,
        title
      });

      const conversationId = await persistence.saveConversation(messages, title);
      
      if (conversationId) {
        notifications.notifyConversationSaved();
        setError(null);
        await persistence.loadSavedConversations();
        console.log('Conversation saved successfully with ID:', conversationId);
        return conversationId;
      } else {
        const errorMsg = currentLanguage === 'ar' ? 'فشل في حفظ المحادثة' : 'Failed to save conversation';
        setError(errorMsg);
        notifications.notifyError(errorMsg);
        return null;
      }
    } catch (error) {
      console.error('Error in saveConversation:', error);
      const errorMsg = currentLanguage === 'ar' ? 'خطأ في حفظ المحادثة' : 'Error saving conversation';
      setError(errorMsg);
      notifications.notifyError(errorMsg);
      return null;
    }
  };

  const loadConversation = async (conversationId: string): Promise<ChatMessage[] | null> => {
    try {
      setError(null);
      console.log('Loading conversation:', conversationId);
      
      const loadedMessages = await persistence.loadConversation(conversationId);
      if (loadedMessages && loadedMessages.length > 0) {
        notifications.notifyConversationLoaded();
        console.log('Conversation loaded successfully:', loadedMessages.length, 'messages');
        return loadedMessages;
      } else {
        const errorMsg = currentLanguage === 'ar' ? 'فشل في تحميل المحادثة' : 'Failed to load conversation';
        setError(errorMsg);
        notifications.notifyError(errorMsg);
        return null;
      }
    } catch (error) {
      console.error('Error in loadConversation:', error);
      const errorMsg = currentLanguage === 'ar' ? 'خطأ في تحميل المحادثة' : 'Error loading conversation';
      setError(errorMsg);
      notifications.notifyError(errorMsg);
      return null;
    }
  };

  const deleteConversation = async (conversationId: string): Promise<boolean> => {
    try {
      setError(null);
      const success = await persistence.deleteConversation(conversationId);
      if (success) {
        notifications.showSuccess(
          currentLanguage === 'ar' ? 'تم حذف المحادثة' : 'Conversation Deleted',
          currentLanguage === 'ar' ? 'تم حذف المحادثة بنجاح' : 'Conversation deleted successfully'
        );
        return true;
      } else {
        const errorMsg = currentLanguage === 'ar' ? 'فشل في حذف المحادثة' : 'Failed to delete conversation';
        setError(errorMsg);
        notifications.notifyError(errorMsg);
        return false;
      }
    } catch (error) {
      console.error('Error in deleteConversation:', error);
      const errorMsg = currentLanguage === 'ar' ? 'خطأ في حذف المحادثة' : 'Error deleting conversation';
      setError(errorMsg);
      notifications.notifyError(errorMsg);
      return false;
    }
  };

  const updateConversationTitle = async (conversationId: string, newTitle: string): Promise<boolean> => {
    try {
      setError(null);
      if (!newTitle.trim()) {
        const errorMsg = currentLanguage === 'ar' ? 'العنوان مطلوب' : 'Title is required';
        setError(errorMsg);
        return false;
      }

      const success = await persistence.updateConversationTitle(conversationId, newTitle);
      if (success) {
        notifications.showSuccess(
          currentLanguage === 'ar' ? 'تم تحديث العنوان' : 'Title Updated'
        );
        return true;
      } else {
        const errorMsg = currentLanguage === 'ar' ? 'فشل في تحديث العنوان' : 'Failed to update title';
        setError(errorMsg);
        notifications.notifyError(errorMsg);
        return false;
      }
    } catch (error) {
      console.error('Error in updateConversationTitle:', error);
      const errorMsg = currentLanguage === 'ar' ? 'خطأ في تحديث العنوان' : 'Error updating title';
      setError(errorMsg);
      notifications.notifyError(errorMsg);
      return false;
    }
  };

  return {
    error,
    setError,
    isLoading: persistence.isLoading,
    saveConversation,
    loadConversation,
    deleteConversation,
    updateConversationTitle,
    savedConversations: persistence.savedConversations,
    loadSavedConversations: persistence.loadSavedConversations
  };
};
