
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type ChatMessage } from '@/utils/sessionManager';
import { extractUserPreferences, extractProjectContext } from '@/utils/sessionDataExtractors';
import { calculatePerformanceMetrics } from '@/utils/performanceMetrics';
import { type SessionData } from './useSessionData';

export const useSessionDataLoader = (sessionId: string, currentLanguage: 'en' | 'ar') => {
  const [isLoading, setIsLoading] = useState(false);

  const loadSessionData = useCallback(async (forceReload = false): Promise<SessionData | null> => {
    if (!sessionId) return null;
    
    setIsLoading(true);
    
    try {
      // Load session info
      const { data: sessionInfo } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .single();
      
      // Load conversation history
      const { data: messages } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });
      
      // Load user interactions for metrics
      const { data: interactions } = await supabase
        .from('user_interactions')
        .select('*')
        .eq('user_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(50);
      
      // Convert database messages to ChatMessage format
      const convertedMessages: ChatMessage[] = (messages || []).map(msg => ({
        id: msg.id,
        session_id: msg.session_id,
        message: msg.message,
        sender: msg.sender as 'user' | 'nujmooz',
        language: msg.language,
        created_at: msg.created_at
      }));
      
      // Calculate performance metrics
      const performanceMetrics = calculatePerformanceMetrics(convertedMessages, interactions || [], currentLanguage);
      
      const enhancedSessionData: SessionData = {
        sessionId,
        conversationHistory: convertedMessages,
        userPreferences: extractUserPreferences(convertedMessages, currentLanguage),
        projectContext: extractProjectContext(convertedMessages, currentLanguage),
        performanceMetrics,
        lastUpdated: new Date().toISOString()
      };
      
      return enhancedSessionData;
      
    } catch (error) {
      console.error('Error loading session data:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, currentLanguage]);

  return {
    isLoading,
    loadSessionData
  };
};
