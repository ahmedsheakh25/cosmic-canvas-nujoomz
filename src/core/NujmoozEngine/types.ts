import { ServiceKey } from '@/services_instructions';
import { RenderedQuestion } from '../ServiceQuestionRenderer/types';

export type Language = 'en' | 'ar';

export interface NujmoozEngineConfig {
  defaultLanguage: Language;
  emotionAnalysisEnabled: boolean;
  voiceEnabled: boolean;
  compatibilityMode: boolean;
  supabaseClient: Database;
}

export interface EmotionalState {
  primaryEmotion: {
    type: string;
    confidence: number;
  };
  secondaryEmotions: Array<{
    type: string;
    confidence: number;
  }>;
  metadata: Record<string, unknown>;
}

export interface ServiceContext {
  detectedServices: Array<{
    serviceKey: ServiceKey;
    confidence: number;
    metadata?: Record<string, unknown>;
  }>;
  confidence: number;
  metadata: Record<string, unknown>;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata: {
    emotionalState?: EmotionalState;
    serviceContext?: ServiceContext;
    voiceMetadata?: {
      isVoiceInput: boolean;
      audioUrl?: string;
      transcription?: string;
      confidence?: number;
    };
  };
}

export interface SessionContext {
  userId: string;
  startTime: number;
  schemaVersion: number;
  metadata?: Record<string, unknown>;
  previousAnswers?: Record<string, any>;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface UserInput {
  type: 'text' | 'voice';
  content: string;
  language?: Language;
  metadata?: Record<string, unknown>;
}

export interface NujmoozResponse {
  messageId: string;
  content: string;
  emotionalState: EmotionalState;
  serviceContext: ServiceContext;
  suggestedActions?: Array<{
    type: string;
    label: string;
    payload: unknown;
  }>;
  metadata: Record<string, unknown>;
}

export interface NujmoozConfig {
  defaultLanguage: Language;
  enableVoice: boolean;
  enableEmotions: boolean;
  compatibilityMode?: boolean;
}

export interface ProcessingResult {
  prompt: string;
  emotionalState: EmotionalState | null;
  serviceContext: ServiceContext;
  nextQuestion: RenderedQuestion | null;
  metadata: {
    timestamp: Date;
    processingTime: number;
    language: Language;
    error?: boolean;
  };
} 