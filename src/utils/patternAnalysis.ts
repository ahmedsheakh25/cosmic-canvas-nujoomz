
import { type ChatMessage } from '@/utils/sessionManager';
import { type InteractionPattern } from '@/types/interactiveMemory';

export const analyzeInteractionPatterns = (messages: ChatMessage[]): InteractionPattern => {
  if (messages.length < 3) {
    return {
      responseSpeed: 'moderate',
      messageStyle: 'detailed',
      questionFrequency: 'medium'
    };
  }

  const userMessages = messages.filter(m => m.sender === 'user');
  const aiMessages = messages.filter(m => m.sender === 'nujmooz');

  // Analyze response patterns
  const responseTimes = [];
  for (let i = 1; i < aiMessages.length; i++) {
    const prevUserMsg = userMessages.find(m => 
      new Date(m.created_at) < new Date(aiMessages[i].created_at)
    );
    if (prevUserMsg) {
      responseTimes.push(
        new Date(aiMessages[i].created_at).getTime() - 
        new Date(prevUserMsg.created_at).getTime()
      );
    }
  }

  const avgResponseTime = responseTimes.length > 0 ? 
    responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length : 0;

  // Determine response speed preference
  let responseSpeed: 'fast' | 'moderate' | 'slow' = 'moderate';
  if (avgResponseTime < 5000) responseSpeed = 'fast';
  else if (avgResponseTime > 15000) responseSpeed = 'slow';

  // Analyze message style preference
  const avgMessageLength = userMessages.reduce((sum, m) => sum + m.message.length, 0) / 
    Math.max(userMessages.length, 1);
  
  let messageStyle: 'detailed' | 'concise' | 'mixed' = 'mixed';
  if (avgMessageLength > 100) messageStyle = 'detailed';
  else if (avgMessageLength < 30) messageStyle = 'concise';

  // Analyze question frequency
  const questionCount = userMessages.filter(m => m.message.includes('?')).length;
  const questionRatio = questionCount / Math.max(userMessages.length, 1);
  
  let questionFrequency: 'high' | 'medium' | 'low' = 'medium';
  if (questionRatio > 0.5) questionFrequency = 'high';
  else if (questionRatio < 0.2) questionFrequency = 'low';

  return {
    responseSpeed,
    messageStyle,
    questionFrequency
  };
};
