
import { useState, useCallback } from 'react';
import { type EnhancedIntentContext } from './intent/intentTypes';
import { type ConversationMemoryHook } from '@/types/conversationMemory';
import { type ChatMessage } from '@/utils/sessionManager';
import { type AdvancedSuggestion } from './suggestions/types';
import { generateIntentBasedSuggestions } from './suggestions/intentBasedSuggestions';
import { generateEmotionalSuggestions } from './suggestions/emotionalSuggestions';
import { generateTopicSuggestions } from './suggestions/topicSuggestions';
import { generateUrgencySuggestions } from './suggestions/urgencySuggestions';
import { useSuggestionHistory } from './suggestions/useSuggestionHistory';

export const useAdvancedSmartSuggestions = (currentLanguage: 'en' | 'ar') => {
  const [activeSuggestions, setActiveSuggestions] = useState<AdvancedSuggestion[]>([]);
  
  const {
    suggestionHistory,
    usageHistory,
    recordAdvancedSuggestionUsage,
    updateSuggestionHistory
  } = useSuggestionHistory();

  const generateAdvancedSuggestions = useCallback((
    context: EnhancedIntentContext,
    memory: ConversationMemoryHook['memory'],
    messages: ChatMessage[]
  ): AdvancedSuggestion[] => {
    const suggestions: AdvancedSuggestion[] = [];
    
    // Intent-based suggestions
    const intentSuggestions = generateIntentBasedSuggestions(context, currentLanguage);
    suggestions.push(...intentSuggestions);

    // Emotional state suggestions
    if (context.emotionalState) {
      const emotionalSuggestions = generateEmotionalSuggestions(context.emotionalState, currentLanguage);
      suggestions.push(...emotionalSuggestions);
    }

    // Topic progression suggestions
    if (context.topicProgression && context.topicProgression.length > 0) {
      const topicSuggestions = generateTopicSuggestions(context.topicProgression, currentLanguage);
      suggestions.push(...topicSuggestions);
    }

    // Urgency-based suggestions
    if (context.urgencyLevel && context.urgencyLevel !== 'low') {
      const urgencySuggestions = generateUrgencySuggestions(context.urgencyLevel, currentLanguage);
      suggestions.push(...urgencySuggestions);
    }

    // Sort by priority and relevance
    const finalSuggestions = suggestions
      .sort((a, b) => (b.priority + b.contextRelevance) - (a.priority + a.contextRelevance))
      .slice(0, 6);

    // Update suggestion history
    updateSuggestionHistory(finalSuggestions);

    return finalSuggestions;
  }, [currentLanguage, updateSuggestionHistory]);

  return {
    generateAdvancedSuggestions,
    activeSuggestions,
    setActiveSuggestions,
    suggestionHistory,
    recordAdvancedSuggestionUsage,
    usageHistory
  };
};
