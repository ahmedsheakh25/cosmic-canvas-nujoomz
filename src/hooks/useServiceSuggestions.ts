
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ServiceSuggestion {
  id: string;
  service_type: string;
  suggestion_reason: string;
  confidence_score: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export const useServiceSuggestions = (sessionId: string) => {
  const [suggestions, setSuggestions] = useState<ServiceSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateServiceSuggestions = useCallback(async (conversationHistory: any[]) => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('suggest-services', {
        body: { 
          sessionId, 
          conversationHistory,
          userContext: conversationHistory.slice(-10) // Last 10 messages for context
        }
      });

      if (error) throw error;

      const newSuggestions = data.suggestions;
      setSuggestions(newSuggestions);
      
      return newSuggestions;
    } catch (error) {
      console.error('Error generating service suggestions:', error);
      return [];
    } finally {
      setIsGenerating(false);
    }
  }, [sessionId]);

  const acceptSuggestion = useCallback(async (suggestionId: string) => {
    try {
      const { error } = await supabase
        .from('suggested_services')
        .update({ status: 'accepted' })
        .eq('id', suggestionId);

      if (error) throw error;

      setSuggestions(prev => prev.map(s => 
        s.id === suggestionId ? { ...s, status: 'accepted' } : s
      ));
    } catch (error) {
      console.error('Error accepting suggestion:', error);
    }
  }, []);

  const rejectSuggestion = useCallback(async (suggestionId: string) => {
    try {
      const { error } = await supabase
        .from('suggested_services')
        .update({ status: 'rejected' })
        .eq('id', suggestionId);

      if (error) throw error;

      setSuggestions(prev => prev.map(s => 
        s.id === suggestionId ? { ...s, status: 'rejected' } : s
      ));
    } catch (error) {
      console.error('Error rejecting suggestion:', error);
    }
  }, []);

  return {
    suggestions,
    isGenerating,
    generateServiceSuggestions,
    acceptSuggestion,
    rejectSuggestion
  };
};
