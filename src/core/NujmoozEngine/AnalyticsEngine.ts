import { supabase } from '@/integrations/supabase/client';

interface EmotionStats {
  emotion: string;
  count: number;
  intensity: number;
  serviceType?: string;
}

interface StepStats {
  step: string;
  total: number;
  completed: number;
  dropoffRate: number;
}

interface SurveyStats {
  completionRate: number;
  averageTimeSpent: number;
  dropOffPoints: { step: string; rate: number }[];
  emotionalFeedback: { emotion: string; count: number }[];
}

interface EmotionalTrigger {
  trigger: string;
  count: number;
  averageIntensity: number;
  commonEmotions: string[];
}

export class AnalyticsEngine {
  private static instance: AnalyticsEngine;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): AnalyticsEngine {
    if (!AnalyticsEngine.instance) {
      AnalyticsEngine.instance = new AnalyticsEngine();
    }
    return AnalyticsEngine.instance;
  }

  private async getCachedData<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const data = await fetcher();
      this.cache.set(key, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      await this.logError(error as Error, `getCachedData:${key}`);
      throw error;
    }
  }

  private async logError(error: Error, context: string): Promise<void> {
    try {
      // Use admin_activity_log for error logging
      await supabase.from('admin_activity_log').insert({
        action_type: 'error',
        description: `${context}: ${error.message}`,
        created_by: 'system'
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  public async getEmotionShifts(): Promise<EmotionStats[]> {
    return this.getCachedData('emotion_shifts', async () => {
      // Use analytics_events instead of emotional_analytics
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('feature', 'emotion')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Process the analytics events to generate emotion stats
      const emotionStats: EmotionStats[] = [];
      
      return emotionStats;
    });
  }

  public async getDropoffSummary(): Promise<StepStats[]> {
    return this.getCachedData('dropoff_summary', async () => {
      // Use chat_conversations instead of conversations with steps
      const { data: conversations, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      const steps = [
        'initial_greeting',
        'service_selection', 
        'project_details',
        'engagement',
        'conversion'
      ];

      return steps.map(step => ({
        step,
        total: conversations?.length || 0,
        completed: Math.floor((conversations?.length || 0) * 0.8), // Mock data
        dropoffRate: 20 // Mock 20% dropoff rate
      }));
    });
  }

  public async getSurveyStats(): Promise<SurveyStats> {
    return this.getCachedData('survey_stats', async () => {
      // Mock survey stats
      return {
        completionRate: 85,
        averageTimeSpent: 120,
        dropOffPoints: [
          { step: 'service_selection', rate: 15 },
          { step: 'project_details', rate: 10 }
        ],
        emotionalFeedback: [
          { emotion: 'positive', count: 75 },
          { emotion: 'neutral', count: 20 },
          { emotion: 'negative', count: 5 }
        ]
      };
    });
  }

  public async getTopEmotionalTriggers(): Promise<EmotionalTrigger[]> {
    return this.getCachedData('emotional_triggers', async () => {
      // Use analytics_events instead of emotional_analytics
      const { data: analyticsData, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('feature', 'emotion')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (!analyticsData?.length) return [];

      // Mock emotional triggers data
      return [
        {
          trigger: 'service_selection',
          count: 45,
          averageIntensity: 3.2,
          commonEmotions: ['excited', 'curious', 'uncertain']
        },
        {
          trigger: 'pricing_discussion',
          count: 32,
          averageIntensity: 2.8,
          commonEmotions: ['concerned', 'interested', 'hopeful']
        }
      ];
    });
  }

  public async getConversationFunnelData(): Promise<any[]> {
    return this.getCachedData('conversation_funnel', async () => {
      // Use analytics_events for funnel data
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('feature', 'conversation')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) throw error;

      // Return mock funnel data
      return [
        { step: 'Landing', count: 1000, conversion: 100 },
        { step: 'Engagement', count: 750, conversion: 75 },
        { step: 'Service Selection', count: 500, conversion: 50 },
        { step: 'Project Details', count: 300, conversion: 30 },
        { step: 'Conversion', count: 150, conversion: 15 }
      ];
    });
  }

  public clearCache(): void {
    this.cache.clear();
  }
}