
import { type ConversationMemory } from '@/hooks/useConversationMemory';
import { type ChatMessage } from '@/utils/sessionManager';
import { type IntentContext } from '@/hooks/useIntentAnalysis';

export interface ConversationMemoryHook {
  memory: ConversationMemory;
  updateMemory: (messages: ChatMessage[], intentContext: IntentContext, userMessage: string) => void;
  getPersonalizedResponse: (baseResponse: string, context: IntentContext) => string;
  getSatisfactionScore: () => number;
}
