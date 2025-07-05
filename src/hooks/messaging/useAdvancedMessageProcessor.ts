
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { saveChatMessage, type ChatMessage } from '@/utils/sessionManager';
import { type ConversationMemory } from '../useConversationMemory';
import { type IntentContext } from '../intent/intentTypes';

export const useAdvancedMessageProcessor = (
  sessionId: string,
  currentLanguage: 'en' | 'ar',
  messages: ChatMessage[],
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processEnhancedChat = async (
    finalMessage: string,
    effectiveLanguage: 'en' | 'ar',
    intentContext: IntentContext,
    memory: ConversationMemory
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-nujmooz', {
        body: {
          message: finalMessage,
          sessionId: sessionId,
          language: effectiveLanguage,
          conversationHistory: messages.slice(-5),
          intentContext: intentContext,
          userPreferences: memory.userPreferences,
          projectContext: memory.projectContext
        }
      });

      if (error) throw new Error(error.message);
      
      return data?.response || getDefaultResponse(effectiveLanguage, intentContext);
    } catch (error) {
      console.error('Enhanced API Error:', error);
      throw error;
    }
  };

  const processEnhancedWorkflow = async (
    briefData: any,
    memory: ConversationMemory,
    intentContext: IntentContext
  ) => {
    try {
      console.log('Starting enhanced workflow process...');
      
      const enhancedBriefData = {
        ...briefData,
        userPreferences: memory.userPreferences,
        projectContext: memory.projectContext,
        intentContext: intentContext
      };

      const { data: workflowResult, error: workflowError } = await supabase.functions.invoke('nujmooz-workflow', {
        body: {
          sessionId: sessionId,
          projectData: enhancedBriefData,
          conversationHistory: messages.slice(-10).map(m => `${m.sender}: ${m.message}`),
          skipTrello: false
        }
      });

      if (!workflowError && workflowResult?.success) {
        return {
          success: true,
          briefId: workflowResult.briefId,
          trelloCard: workflowResult.trelloCard,
          enhancedData: enhancedBriefData
        };
      }
      
      return { success: false, error: workflowError };
    } catch (error) {
      console.error('Error in enhanced workflow:', error);
      return { success: false, error };
    }
  };

  const getDefaultResponse = (language: 'en' | 'ar', intentContext: IntentContext): string => {
    return language === 'ar' 
      ? 'أهلًا وسهلًا! ما فهمت عليك تماماً 🤔 ممكن توضحلي أكثر عن الفكرة الإبداعية اللي في بالك؟ يلا نشوف! ✨'
      : 'Hello there! I didn\'t quite catch that 🤔 Could you tell me more about the amazing creative idea you have in mind? Let\'s explore it together! ✨';
  };

  return {
    isProcessing,
    setIsProcessing,
    processEnhancedChat,
    processEnhancedWorkflow
  };
};
