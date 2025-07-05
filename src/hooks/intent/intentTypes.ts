
export type UserIntent = 
  | 'project_inquiry'
  | 'service_exploration'
  | 'brief_creation'
  | 'creative_assistance'
  | 'pricing_question'
  | 'timeline_discussion'
  | 'general_chat'
  | 'technical_support'
  | 'portfolio_request';

export type IntentContext = {
  intent: UserIntent;
  confidence: number;
  entities: Record<string, string>;
  previousIntents: UserIntent[];
  conversationPhase: 'discovery' | 'qualification' | 'briefing' | 'completion';
};

export type EnhancedIntentContext = {
  intent: UserIntent;
  confidence: number;
  entities: Record<string, string>;
  previousIntents: UserIntent[];
  conversationPhase: 'discovery' | 'qualification' | 'briefing' | 'completion';
  detectedServices?: string[];
  emotionalState?: 'excited' | 'frustrated' | 'uncertain' | 'satisfied';
  urgencyLevel?: 'low' | 'medium' | 'high' | 'critical';
  conversationQuality?: number;
  userSatisfaction?: number;
  complexityScore?: number;
  topicProgression?: string[];
};
