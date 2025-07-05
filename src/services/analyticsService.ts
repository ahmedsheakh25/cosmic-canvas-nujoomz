import { supabase } from '@/integrations/supabase/client';
import { analyticsClient } from '@/integrations/analytics/client';
import { EmotionalState, ServiceContext } from '@/core/NujmoozEngine/types';
import { Message } from '@/components/Nujmooz/ConversationUI/types';

type Action = 
  | 'message_sent'
  | 'message_received'
  | 'emotion_detected'
  | 'service_detected'
  | 'error_occurred'
  | 'voice_recorded'
  | 'question_answered';

type Feature =
  | 'conversation'
  | 'emotion_analysis'
  | 'service_matching'
  | 'error_tracking'
  | 'voice_chat'
  | 'service_questions';

interface AnalyticsEvent {
  action: Action;
  feature: Feature;
  user_id: string;
  metadata: Record<string, any>;
  session_id?: string;
}

interface ConversationAnalytics {
  userId: string;
  messageCount: number;
  averageResponseTime: number;
  emotionalStates: Record<string, number>;
  detectedServices: Record<string, number>;
  voiceUsage: number;
}

export class AnalyticsService {
  private static async logAnalyticsEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // Log to Supabase
      const { error: supabaseError } = await supabase
        .from('analytics_events')
        .insert(event);

      if (supabaseError) throw supabaseError;

      // Log to SurveySparrow if it's an emotion or service event
      if (
        event.feature === 'emotion_analysis' ||
        event.feature === 'service_matching'
      ) {
        await analyticsClient.showSurvey({
          trigger: event.feature === 'emotion_analysis' ? 'emotion' : 'service',
          context: event.metadata
        });
      }

      // Log to analytics events for tracking
      await supabase.from('analytics_events').insert({
        action: 'system_log',
        feature: 'error_tracking',
        user_id: event.user_id,
        metadata: {
          event_type: 'analytics',
          context: event.feature,
          action: event.action,
          session_id: event.session_id
        }
      });
    } catch (error) {
      console.error('Error logging analytics event:', error);
      
      // Log error but don't throw to prevent disrupting user flow
      await supabase.from('analytics_events').insert({
        action: 'system_log',
        feature: 'error_tracking',
        user_id: event.user_id,
        metadata: {
          event_type: 'error',
          context: 'analytics_logging',
          error_message: (error as Error).message,
          error_stack: (error as Error).stack,
          severity: 'error'
        }
      });
    }
  }

  static async trackMessage(message: Message, userId: string, sessionId?: string) {
    await this.logAnalyticsEvent({
      action: message.role === 'user' ? 'message_sent' : 'message_received',
      feature: 'conversation',
      user_id: userId,
      session_id: sessionId,
      metadata: {
        role: message.role,
        isVoice: message.metadata?.isVoice,
        length: message.content.length,
        emotion: message.metadata?.emotion,
        service: message.metadata?.service
      }
    });
  }

  static async trackEmotionalState(
    emotionalState: EmotionalState,
    userId: string,
    sessionId?: string
  ): Promise<void> {
    await this.logAnalyticsEvent({
      action: 'emotion_detected',
      feature: 'emotion_analysis',
      user_id: userId,
      session_id: sessionId,
      metadata: {
        primaryEmotion: emotionalState.primaryEmotion,
        secondaryEmotions: emotionalState.secondaryEmotions,
        intensity: emotionalState.intensity
      }
    });
  }

  static async trackServiceContext(
    serviceContext: ServiceContext,
    userId: string,
    sessionId?: string
  ): Promise<void> {
    await this.logAnalyticsEvent({
      action: 'service_detected',
      feature: 'service_matching',
      user_id: userId,
      session_id: sessionId,
      metadata: {
        detectedServices: serviceContext.detectedServices,
        confidence: serviceContext.confidence
      }
    });
  }

  static async trackError(
    error: Error,
    userId: string,
    context?: Record<string, any>,
    sessionId?: string
  ): Promise<void> {
    await this.logAnalyticsEvent({
      action: 'error_occurred',
      feature: 'error_tracking',
      user_id: userId,
      session_id: sessionId,
      metadata: {
        message: error.message,
        stack: error.stack,
        context
      }
    });
  }

  static async trackVoiceInteraction(
    userId: string,
    duration: number,
    success: boolean,
    sessionId?: string
  ): Promise<void> {
    await this.logAnalyticsEvent({
      action: 'voice_recorded',
      feature: 'voice_chat',
      user_id: userId,
      session_id: sessionId,
      metadata: {
        duration,
        success,
        timestamp: new Date().toISOString()
      }
    });
  }

  static async trackServiceQuestion(
    userId: string,
    question: string,
    answered: boolean,
    sessionId?: string
  ): Promise<void> {
    await this.logAnalyticsEvent({
      action: 'question_answered',
      feature: 'service_questions',
      user_id: userId,
      session_id: sessionId,
      metadata: {
        question,
        answered,
        timestamp: new Date().toISOString()
      }
    });
  }

  static async getConversationAnalytics(userId: string): Promise<ConversationAnalytics> {
    try {
      // Get all events for user
      const { data: events, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Initialize analytics
      const analytics: ConversationAnalytics = {
        userId,
        messageCount: 0,
        averageResponseTime: 0,
        emotionalStates: {},
        detectedServices: {},
        voiceUsage: 0
      };

      let totalResponseTime = 0;
      let responseCount = 0;
      let lastUserMessageTime: Date | null = null;

      events?.forEach((event) => {
        switch (event.action) {
          case 'message_sent':
          case 'message_received':
            analytics.messageCount++;
            
            if ((event.metadata as any)?.isVoice) {
              analytics.voiceUsage++;
            }

            // Calculate response time
            if (event.action === 'message_sent') {
              lastUserMessageTime = new Date(event.created_at);
            } else if (event.action === 'message_received' && lastUserMessageTime) {
              const responseTime = new Date(event.created_at).getTime() - lastUserMessageTime.getTime();
              totalResponseTime += responseTime;
              responseCount++;
              lastUserMessageTime = null;
            }
            break;

          case 'emotion_detected':
            const emotion = (event.metadata as any)?.primaryEmotion?.type;
            if (emotion) {
              analytics.emotionalStates[emotion] = (analytics.emotionalStates[emotion] || 0) + 1;
            }
            break;

          case 'service_detected':
            ((event.metadata as any)?.detectedServices || []).forEach((service: any) => {
              const serviceKey = service.serviceKey;
              analytics.detectedServices[serviceKey] = (analytics.detectedServices[serviceKey] || 0) + 1;
            });
            break;
        }
      });

      // Calculate average response time
      analytics.averageResponseTime = responseCount > 0
        ? totalResponseTime / responseCount
        : 0;

      return analytics;
    } catch (error) {
      console.error('Error getting conversation analytics:', error);
      throw error;
    }
  }
} 