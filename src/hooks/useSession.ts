import { useState, useCallback } from 'react';
import { EmotionalState, ServiceContext } from '@/core/NujmoozEngine/types';

interface Session {
  userId: string;
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  answers: Record<string, any>;
  emotionalState: EmotionalState | null;
  serviceContext: ServiceContext | null;
  metadata: Record<string, unknown>;
}

interface SessionUpdate {
  history?: Session['history'];
  answers?: Session['answers'];
  emotionalState?: Session['emotionalState'];
  serviceContext?: Session['serviceContext'];
  metadata?: Session['metadata'];
}

export function useSession() {
  const [session, setSession] = useState<Session>(() => {
    // Try to get existing session ID from localStorage
    const storedSessionId = localStorage.getItem('nujmooz_session_id');
    const sessionId = storedSessionId && isValidUUID(storedSessionId) 
      ? storedSessionId 
      : crypto.randomUUID();
    
    // Store the session ID for persistence
    localStorage.setItem('nujmooz_session_id', sessionId);
    
    return {
      userId: sessionId,
      history: [],
      answers: {},
      emotionalState: null,
      serviceContext: null,
      metadata: {}
    };
  });

  const updateSession = useCallback((update: SessionUpdate) => {
    setSession(prev => ({
      ...prev,
      ...update,
      metadata: {
        ...prev.metadata,
        ...update.metadata
      }
    }));
  }, []);

  const resetSession = useCallback(() => {
    const newSessionId = crypto.randomUUID();
    localStorage.setItem('nujmooz_session_id', newSessionId);
    
    setSession({
      userId: newSessionId,
      history: [],
      answers: {},
      emotionalState: null,
      serviceContext: null,
      metadata: {}
    });
  }, []);

  return {
    session,
    sessionId: session.userId, // Backward compatibility
    updateSession,
    resetSession
  };
}

// Helper function to validate UUID format
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};
