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
  const [engine] = useState(() => new NujmoozEngine({
    defaultLanguage: options.defaultLanguage || 'ar',
    enableVoice: options.enableVoice ?? true,
    enableEmotions: options.enableEmotions ?? true
  }));

  const processInput = useCallback(async (input: UserInput) => {
    setState(prev => ({ ...prev, isProcessing: true, error: null }));

    try {
      const context: SessionContext = {
        userId: session.userId,
        startTime: Date.now(),
        schemaVersion: 2,
        previousAnswers: session.answers,
        conversationHistory: session.history,
        metadata: session.metadata
      };

      const result = await engine.processInput(input, context);

      // Update session with new data
      updateSession({
        history: [
          ...session.history,
          { role: 'user', content: input.content },
          { role: 'assistant', content: result.prompt }
        ],
        emotionalState: result.emotionalState,
        serviceContext: result.serviceContext,
        metadata: {
          ...session.metadata,
          lastProcessingTime: result.metadata.processingTime,
          language: result.metadata.language
        }
      });

      setState(prev => ({
        ...prev,
        isProcessing: false,
        currentPrompt: result.prompt,
        emotionalState: result.emotionalState,
        serviceContext: result.serviceContext
      }));

      return result;
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