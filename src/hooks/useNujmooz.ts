import { useState, useCallback, useEffect } from 'react';
import { NujmoozEngine } from '@/core/NujmoozEngine';
import type { 
  UserInput, 
  SessionContext, 
  ProcessingResult, 
  EmotionalState,
  ServiceContext,
  Language
} from '@/core/NujmoozEngine/types';
import { useSession } from './useSession';

interface UseNujmoozOptions {
  defaultLanguage?: Language;
  enableVoice?: boolean;
  enableEmotions?: boolean;
}

interface NujmoozState {
  isProcessing: boolean;
  currentPrompt: string | null;
  emotionalState: EmotionalState | null;
  serviceContext: ServiceContext | null;
  error: Error | null;
}

export function useNujmooz(options: UseNujmoozOptions = {}) {
  const [state, setState] = useState<NujmoozState>({
    isProcessing: false,
    currentPrompt: null,
    emotionalState: null,
    serviceContext: null,
    error: null
  });

  const { session, updateSession } = useSession();
  const [engine] = useState(() => new NujmoozEngine());

  const processInput = useCallback(async (input: UserInput) => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      const context: SessionContext = {
        userId: session.userId,
        sessionId: session.userId,
        language: input.language || 'ar',
        startTime: Date.now(),
        schemaVersion: 2,
        previousAnswers: session.answers,
        conversationHistory: session.history,
        metadata: session.metadata
      };

      const prompt = await engine.processInput(input.content);

      // Update session with new data
      updateSession({
        history: [
          ...session.history,
          { role: 'user', content: input.content },
          { role: 'assistant', content: prompt }
        ],
        metadata: {
          ...session.metadata,
          language: input.language || 'ar'
        }
      });

      setState(prev => ({
        ...prev,
        isProcessing: false,
        currentPrompt: prompt,
        emotionalState: null,
        serviceContext: null
      }));

      return {
        prompt,
        emotionalState: null,
        serviceContext: { detectedServices: [], confidence: 0, metadata: {} },
        nextQuestion: null,
        metadata: {
          timestamp: new Date(),
          processingTime: Date.now() - context.startTime,
          language: input.language || 'ar'
        }
      };
    } catch (error) {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: error as Error
      }));
      throw error;
    }
  }, [engine, session, updateSession]);

  const resetState = useCallback(() => {
    setState({
      isProcessing: false,
      currentPrompt: null,
      emotionalState: null,
      serviceContext: null,
      error: null
    });
  }, []);

  useEffect(() => {
    // Initialize with session data if available
    if (session.emotionalState || session.serviceContext) {
      setState(prev => ({
        ...prev,
        emotionalState: session.emotionalState,
        serviceContext: session.serviceContext
      }));
    }
  }, [session]);

  return {
    ...state,
    processInput,
    resetState
  };
} 