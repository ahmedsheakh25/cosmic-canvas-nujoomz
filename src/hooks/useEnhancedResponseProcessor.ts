import { useState, useEffect } from 'react';
import { 
  getEnhancedNujmoozInstructions, 
  getServiceSpecificGuidance,
  detectResponseType 
} from '@/lib/enhancedNujmoozInstructions';

export const useEnhancedResponseProcessor = (currentLanguage: 'en' | 'ar') => {
  const [currentService, setCurrentService] = useState<string>('');
  const [conversationContext, setConversationContext] = useState<string[]>([]);

  const processMessageForEnhancement = (message: string, detectedServices: string[] = []) => {
    // Update current service if detected
    if (detectedServices.length > 0) {
      setCurrentService(detectedServices[0]);
    }

    // Add to conversation context (keep last 5 messages for context)
    setConversationContext(prev => [...prev.slice(-4), message]);

    const responseType = detectResponseType(message);
    
    return {
      responseType,
      currentService,
      enhancedInstructions: getEnhancedNujmoozInstructions(currentLanguage, responseType),
      serviceGuidance: currentService ? getServiceSpecificGuidance(currentService, currentLanguage) : '',
      conversationContext: conversationContext.join(' ')
    };
  };

  const generateEnhancedPrompt = (
    userMessage: string, 
    detectedServices: string[] = [],
    conversationHistory: string[] = []
  ): string => {
    const enhancement = processMessageForEnhancement(userMessage, detectedServices);
    
    const contextualPrompt = `
${enhancement.enhancedInstructions}

${enhancement.serviceGuidance}

📋 **Response Requirements:**
- Format your response with clear headings and sections
- Use bullet points for lists and important information
- Be specific and actionable in your advice
- Include relevant examples when helpful
- Maintain ${enhancement.responseType} tone throughout

🎯 **Current Context:**
- Service Focus: ${currentService || 'General consultation'}
- Response Type: ${enhancement.responseType}
- Language: ${currentLanguage === 'ar' ? 'Arabic (Gulf dialect)' : 'English'}

📝 **User Message:** ${userMessage}

Please provide a comprehensive, well-formatted response that addresses the user's needs professionally and clearly.
    `;

    return contextualPrompt.trim();
  };

  const formatResponseForDisplay = (response: string): string => {
    // Add automatic formatting for better display
    let formattedResponse = response;

    // Ensure proper heading formatting
    formattedResponse = formattedResponse.replace(/^([^#\n]+)$/gm, (match) => {
      if (match.trim() && !match.includes('•') && !match.includes('-') && match.length < 100) {
        return `## ${match.trim()}`;
      }
      return match;
    });

    // Format service-specific sections
    if (currentService) {
      const serviceTitle = currentLanguage === 'ar' ? 
        `خدمة ${currentService}` : 
        `${currentService.charAt(0).toUpperCase() + currentService.slice(1)} Service`;
      
      if (!formattedResponse.includes(serviceTitle)) {
        formattedResponse = `## ${serviceTitle}\n\n${formattedResponse}`;
      }
    }

    return formattedResponse;
  };

  return {
    processMessageForEnhancement,
    generateEnhancedPrompt,
    formatResponseForDisplay,
    currentService,
    conversationContext,
    setCurrentService
  };
};
