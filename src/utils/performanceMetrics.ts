
import { type ChatMessage } from '@/utils/sessionManager';

export interface PerformanceMetrics {
  averageResponseTime: number;
  messagesCount: number;
  satisfactionScore: number;
  completionRate: number;
}

export const calculatePerformanceMetrics = (
  messages: ChatMessage[], 
  interactions: any[], 
  currentLanguage: 'en' | 'ar'
): PerformanceMetrics => {
  const userMessages = messages.filter(m => m.sender === 'user');
  const aiMessages = messages.filter(m => m.sender === 'nujmooz');
  
  const averageResponseTime = aiMessages.length > 1 ? 
    aiMessages.reduce((sum, msg, index) => {
      if (index === 0) return sum;
      const prevMsg = messages.find(m => 
        new Date(m.created_at) < new Date(msg.created_at) && m.sender === 'user'
      );
      if (prevMsg) {
        return sum + (new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime());
      }
      return sum;
    }, 0) / (aiMessages.length - 1) : 0;
  
  return {
    averageResponseTime,
    messagesCount: messages.length,
    satisfactionScore: interactions.length > 0 ? 
      interactions.reduce((sum, int) => sum + (int.interaction_data?.satisfaction || 0), 0) / interactions.length : 0.5,
    completionRate: calculateCompletionRate(messages, currentLanguage)
  };
};

export const calculateCompletionRate = (messages: ChatMessage[], currentLanguage: 'en' | 'ar') => {
  const briefKeywords = currentLanguage === 'ar' ? 
    ['موجز', 'تفاصيل', 'متطلبات'] : ['brief', 'details', 'requirements'];
  
  const briefMentions = messages.filter(m => 
    briefKeywords.some(keyword => 
      m.message.toLowerCase().includes(keyword.toLowerCase())
    )
  ).length;
  
  return Math.min(briefMentions / 5, 1); // Normalize to 0-1
};
