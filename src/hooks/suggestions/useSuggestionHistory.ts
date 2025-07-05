
import { useState, useCallback } from 'react';
import { type AdvancedSuggestion, type SuggestionUsage } from './types';

export const useSuggestionHistory = () => {
  const [suggestionHistory, setSuggestionHistory] = useState<AdvancedSuggestion[]>([]);
  const [usageHistory, setUsageHistory] = useState<SuggestionUsage[]>([]);

  const recordAdvancedSuggestionUsage = useCallback((suggestion: AdvancedSuggestion) => {
    const usage: SuggestionUsage = {
      suggestionId: suggestion.id,
      usedAt: new Date(),
      context: suggestion.type
    };

    setUsageHistory(prev => [...prev, usage].slice(-100)); // Keep last 100 usages

    // Update the suggestion's usage count
    setSuggestionHistory(prev => 
      prev.map(s => 
        s.id === suggestion.id 
          ? { ...s, usageCount: (s.usageCount || 0) + 1 }
          : s
      )
    );
  }, []);

  const updateSuggestionHistory = useCallback((suggestions: AdvancedSuggestion[]) => {
    setSuggestionHistory(prev => [...prev, ...suggestions].slice(-50)); // Keep last 50 suggestions
  }, []);

  return {
    suggestionHistory,
    usageHistory,
    recordAdvancedSuggestionUsage,
    updateSuggestionHistory
  };
};
