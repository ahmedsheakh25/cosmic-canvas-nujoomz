
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getNujmoozPersona, getServiceQuestions } from '@/lib/enhancedNujmoozPersona';
import { detectLanguageFromMessage } from '@/lib/nujmoozInstructions';
import type { ProjectBrief } from '@/types/projectBrief';

interface ChatMessage {
  id: string;
  sender: 'user' | 'nujmooz';
  content: string;
  timestamp: Date;
  language?: 'en' | 'ar';
}

export const useEnhancedNujmoozChat = (sessionId: string, currentLanguage: 'en' | 'ar') => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBrief, setCurrentBrief] = useState<ProjectBrief | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const detectService = useCallback((message: string): string | null => {
    const serviceMappings = {
      branding: ['brand', 'logo', 'identity', 'هوية', 'شعار', 'علامة'],
      website: ['website', 'site', 'web', 'موقع', 'ويب'],
      marketing: ['marketing', 'campaign', 'تسويق', 'حملة', 'إعلان'],
      motion: ['video', 'animation', 'فيديو', 'حركة', 'انيميشن'],
      photography: ['photo', 'photography', 'تصوير', 'صور'],
      uiux: ['ui', 'ux', 'app', 'تطبيق', 'واجهة']
    };

    const lowerMessage = message.toLowerCase();
    for (const [service, keywords] of Object.entries(serviceMappings)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return service;
      }
    }
    return null;
  }, []);

  const sendToOpenAI = useCallback(async (userMessage: string, conversationHistory: ChatMessage[]) => {
    try {
      const persona = getNujmoozPersona(currentLanguage);
      const context = conversationHistory.slice(-5).map(msg => 
        `${msg.sender}: ${msg.content}`
      ).join('\n');

      const { data, error } = await supabase.functions.invoke('enhanced-nujmooz-chat', {
        body: {
          message: userMessage,
          language: currentLanguage,
          persona,
          context,
          currentBrief: currentBrief,
          sessionId
        }
      });

      if (error) throw error;
      return data.response;
    } catch (error) {
      console.error('Error calling enhanced chat:', error);
      return currentLanguage === 'ar' 
        ? 'عذراً، حدث خطأ تقني. يرجى المحاولة مرة أخرى.' 
        : 'Sorry, there was a technical error. Please try again.';
    }
  }, [currentLanguage, currentBrief, sessionId]);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    const detectedLang = detectLanguageFromMessage(content);
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content,
      timestamp: new Date(),
      language: detectedLang
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Detect service if not already in brief collection
    if (!currentBrief) {
      const detectedService = detectService(content);
      if (detectedService) {
        const newBrief: ProjectBrief = {
          service: detectedService,
          answers: {},
          clientInfo: {},
          status: 'collecting'
        };
        setCurrentBrief(newBrief);
        setCurrentQuestionIndex(0);
      }
    }

    // Get AI response
    const response = await sendToOpenAI(content, [userMessage]);
    
    // Add AI message
    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'nujmooz',
      content: response,
      timestamp: new Date(),
      language: currentLanguage
    };
    
    setMessages(prev => [...prev, aiMessage]);

    // Update suggested replies based on context
    if (currentBrief && currentBrief.status === 'collecting') {
      const questions = getServiceQuestions(currentBrief.service, currentLanguage);
      if (currentQuestionIndex < questions.length - 1) {
        setSuggestedReplies(currentLanguage === 'ar' ? 
          ['نعم، صحيح', 'دعني أوضح أكثر', 'لدي سؤال'] :
          ['Yes, exactly', 'Let me clarify', 'I have a question']
        );
      } else {
        setSuggestedReplies(currentLanguage === 'ar' ? 
          ['أنشئ الموجز', 'أريد تعديل شيء', 'إرسال للفريق'] :
          ['Create brief', 'I want to modify something', 'Send to team']
        );
      }
    }

    // Save to database
    await supabase.from('chat_conversations').insert([
      { session_id: sessionId, message: content, sender: 'user', language: detectedLang },
      { session_id: sessionId, message: response, sender: 'nujmooz', language: currentLanguage }
    ]);

    setIsLoading(false);
  }, [isLoading, currentLanguage, currentBrief, currentQuestionIndex, detectService, sendToOpenAI, sessionId]);

  const generateProjectBrief = useCallback(async () => {
    if (!currentBrief || currentBrief.status !== 'collecting') return;

    try {
      // Set status to generating
      setCurrentBrief(prev => prev ? { ...prev, status: 'generating' } : null);

      const briefData = {
        service: currentBrief.service,
        answers: currentBrief.answers,
        client_info: currentBrief.clientInfo,
        language: currentLanguage,
        session_id: sessionId,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase.from('project_briefs').insert([{
        brief_data: briefData,
        user_id: sessionId,
        status: 'New'
      }]).select().single();

      if (error) throw error;

      // Generate PDF
      await supabase.functions.invoke('generate-brief-pdf', {
        body: { briefId: data.id, briefData }
      });

      // Send to Trello
      await supabase.functions.invoke('create-trello-card', {
        body: { briefId: data.id, briefData }
      });

      setCurrentBrief(prev => prev ? { ...prev, status: 'complete' } : null);
      
      const successMessage = currentLanguage === 'ar' 
        ? '🎉 تم إنشاء موجز المشروع بنجاح! سيتواصل معك الفريق قريباً.'
        : '🎉 Project brief created successfully! Our team will contact you soon.';
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'nujmooz',
        content: successMessage,
        timestamp: new Date(),
        language: currentLanguage
      };
      
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error generating brief:', error);
      // Reset status on error
      setCurrentBrief(prev => prev ? { ...prev, status: 'collecting' } : null);
    }
  }, [currentBrief, currentLanguage, sessionId]);

  return {
    messages,
    isLoading,
    currentBrief,
    suggestedReplies,
    messagesEndRef,
    handleSendMessage,
    generateProjectBrief,
    setSuggestedReplies
  };
};
