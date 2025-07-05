import { ServiceKey } from '@/services_instructions';
import { EmotionalState } from '../EmotionEngine/types';
import { ServiceMatch } from '../IntentEngine/types';
import { Language } from '../NujmoozEngine/types';

export interface PromptConfig {
  maxTokens: number;
  temperature: number;
  enableMemory: boolean;
  defaultLanguage: Language;
}

export interface PromptContext {
  serviceMatches: ServiceMatch[];
  emotionalState: EmotionalState;
  language: Language;
  userPreferences?: Record<string, unknown>;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface ServicePrompt {
  serviceKey: ServiceKey;
  basePrompt: Record<Language, string>;
  tone: string;
  contextualRules?: Array<{
    condition: Record<string, unknown>;
    promptAdjustment: string;
  }>;
}

export interface PromptTemplate {
  id: string;
  type: 'service' | 'emotion' | 'general';
  content: Record<Language, string>;
  variables: string[];
  tone?: string;
  context?: Record<string, unknown>;
}

export interface GeneratedPrompt {
  content: string;
  context: {
    service?: ServiceKey;
    tone: string;
    emotion?: string;
    language: Language;
  };
  metadata: Record<string, unknown>;
} 