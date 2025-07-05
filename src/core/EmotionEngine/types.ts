export interface EmotionConfig {
  minConfidence: number;
  enableSecondaryEmotions: boolean;
  contextTracking: boolean;
}

export type EmotionIntensity = 'low' | 'medium' | 'high';

export interface EmotionSignal {
  type: string;
  intensity: EmotionIntensity;
  confidence: number;
  context?: Record<string, unknown>;
}

export interface EmotionPattern {
  signals: EmotionSignal[];
  timestamp: Date;
  context: Record<string, unknown>;
}

export interface EmotionHistory {
  patterns: EmotionPattern[];
  dominantEmotion?: string;
  emotionalTrend?: string;
}

export interface EmotionAnalysis {
  primaryEmotion: {
    type: string;
    intensity: EmotionIntensity;
    confidence: number;
  };
  secondaryEmotions: Array<{
    type: string;
    intensity: EmotionIntensity;
    confidence: number;
  }>;
  context: {
    previousEmotions?: EmotionHistory;
    situationalFactors?: Record<string, unknown>;
    culturalContext?: Record<string, unknown>;
  };
  timestamp: Date;
} 