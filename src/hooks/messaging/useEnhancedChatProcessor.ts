
import { type ChatMessage } from '@/utils/sessionManager';
import { type EnhancedIntentContext } from '../intent/intentTypes';
import { useConversationMemory } from '../useConversationMemory';
import { useResponseEnhancer } from './useResponseEnhancer';
import { usePersonalizedMessages } from './usePersonalizedMessages';

export const useEnhancedChatProcessor = (currentLanguage: 'en' | 'ar') => {
  const responseEnhancer = useResponseEnhancer(currentLanguage);
  const personalizedMessages = usePersonalizedMessages();

  const processEnhancedChatWithAI = async (
    message: string,
    language: 'en' | 'ar',
    context: EnhancedIntentContext & { detectedServices: string[] },
    memory: ReturnType<typeof useConversationMemory>,
    messages: ChatMessage[],
    processEnhancedChat: (
      message: string,
      language: 'en' | 'ar',
      context: any,
      memory: any
    ) => Promise<string>
  ): Promise<string> => {
    // Generate enhanced prompt
    const enhancedPrompt = responseEnhancer.enhancedProcessor.generateEnhancedPrompt(
      message,
      context.detectedServices || [],
      messages.map(m => m.message)
    );

    // Get base response with enhanced context
    let baseResponse = await processEnhancedChat(
      enhancedPrompt,
      language,
      context,
      memory
    );

    // Apply AI enhancements
    baseResponse = await responseEnhancer.enhanceResponseWithAI(baseResponse, context, memory);

    return baseResponse;
  };

  const generateContextualInsights = async (
    context: EnhancedIntentContext & { detectedServices: string[] },
    memory: any,
    messages: ChatMessage[]
  ): Promise<string> => {
    let insights = '';

    if (context.conversationQuality && context.conversationQuality > 0.8 && messages.length > 10) {
      insights += currentLanguage === 'ar' ? 
        '\n\n💡 ملاحظة: أشوف إن النقاش معك مثمر جداً! نحن على الطريق الصحيح لتحقيق أهدافك.' :
        '\n\n💡 Insight: I can see our discussion is very productive! We\'re on the right track to achieve your goals.';
    }

    if (context.userSatisfaction && context.userSatisfaction > 0.7 && context.complexityScore && context.complexityScore > 0.6) {
      insights += currentLanguage === 'ar' ? 
        '\n\n🎯 اقتراح استراتيجي: بناءً على فهمك العميق للموضوع، أنصح بالتركيز على التفاصيل التقنية المتقدمة.' :
        '\n\n🎯 Strategic suggestion: Based on your deep understanding, I recommend focusing on advanced technical details.';
    }

    return insights;
  };

  const generateIntelligentFallback = async (
    language: 'en' | 'ar',
    memory: any,
    context: EnhancedIntentContext | null
  ): Promise<string> => {
    const baseFallback = personalizedMessages.getFallbackMessage(language, memory);
    
    if (context) {
      const contextualApology = language === 'ar' ?
        `أعتذر، يبدو إنه صار خلل تقني بسيط. بس لا تشيل هم، فهمت ${context.emotionalState === 'excited' ? 'حماسك' : 'احتياجك'} وبنكمل من حيث توقفنا! 🚀` :
        `Sorry, there was a small technical hiccup. But don't worry, I understand your ${context.emotionalState === 'excited' ? 'excitement' : 'needs'} and we'll continue from where we left off! 🚀`;
      
      return contextualApology;
    }
    
    return baseFallback;
  };

  const generateIntelligentErrorResponse = async (
    language: 'en' | 'ar',
    context: EnhancedIntentContext | null,
    memory: any
  ): Promise<string> => {
    if (context?.emotionalState === 'frustrated') {
      return language === 'ar' ?
        'أعتذر بشدة على هذا الخطأ. أعرف إنك كنت منزعج أصلاً، وآسف إني زدت الأمور تعقيداً. خلني أساعدك بطريقة أبسط الآن.' :
        'I sincerely apologize for this error. I know you were already frustrated, and I\'m sorry for adding to the complexity. Let me help you in a simpler way now.';
    }
    
    return personalizedMessages.getFinalFallbackMessage(language);
  };

  return {
    processEnhancedChatWithAI,
    generateContextualInsights,
    generateIntelligentFallback,
    generateIntelligentErrorResponse
  };
};
