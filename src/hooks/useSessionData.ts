
import { useState, useEffect } from 'react';
import { type ChatMessage } from '@/utils/sessionManager';
import { type ConversationMemory } from './useConversationMemory';
import { useSessionDataLoader } from './useSessionDataLoader';
import { type PerformanceMetrics } from '@/utils/performanceMetrics';

export interface SessionData {
  sessionId: string;
  conversationHistory: ChatMessage[];
  userPreferences: ConversationMemory['userPreferences'];
  projectContext: ConversationMemory['projectContext'];
  performanceMetrics: PerformanceMetrics;
  lastUpdated: string;
}

export const useSessionData = (sessionId: string, currentLanguage: 'en' | 'ar') => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const { isLoading, loadSessionData } = useSessionDataLoader(sessionId, currentLanguage);

  // Initialize data loading
  useEffect(() => {
    if (sessionId) {
      loadSessionData().then(data => {
        if (data) {
          setSessionData(data);
        }
      });
    }
  }, [sessionId, loadSessionData]);

  return {
    sessionData,
    isLoading,
    loadSessionData,
    setSessionData
  };
};
