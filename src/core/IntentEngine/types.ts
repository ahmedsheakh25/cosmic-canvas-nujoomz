import { ServiceKey } from '@/services_instructions';

export interface IntentConfig {
  minServiceMatchConfidence: number;
  maxServicesToReturn: number;
  enableContextualMatching: boolean;
}

export interface ServiceMatch {
  serviceKey: ServiceKey;
  confidence: number;
  matchedTags: string[];
  contextualScore: number;
}

export interface BuyingSignal {
  type: 'direct' | 'indirect';
  intensity: 'low' | 'medium' | 'high';
  confidence: number;
  context?: Record<string, unknown>;
}

export interface IntentAnalysis {
  matchedServices: ServiceMatch[];
  buyingIntent: {
    score: number; // 0-1
    signals: BuyingSignal[];
    confidence: number;
  };
  userGoals: string[];
  context: {
    previousServices?: ServiceKey[];
    userPreferences?: Record<string, unknown>;
    sessionContext?: Record<string, unknown>;
  };
  timestamp: Date;
} 