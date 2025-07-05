
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type ChatMessage } from '@/utils/sessionManager';
import { type ConversationMemory } from './useConversationMemory';
import { 
  type MemorySnapshot, 
  type InteractionPattern, 
  type UserEngagementMetrics,
  type PatternAnalysisData,
  type EngagementData
} from '@/types/interactiveMemory';
import { analyzeInteractionPatterns } from '@/utils/patternAnalysis';
import { personalizeResponse } from '@/utils/responsePersonalization';
import { 
  calculateEngagementScore, 
  updateCompletionRate,
  analyzeMemoryEvolution,
  calculatePatternStability,
  analyzeEngagementTrends,
  generateRecommendations
} from '@/utils/analyticsHelpers';

export const useInteractiveMemory = (sessionId: string, currentLanguage: 'en' | 'ar') => {
  const [memorySnapshots, setMemorySnapshots] = useState<MemorySnapshot[]>([]);
  const [interactionPatterns, setInteractionPatterns] = useState<InteractionPattern>({
    responseSpeed: 'moderate',
    messageStyle: 'detailed',
    questionFrequency: 'medium'
  });
  const [engagementMetrics, setEngagementMetrics] = useState<UserEngagementMetrics>({
    totalInteractions: 0,
    averageSessionLength: 0,
    preferredTimeOfDay: 'morning',
    engagementScore: 0.5,
    completionRate: 0
  });
  const [isLearning, setIsLearning] = useState(false);

  const memoryCache = useRef<Map<string, any>>(new Map());
  const patternBuffer = useRef<PatternAnalysisData[]>([]);

  // Enhanced memory snapshotting
  const createMemorySnapshot = useCallback(async (
    memory: ConversationMemory,
    trigger: 'manual' | 'auto' | 'milestone' = 'manual',
    context: string = ''
  ) => {
    const snapshot: MemorySnapshot = {
      id: `snapshot_${Date.now()}`,
      timestamp: Date.now(),
      memory: { ...memory },
      trigger,
      context
    };

    try {
      const { error } = await supabase
        .from('user_interactions')
        .insert({
          user_id: sessionId,
          interaction_type: 'memory_snapshot',
          interaction_data: {
            snapshot: {
              id: snapshot.id,
              timestamp: snapshot.timestamp,
              memory: snapshot.memory,
              trigger: snapshot.trigger,
              context: snapshot.context
            },
            trigger: trigger,
            context: context
          }
        });

      if (!error) {
        setMemorySnapshots(prev => [...prev, snapshot]);
        memoryCache.current.set(snapshot.id, snapshot);
        console.log(`Memory snapshot created: ${snapshot.id} (${trigger})`);
      }
    } catch (error) {
      console.error('Error creating memory snapshot:', error);
    }
  }, [sessionId]);

  // Intelligent pattern analysis
  const analyzePatterns = useCallback((messages: ChatMessage[]) => {
    if (messages.length < 3) return;

    setIsLearning(true);

    try {
      const patterns = analyzeInteractionPatterns(messages);
      setInteractionPatterns(patterns);

      // Cache pattern analysis
      patternBuffer.current.push({
        timestamp: Date.now(),
        data: patterns
      });

      // Keep only last 10 analyses
      if (patternBuffer.current.length > 10) {
        patternBuffer.current = patternBuffer.current.slice(-10);
      }

    } catch (error) {
      console.error('Error analyzing interaction patterns:', error);
    } finally {
      setIsLearning(false);
    }
  }, []);

  // Personalized response generation
  const getPersonalizedResponse = useCallback((
    baseResponse: string,
    memory: ConversationMemory
  ): string => {
    return personalizeResponse(baseResponse, memory, interactionPatterns, currentLanguage);
  }, [interactionPatterns, currentLanguage]);

  // Engagement tracking
  const trackEngagement = useCallback(async (
    interactionType: string,
    engagementData: EngagementData
  ) => {
    try {
      // Update local metrics
      setEngagementMetrics(prev => {
        const newMetrics = {
          ...prev,
          totalInteractions: prev.totalInteractions + 1,
          engagementScore: calculateEngagementScore(engagementData, prev),
          completionRate: updateCompletionRate(engagementData, prev)
        };

        memoryCache.current.set('engagement_metrics', newMetrics);
        return newMetrics;
      });

      // Convert EngagementData to JSON-compatible format for Supabase
      const jsonData = JSON.parse(JSON.stringify(engagementData));

      // Save to database
      await supabase
        .from('user_interactions')
        .insert({
          user_id: sessionId,
          interaction_type: interactionType,
          interaction_data: jsonData
        });

      console.log(`Engagement tracked: ${interactionType}`);
    } catch (error) {
      console.error('Error tracking engagement:', error);
    }
  }, [sessionId]);

  // Memory-based insights
  const getMemoryInsights = useCallback(() => {
    const recentSnapshots = memorySnapshots.slice(-5);
    
    return {
      totalSnapshots: memorySnapshots.length,
      recentActivity: recentSnapshots.length,
      memoryEvolution: analyzeMemoryEvolution(recentSnapshots),
      patternStability: calculatePatternStability(patternBuffer.current),
      engagementTrends: analyzeEngagementTrends(engagementMetrics),
      recommendedActions: generateRecommendations(interactionPatterns, engagementMetrics, currentLanguage)
    };
  }, [memorySnapshots, interactionPatterns, engagementMetrics, currentLanguage]);

  return {
    memorySnapshots,
    interactionPatterns,
    engagementMetrics,
    isLearning,
    createMemorySnapshot,
    analyzeInteractionPatterns: analyzePatterns,
    personalizeResponse: getPersonalizedResponse,
    trackEngagement,
    getMemoryInsights
  };
};
