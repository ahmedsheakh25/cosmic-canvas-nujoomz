
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSessionData, type SessionData } from './useSessionData';

export const useDataManager = (sessionId: string, currentLanguage: 'en' | 'ar') => {
  const { sessionData, isLoading, loadSessionData, setSessionData } = useSessionData(sessionId, currentLanguage);

  // Simplified data persistence
  const saveSessionData = useCallback(async (
    updates: Partial<SessionData>,
    options: { immediate?: boolean; merge?: boolean } = {}
  ) => {
    if (!sessionId) return false;
    
    const { immediate = true, merge = true } = options;
    
    try {
      let updatedData = updates;
      
      if (merge && sessionData) {
        updatedData = {
          ...sessionData,
          ...updates,
          userPreferences: {
            ...sessionData.userPreferences,
            ...(updates.userPreferences || {})
          },
          projectContext: {
            ...sessionData.projectContext,
            ...(updates.projectContext || {})
          },
          lastUpdated: new Date().toISOString()
        };
      }
      
      if (immediate) {
        const { error } = await supabase
          .from('user_sessions')
          .upsert({
            session_id: sessionId,
            language_preference: currentLanguage,
            updated_at: new Date().toISOString()
          }, { onConflict: 'session_id' });
        
        if (error) throw error;
        setSessionData(updatedData as SessionData);
      }
      
      return true;
      
    } catch (error) {
      console.error('Error saving session data:', error);
      return false;
    }
  }, [sessionId, sessionData, currentLanguage, setSessionData]);

  return {
    sessionData,
    isLoading,
    loadSessionData,
    saveSessionData
  };
};

export type { SessionData } from './useSessionData';
