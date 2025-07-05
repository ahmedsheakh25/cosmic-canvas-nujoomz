
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSentimentAnalysis = (sessionId: string) => {
  const [currentSentiment, setCurrentSentiment] = useState<{
    sentiment: 'positive' | 'neutral' | 'negative';
    score: number;
  }>({ sentiment: 'neutral', score: 0.5 });

  const analyzeSentiment = useCallback(async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-sentiment', {
        body: { text, sessionId }
      });

      if (error) throw error;

      const sentiment = data.sentiment;
      const score = data.score;

      // Update session sentiment
      await supabase
        .from('user_sessions')
        .update({
          user_sentiment: sentiment,
          sentiment_score: score,
          last_sentiment_update: new Date().toISOString()
        })
        .eq('session_id', sessionId);

      setCurrentSentiment({ sentiment, score });
      return { sentiment, score };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return null;
    }
  }, [sessionId]);

  const getSentimentColor = useCallback((sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }, []);

  return {
    currentSentiment,
    analyzeSentiment,
    getSentimentColor
  };
};
