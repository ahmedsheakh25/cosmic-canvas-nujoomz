import { supabase } from '@/integrations/supabase/client';
import { analyticsClient } from '@/integrations/analytics/client';

interface StepStats {
  step: string;
  total: number;
  completed: number;
  dropoffRate: number;
}

interface EmotionStats {
  emotion: string;
  count: number;
  intensity: number;
  context?: string;
  serviceType?: string;
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

  private async getCachedData<T>(
    key: string,
    fetchFn: () => Promise<T>
  ): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const data = await fetchFn();
      this.cache.set(key, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      await this.logError(error as Error, key);
      throw error;
    }
  }

  private async logError(error: Error, context: string): Promise<void> {
    try {
      await supabase.from('system_logs').insert({
        error_message: error.message,
        error_stack: error.stack,
        context,
        severity: 'error',
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  public async getConversionRate(timeframe: 'day' | 'week' | 'month' = 'week'): Promise<number> {
    return this.getCachedData(`conversion_rate_${timeframe}`, async () => {
      const days = timeframe === 'day' ? 1 : timeframe === 'week' ? 7 : 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .gte('created_at', startDate.toISOString());

      if (error) throw error;

      if (!conversations?.length) return 0;

      const completed = conversations.filter(
        conv => conv.status === 'completed'
      ).length;

      return Math.round((completed / conversations.length) * 100);
    });
  }

  public async getEmotionShifts(): Promise<EmotionStats[]> {
    return this.getCachedData('emotion_shifts', async () => {
      const { data, error } = await supabase
        .from('emotional_analytics')
        .select(`
          *,
          conversations!inner(service_type)
        `)
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      const emotionMap = new Map<string, EmotionStats>();

      data?.forEach(record => {
        const key = record.primary_emotion;
        const current = emotionMap.get(key) || {
          emotion: key,
          count: 0,
          intensity: 0,
          serviceType: record.conversations?.service_type
        };

        current.count++;
        current.intensity += record.intensity || 1;
        emotionMap.set(key, current);
      });

      return Array.from(emotionMap.values()).map(stat => ({
        ...stat,
        intensity: Math.round((stat.intensity / stat.count) * 100) / 100
      }));
    });
  }

  public async getDropoffSummary(): Promise<StepStats[]> {
    return this.getCachedData('dropoff_summary', async () => {
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('steps, status')
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

      return steps.map(step => {
        const total = conversations?.filter(conv => 
          conv.steps?.includes(step)
        ).length || 0;

        const completed = conversations?.filter(conv =>
          conv.steps?.includes(step) && conv.steps?.includes(getNextStep(step))
        ).length || 0;

        return {
          step,
          total,
          completed,
          dropoffRate: total > 0 ? Math.round(((total - completed) / total) * 100) : 0
        };
      });
    });
  }

  public async getSurveyStats(): Promise<SurveyStats> {
    return this.getCachedData('survey_stats', async () => {
      const results = await analyticsClient.getSurveyResults();
      
      if (!results?.length) {
        return {
          completionRate: 0,
          averageTimeSpent: 0,
          dropOffPoints: [],
          emotionalFeedback: []
        };
      }

      const completionRate = calculateCompletionRate(results);
      const averageTimeSpent = calculateAverageTimeSpent(results);
      const dropOffPoints = calculateDropOffPoints(results);
      const emotionalFeedback = aggregateEmotionalFeedback(results);

      return {
        completionRate,
        averageTimeSpent,
        dropOffPoints,
        emotionalFeedback
      };
    });
  }

  public async getTopEmotionalTriggers(): Promise<EmotionalTrigger[]> {
    try {
      // Get emotional analytics data
      const { data: emotionalData, error } = await supabase
        .from('emotional_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      if (!emotionalData?.length) return [];

      // Group by trigger and analyze
      const triggerMap = new Map<string, any[]>();
      emotionalData.forEach(record => {
        const trigger = record.trigger || 'unknown';
        if (!triggerMap.has(trigger)) {
          triggerMap.set(trigger, []);
        }
        triggerMap.get(trigger)!.push(record);
      });

      // Process each trigger
      const triggers: EmotionalTrigger[] = Array.from(triggerMap.entries())
        .map(([trigger, records]) => {
          const emotions = records.map(r => r.primary_emotion);
          const intensities = records.map(r => r.intensity || 1);
          
          return {
            trigger,
            count: records.length,
            averageIntensity: mean(intensities),
            commonEmotions: getTopN(emotions, 3)
          };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return triggers;
    } catch (err) {
      console.error('Error getting emotional triggers:', err);
      return [];
    }
  }

  public async getDropoffPoints(): Promise<StepStats[]> {
    try {
      // Get conversation steps data
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (convError) throw convError;

      // Get survey data for additional insights
      const surveyResults = await analyticsClient.getSurveyResults();

      // Combine and analyze data
      const steps = [
        'initial_greeting',
        'service_selection',
        'project_details',
        'engagement',
        'conversion'
      ];

      const stats: StepStats[] = steps.map(step => {
        const total = conversations?.filter(conv => 
          conv.steps?.includes(step)
        ).length || 0;

        const completed = conversations?.filter(conv =>
          conv.steps?.includes(step) && conv.steps?.includes(getNextStep(step))
        ).length || 0;

        return {
          step,
          total,
          completed,
          dropoffRate: total > 0 ? Math.round(((total - completed) / total) * 100) : 0
        };
      });

      return stats;
    } catch (err) {
      console.error('Error getting dropoff points:', err);
      return [];
    }
  }

  public async getLearningProgress(): Promise<{
    totalInteractions: number;
    uniquePatterns: number;
    successRate: number;
  }> {
    try {
      const { data: learningData, error } = await supabase
        .from('learning_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      if (!learningData?.length) {
        return {
          totalInteractions: 0,
          uniquePatterns: 0,
          successRate: 0
        };
      }

      const patterns = new Set(learningData.map(d => d.pattern_key));
      const successful = learningData.filter(d => d.success).length;

      return {
        totalInteractions: learningData.length,
        uniquePatterns: patterns.size,
        successRate: Math.round((successful / learningData.length) * 100)
      };
    } catch (err) {
      console.error('Error getting learning progress:', err);
      return {
        totalInteractions: 0,
        uniquePatterns: 0,
        successRate: 0
      };
    }
  }

  public async getServiceDistribution(): Promise<{
    service: string;
    count: number;
    conversionRate: number;
  }[]> {
    try {
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      if (!conversations?.length) return [];

      const serviceMap = new Map<string, { total: number; converted: number }>();

      conversations.forEach(conv => {
        const service = conv.service || 'unknown';
        if (!serviceMap.has(service)) {
          serviceMap.set(service, { total: 0, converted: 0 });
        }
        const stats = serviceMap.get(service)!;
        stats.total++;
        if (conv.status === 'completed') {
          stats.converted++;
        }
      });

      return Array.from(serviceMap.entries())
        .map(([service, stats]) => ({
          service,
          count: stats.total,
          conversionRate: Math.round((stats.converted / stats.total) * 100)
        }))
        .sort((a, b) => b.count - a.count);
    } catch (err) {
      console.error('Error getting service distribution:', err);
      return [];
    }
  }
}

// Helper functions
const mean = (arr: number[]): number => {
  return arr.length > 0 ? arr.reduce((a, b) => a + b) / arr.length : 0;
};

const getTopN = (arr: string[], n: number): string[] => {
  const counts = arr.reduce((acc: Record<string, number>, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(counts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, n)
    .map(([val]) => val);
};

const getNextStep = (currentStep: string): string => {
  const steps = [
    'initial_greeting',
    'service_selection',
    'project_details',
    'engagement',
    'conversion'
  ];
  
  const currentIndex = steps.indexOf(currentStep);
  return currentIndex < steps.length - 1 ? steps[currentIndex + 1] : '';
};

const calculateCompletionRate = (results: any[]): number => {
  const completed = results.filter(r => r.status === 'completed').length;
  return Math.round((completed / results.length) * 100);
};

const calculateAverageTimeSpent = (results: any[]): number => {
  const times = results.map(r => r.timeSpent || 0);
  return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
};

const calculateDropOffPoints = (results: any[]): { step: string; rate: number }[] => {
  const steps = ['start', 'personal', 'feedback', 'completion'];
  return steps.map(step => ({
    step,
    rate: results.filter(r => r.lastStep === step).length / results.length * 100
  }));
};

const aggregateEmotionalFeedback = (results: any[]): { emotion: string; count: number }[] => {
  const emotions = results
    .filter(r => r.emotionalResponse)
    .map(r => r.emotionalResponse);
  
  const counts = emotions.reduce((acc: Record<string, number>, emotion: string) => {
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts)
    .map(([emotion, count]) => ({ emotion, count: count as number }))
    .sort((a, b) => b.count - a.count);
}; 