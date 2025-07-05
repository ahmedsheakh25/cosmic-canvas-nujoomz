
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { saveChatMessage } from '@/utils/sessionManager';

interface ChatMessage {
  id: string;
  sender: 'user' | 'nujmooz';
  content: string;
  timestamp: Date;
  generatedFiles?: string[];
}

export const useMessageProcessor = (
  sessionId: string | undefined,
  onAddMessage: (message: ChatMessage) => void,
  onSetLoading: (loading: boolean) => void,
  detectLanguage: (text: string) => 'ar' | 'en'
) => {
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([
    'أخبرني عن خدماتكم',
    'أريد تصميم هوية تجارية', 
    'ما هي أسعاركم؟',
    'كيف يمكنني البدء؟'
  ]);

  const processMessage = async (messageToSend: string) => {
    if (!messageToSend.trim() || !sessionId) return;

    const detectedLanguage = detectLanguage(messageToSend);
    
    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: messageToSend,
      timestamp: new Date()
    };
    
    onAddMessage(userMessage);
    onSetLoading(true);

    try {
      // Save user message to database
      await saveChatMessage(sessionId, messageToSend, 'user', detectedLanguage);

      // Call the Edge Function
      const { data, error } = await supabase.functions.invoke('chat-with-nujmooz', {
        body: {
          message: messageToSend,
          sessionId: sessionId,
          language: detectedLanguage
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      const aiResponse = data?.response || getDefaultResponse(detectedLanguage);

      // Add AI response
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'nujmooz',
        content: aiResponse,
        timestamp: new Date()
      };

      onAddMessage(aiMessage);

      // Save AI message to database
      await saveChatMessage(sessionId, aiResponse, 'nujmooz', detectedLanguage);

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'nujmooz',
        content: getErrorResponse(detectedLanguage),
        timestamp: new Date()
      };
      
      onAddMessage(errorMessage);
    } finally {
      onSetLoading(false);
    }
  };

  const getDefaultResponse = (language: 'ar' | 'en'): string => {
    return language === 'ar' 
      ? 'أهلًا وسهلًا! ما فهمت عليك تماماً 🤔 ممكن توضحلي أكثر عن الفكرة الإبداعية اللي في بالك؟ يلا نشوف! ✨'
      : 'Hello there! I didn\'t quite catch that 🤔 Could you tell me more about the amazing creative idea you have in mind? Let\'s explore it together! ✨';
  };

  const getErrorResponse = (language: 'ar' | 'en'): string => {
    return language === 'ar'
      ? 'أهلًا! صار خلل بسيط في النظام 👨‍💻 بس لا تشيل هم، يلا نجرب مرة ثانية خلال دقايق! 🚀'
      : 'Hello! Tiny tech hiccup 👨‍💻 No worries - let\'s try again in a few minutes! 🚀';
  };

  return {
    processMessage,
    suggestedReplies,
    setSuggestedReplies
  };
};
