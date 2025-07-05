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
  const [session, setSession] = useState<Session>({
    userId: crypto.randomUUID(),
    history: [],
    answers: {},
    emotionalState: null,
    serviceContext: null,
    metadata: {}
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
    setSession({
      userId: crypto.randomUUID(),
      history: [],
      answers: {},
      emotionalState: null,
      serviceContext: null,
      metadata: {}
    });
  }, []);

  return {
    session,
    updateSession,
    resetSession
  };
}
