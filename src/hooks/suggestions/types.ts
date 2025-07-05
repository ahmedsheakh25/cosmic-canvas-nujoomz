
export interface AdvancedSuggestion {
  id: string;
  text: string;
  type: 'question' | 'action' | 'clarification' | 'guidance';
  priority: number;
  contextRelevance: number;
  usageCount?: number;
  timestamp?: Date;
}

export interface SuggestionUsage {
  suggestionId: string;
  usedAt: Date;
  context: string;
}
