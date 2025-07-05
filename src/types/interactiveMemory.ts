
export interface MemorySnapshot {
  id: string;
  timestamp: number;
  memory: any; // Will be properly typed when ConversationMemory is imported
  trigger: 'manual' | 'auto' | 'milestone';
  context: string;
}

export interface InteractionPattern {
  responseSpeed: 'fast' | 'moderate' | 'slow';
  messageStyle: 'detailed' | 'concise' | 'mixed';
  questionFrequency: 'high' | 'medium' | 'low';
}

export interface UserEngagementMetrics {
  totalInteractions: number;
  averageSessionLength: number;
  preferredTimeOfDay: string;
  engagementScore: number;
  completionRate: number;
}

export interface PatternAnalysisData {
  timestamp: number;
  data: InteractionPattern;
}

export interface EngagementData {
  messageLength?: number;
  hasQuestions?: boolean;
  responseTime?: number;
  interactionType?: string;
  completedAction?: boolean;
  satisfaction?: number;
}
