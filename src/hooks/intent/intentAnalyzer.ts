
import { type ChatMessage } from '@/utils/sessionManager';
import { type UserIntent, type IntentContext } from './intentTypes';
import { intentPatterns } from './intentPatterns';
import { extractEntities } from './entityExtraction';
import { determineConversationPhase, analyzeConversationContext } from './conversationPhaseAnalysis';

export const analyzeIntent = (
  message: string, 
  conversationHistory: ChatMessage[],
  currentLanguage: 'en' | 'ar',
  intentHistory: IntentContext[]
): IntentContext => {
  const lowerMessage = message.toLowerCase();
  const patterns = intentPatterns[currentLanguage];
  
  // Calculate intent scores
  const intentScores: Record<UserIntent, number> = {
    project_inquiry: 0,
    service_exploration: 0,
    brief_creation: 0,
    creative_assistance: 0,
    pricing_question: 0,
    timeline_discussion: 0,
    general_chat: 0,
    technical_support: 0,
    portfolio_request: 0
  };

  // Pattern matching
  Object.entries(patterns).forEach(([intent, keywords]) => {
    const matches = keywords.filter(keyword => lowerMessage.includes(keyword.toLowerCase()));
    intentScores[intent as UserIntent] = matches.length / keywords.length;
  });

  // Context analysis from conversation history
  const recentMessages = conversationHistory.slice(-5);
  const contextBoost = analyzeConversationContext(recentMessages);
  
  // Apply context boost
  Object.keys(contextBoost).forEach(intent => {
    intentScores[intent as UserIntent] += contextBoost[intent] * 0.3;
  });

  // Find highest scoring intent
  const topIntent = Object.entries(intentScores).reduce((a, b) => 
    intentScores[a[0] as UserIntent] > intentScores[b[0] as UserIntent] ? a : b
  )[0] as UserIntent;

  const confidence = Math.min(intentScores[topIntent] * 100, 95);

  // Extract entities
  const entities = extractEntities(message, currentLanguage);

  // Determine conversation phase
  const conversationPhase = determineConversationPhase(conversationHistory, topIntent, intentHistory);

  const context: IntentContext = {
    intent: confidence < 0.3 ? 'general_chat' : topIntent,
    confidence,
    entities,
    previousIntents: intentHistory.slice(-3).map(h => h.intent),
    conversationPhase
  };

  return context;
};
