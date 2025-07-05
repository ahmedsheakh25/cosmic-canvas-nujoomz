
import { useState, useCallback } from 'react';
import { type ChatMessage } from '@/utils/sessionManager';
import { type UserIntent, type IntentContext } from './intent/intentTypes';
import { analyzeIntent } from './intent/intentAnalyzer';
import { getIntentBasedSuggestions } from './intent/intentSuggestions';

export { type UserIntent, type IntentContext } from './intent/intentTypes';

export const useIntentAnalysis = (currentLanguage: 'en' | 'ar') => {
  const [intentHistory, setIntentHistory] = useState<IntentContext[]>([]);

  const analyzeIntentCallback = useCallback((message: string, conversationHistory: ChatMessage[]): IntentContext => {
    const context = analyzeIntent(message, conversationHistory, currentLanguage, intentHistory);
    setIntentHistory(prev => [...prev.slice(-9), context]);
    return context;
  }, [currentLanguage, intentHistory]);

  const getIntentBasedSuggestionsCallback = useCallback((context: IntentContext): string[] => {
    return getIntentBasedSuggestions(context, currentLanguage);
  }, [currentLanguage]);

  return {
    analyzeIntent: analyzeIntentCallback,
    getIntentBasedSuggestions: getIntentBasedSuggestionsCallback,
    intentHistory,
    currentLanguage
  };
};
