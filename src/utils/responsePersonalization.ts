
import { type ConversationMemory } from '@/hooks/useConversationMemory';
import { type InteractionPattern } from '@/types/interactiveMemory';

export const personalizeResponse = (
  baseResponse: string,
  memory: ConversationMemory,
  patterns: InteractionPattern,
  currentLanguage: 'en' | 'ar'
): string => {
  let personalizedResponse = baseResponse;

  // Apply user communication style
  if (memory.userPreferences.communicationStyle === 'formal') {
    personalizedResponse = formalizeResponse(personalizedResponse, currentLanguage);
  } else if (memory.userPreferences.communicationStyle === 'casual') {
    personalizedResponse = casualizeResponse(personalizedResponse, currentLanguage);
  }

  // Adjust length based on preference
  if (patterns.messageStyle === 'concise') {
    personalizedResponse = shortenResponse(personalizedResponse, currentLanguage);
  } else if (patterns.messageStyle === 'detailed') {
    personalizedResponse = expandResponse(personalizedResponse, memory, currentLanguage);
  }

  // Add contextual elements based on project context
  if (memory.projectContext.mentionedServices.length > 0) {
    personalizedResponse = addServiceContext(personalizedResponse, memory.projectContext, currentLanguage);
  }

  return personalizedResponse;
};

const formalizeResponse = (response: string, language: 'en' | 'ar'): string => {
  if (language === 'ar') {
    return response
      .replace(/يلا/g, 'دعنا')
      .replace(/ما شاء الله/g, 'رائع')
      .replace(/حبيبي|صديقي/g, 'سيدي المحترم');
  } else {
    return response
      .replace(/awesome|amazing/gi, 'excellent')
      .replace(/let's go/gi, 'let us proceed')
      .replace(/hey|hi there/gi, 'greetings');
  }
};

const casualizeResponse = (response: string, language: 'en' | 'ar'): string => {
  if (language === 'ar') {
    return response
      .replace(/سيدي المحترم/g, 'صديقي')
      .replace(/يرجى/g, 'ممكن')
      .replace(/نحن نقدر/g, 'حبينا');
  } else {
    return response
      .replace(/excellent/gi, 'awesome')
      .replace(/greetings/gi, 'hey there')
      .replace(/please/gi, 'just');
  }
};

const shortenResponse = (response: string, language: 'en' | 'ar'): string => {
  const sentences = response.split(/[.!?]+/).filter(s => s.trim());
  return sentences.slice(0, Math.ceil(sentences.length / 2)).join('. ') + '.';
};

const expandResponse = (response: string, memory: ConversationMemory, language: 'en' | 'ar'): string => {
  const contextualAdditions = [];
  
  if (memory.projectContext.mentionedServices.length > 0) {
    const serviceContext = language === 'ar' ? 
      `وبناء على اهتمامك بـ ${memory.projectContext.mentionedServices.join('، ')}` :
      `Based on your interest in ${memory.projectContext.mentionedServices.join(', ')}`;
    contextualAdditions.push(serviceContext);
  }
  
  if (memory.userPreferences.topicInterests.length > 0) {
    const topicContext = language === 'ar' ? 
      `نظراً لاهتمامك بـ ${memory.userPreferences.topicInterests.join('، ')}` :
      `Given your interest in ${memory.userPreferences.topicInterests.join(', ')}`;
    contextualAdditions.push(topicContext);
  }
  
  return response + (contextualAdditions.length > 0 ? '\n\n' + contextualAdditions.join('، ') + '.' : '');
};

const addServiceContext = (response: string, projectContext: any, language: 'en' | 'ar'): string => {
  const services = projectContext.mentionedServices;
  if (services.length === 0) return response;
  
  const serviceHint = language === 'ar' ? 
    `\n\n💡 بما أنك مهتم بـ ${services.join('، ')}، يمكنني مساعدتك في التخطيط لهذه الخدمات!` :
    `\n\n💡 Since you're interested in ${services.join(', ')}, I can help you plan these services!`;
  
  return response + serviceHint;
};
