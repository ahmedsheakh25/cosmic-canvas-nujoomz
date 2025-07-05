import { supabase } from '@/integrations/supabase/client';
import { saveChatMessage } from '@/utils/sessionManager';
import type { MessageResponse } from './types';

export const processUserMessage = async (
  messageToSend: string,
  sessionId: string,
  language: 'ar' | 'en'
): Promise<void> => {
  // Save user message to database
  await saveChatMessage(sessionId, messageToSend, 'user', language);
};

export const processAIResponse = async (
  messageToSend: string,
  sessionId: string,
  language: 'ar' | 'en'
): Promise<MessageResponse> => {
  // Call the Edge Function
  const { data, error } = await supabase.functions.invoke('chat-with-nujmooz', {
    body: {
      message: messageToSend,
      sessionId: sessionId,
      language: language
    }
  });

  if (error) {
    return { error };
  }

  // Save AI message to database if we got a response
  if (data?.response) {
    await saveChatMessage(sessionId, data.response, 'nujmooz', language);
  }

  return { data };
};