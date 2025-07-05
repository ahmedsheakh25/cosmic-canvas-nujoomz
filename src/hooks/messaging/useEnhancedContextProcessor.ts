
import { useState } from 'react';
import { type ChatMessage } from '@/utils/sessionManager';
import { analyzeEnhancedIntent, type EnhancedIntentContext } from '../intent/enhancedIntentAnalyzer';
import { useConversationMemory } from '../useConversationMemory';

export const useEnhancedContextProcessor = (
  sessionId: string,
  currentLanguage: 'en' | 'ar',
  messages: ChatMessage[]
) => {
  const [enhancedContext, setEnhancedContext] = useState<EnhancedIntentContext | null>(null);
  const conversationMemory = useConversationMemory(sessionId, currentLanguage);

  const processMessageContext = (
    finalMessage: string,
    effectiveLanguage: 'en' | 'ar'
  ) => {
    // Enhanced AI-powered intent analysis
    const enhancedIntentContext = analyzeEnhancedIntent(
      finalMessage, 
      messages, 
      effectiveLanguage, 
      enhancedContext ? [enhancedContext] : []
    );
    
    // Add detectedServices property based on analysis
    const contextWithServices = {
      ...enhancedIntentContext,
      detectedServices: extractServicesFromMessage(finalMessage, effectiveLanguage)
    };
    
    setEnhancedContext(contextWithServices);

    // Update conversation memory with new insights
    conversationMemory.updateMemory(messages, contextWithServices, finalMessage);

    return { contextWithServices, conversationMemory };
  };

  const extractServicesFromMessage = (message: string, language: 'en' | 'ar'): string[] => {
    const serviceKeywords = language === 'ar' ? {
      'branding': ['هوية', 'علامة تجارية', 'شعار', 'براندينغ'],
      'website': ['موقع', 'ويب سايت', 'تطوير موقع'],
      'marketing': ['تسويق', 'إعلان', 'ترويج'],
      'design': ['تصميم', 'جرافيك', 'واجهة']
    } : {
      'branding': ['brand', 'logo', 'identity', 'branding'],
      'website': ['website', 'web', 'development', 'site'],
      'marketing': ['marketing', 'advertising', 'promotion'],
      'design': ['design', 'graphic', 'ui', 'ux']
    };

    const detectedServices: string[] = [];
    const lowerMessage = message.toLowerCase();

    Object.entries(serviceKeywords).forEach(([service, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()))) {
        detectedServices.push(service);
      }
    });

    return detectedServices;
  };

  return {
    enhancedContext,
    conversationMemory,
    processMessageContext
  };
};
