
import { type EnhancedIntentContext } from '../intent/intentTypes';
import { useConversationMemory } from '../useConversationMemory';
import { useEnhancedResponseProcessor } from '../useEnhancedResponseProcessor';

export const useResponseEnhancer = (currentLanguage: 'en' | 'ar') => {
  const enhancedProcessor = useEnhancedResponseProcessor(currentLanguage);

  const enhanceResponseWithAI = async (
    baseResponse: string,
    context: EnhancedIntentContext & { detectedServices: string[] },
    memory: ReturnType<typeof useConversationMemory>
  ): Promise<string> => {
    let enhancedResponse = baseResponse;

    // Apply enhanced formatting and processing
    const enhancement = enhancedProcessor.processMessageForEnhancement(
      baseResponse,
      context.detectedServices || []
    );

    // Apply emotional tone adjustment
    if (context.emotionalState === 'excited') {
      enhancedResponse = addExcitementToResponse(enhancedResponse, currentLanguage);
    } else if (context.emotionalState === 'frustrated') {
      enhancedResponse = addEmpathyToResponse(enhancedResponse, currentLanguage);
    } else if (context.emotionalState === 'uncertain') {
      enhancedResponse = addReassuranceToResponse(enhancedResponse, currentLanguage);
    }

    // Urgency-based enhancements
    if (context.urgencyLevel === 'high' || context.urgencyLevel === 'critical') {
      enhancedResponse = addUrgencyAcknowledgment(enhancedResponse, currentLanguage);
    }

    // Personalization based on memory
    enhancedResponse = memory.getPersonalizedResponse(enhancedResponse, context);

    // Format for enhanced display
    enhancedResponse = enhancedProcessor.formatResponseForDisplay(enhancedResponse);

    return enhancedResponse;
  };

  const addExcitementToResponse = (response: string, language: 'en' | 'ar'): string => {
    const excitementPhrases = language === 'ar' ? 
      ['رائع!', 'هذا ممتاز!', 'يلا نبدع!', '✨'] :
      ['Amazing!', 'This is fantastic!', 'Let\'s create magic!', '✨'];
    
    const randomPhrase = excitementPhrases[Math.floor(Math.random() * excitementPhrases.length)];
    return `${randomPhrase} ${response}`;
  };

  const addEmpathyToResponse = (response: string, language: 'en' | 'ar'): string => {
    const empathyPhrases = language === 'ar' ? 
      ['أفهم شعورك،', 'أعرف إنه صعب،', 'خلني أساعدك،'] :
      ['I understand how you feel,', 'I know it\'s challenging,', 'Let me help you,'];
    
    const randomPhrase = empathyPhrases[Math.floor(Math.random() * empathyPhrases.length)];
    return `${randomPhrase} ${response}`;
  };

  const addReassuranceToResponse = (response: string, language: 'en' | 'ar'): string => {
    const reassurancePhrases = language === 'ar' ? 
      ['لا تشيل هم،', 'ما في مشكلة،', 'نحن معك،'] :
      ['Don\'t worry,', 'No problem at all,', 'We\'re here for you,'];
    
    const randomPhrase = reassurancePhrases[Math.floor(Math.random() * reassurancePhrases.length)];
    return `${randomPhrase} ${response}`;
  };

  const addUrgencyAcknowledgment = (response: string, language: 'en' | 'ar'): string => {
    const urgencyPhrases = language === 'ar' ? 
      ['أعرف إنك مستعجل، خلني أساعدك بسرعة.', 'حاضر، بنخلص هذا بأسرع وقت.'] :
      ['I know you\'re in a hurry, let me help you quickly.', 'Understood, we\'ll get this done fast.'];
    
    const randomPhrase = urgencyPhrases[Math.floor(Math.random() * urgencyPhrases.length)];
    return `${randomPhrase} ${response}`;
  };

  return {
    enhanceResponseWithAI,
    enhancedProcessor
  };
};
