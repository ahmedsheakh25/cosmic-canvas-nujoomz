
import { type ChatMessage } from '@/utils/sessionManager';
import { type UserIntent, type IntentContext } from './intentTypes';

export const determineConversationPhase = (
  history: ChatMessage[], 
  currentIntent: UserIntent,
  intentHistory: IntentContext[]
): 'discovery' | 'qualification' | 'briefing' | 'completion' => {
  if (history.length < 3) return 'discovery';
  
  const recentIntents = intentHistory.slice(-3).map(h => h.intent);
  
  if (recentIntents.includes('brief_creation') && currentIntent === 'brief_creation') {
    return 'briefing';
  }
  
  if (recentIntents.filter(intent => 
    ['project_inquiry', 'service_exploration'].includes(intent)
  ).length >= 2) {
    return 'qualification';
  }
  
  if (currentIntent === 'brief_creation' && history.length > 10) {
    return 'completion';
  }
  
  return 'discovery';
};

export const analyzeConversationContext = (messages: ChatMessage[]): Record<string, number> => {
  const contextBoost: Record<string, number> = {};
  
  messages.forEach((msg, index) => {
    const weight = (index + 1) / messages.length; // Recent messages have higher weight
    
    if (msg.sender === 'nujmooz' && msg.message.includes('brief')) {
      contextBoost.brief_creation = (contextBoost.brief_creation || 0) + weight;
    }
    
    if (msg.message.toLowerCase().includes('service')) {
      contextBoost.service_exploration = (contextBoost.service_exploration || 0) + weight;
    }
  });

  return contextBoost;
};
