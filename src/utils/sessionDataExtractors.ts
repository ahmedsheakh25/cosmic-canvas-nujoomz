
import { type ChatMessage } from '@/utils/sessionManager';

export const extractUserPreferences = (messages: ChatMessage[], currentLanguage: 'en' | 'ar') => {
  // Extract preferences from conversation patterns
  const userMessages = messages.filter(m => m.sender === 'user');
  const avgLength = userMessages.reduce((sum, m) => sum + m.message.length, 0) / Math.max(userMessages.length, 1);
  
  // Determine communication style based on message patterns
  let communicationStyle: 'formal' | 'casual' | 'friendly' = 'friendly';
  if (avgLength > 150) {
    communicationStyle = 'formal';
  } else if (avgLength < 50) {
    communicationStyle = 'casual';
  }
  
  return {
    communicationStyle,
    responseLength: 'detailed' as const,
    languagePreference: currentLanguage,
    topicInterests: extractTopicInterests(userMessages, currentLanguage)
  };
};

export const extractProjectContext = (messages: ChatMessage[], currentLanguage: 'en' | 'ar') => {
  const projectKeywords = currentLanguage === 'ar' ? 
    ['تصميم', 'موقع', 'تطبيق', 'هوية', 'تسويق'] :
    ['design', 'website', 'app', 'branding', 'marketing'];
  
  const mentionedServices = messages
    .filter(m => m.sender === 'user')
    .flatMap(m => projectKeywords.filter(keyword => 
      m.message.toLowerCase().includes(keyword.toLowerCase())
    ));
  
  return {
    mentionedServices: [...new Set(mentionedServices)],
    budgetRange: extractBudgetInfo(messages, currentLanguage),
    timelinePreference: extractTimelineInfo(messages, currentLanguage),
    industryFocus: extractIndustryInfo(messages, currentLanguage),
    designPreferences: extractDesignPreferences(messages, currentLanguage)
  };
};

export const extractTopicInterests = (messages: ChatMessage[], currentLanguage: 'en' | 'ar') => {
  const interests: string[] = [];
  const keywords = currentLanguage === 'ar' ? 
    ['تصميم', 'تطوير', 'تسويق', 'إبداع'] :
    ['design', 'development', 'marketing', 'creative'];
  
  keywords.forEach(keyword => {
    if (messages.some(m => m.message.toLowerCase().includes(keyword.toLowerCase()))) {
      interests.push(keyword);
    }
  });
  
  return interests;
};

export const extractBudgetInfo = (messages: ChatMessage[], currentLanguage: 'en' | 'ar') => {
  const budgetRegex = currentLanguage === 'ar' ? 
    /(\d+)\s*(ريال|درهم|دولار)/ :
    /\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/;
  
  for (const message of messages) {
    const match = message.message.match(budgetRegex);
    if (match) return match[0];
  }
  return undefined;
};

export const extractTimelineInfo = (messages: ChatMessage[], currentLanguage: 'en' | 'ar') => {
  const timeKeywords = currentLanguage === 'ar' ? 
    ['أسبوع', 'شهر', 'يوم'] : ['week', 'month', 'day'];
  
  for (const message of messages) {
    for (const keyword of timeKeywords) {
      if (message.message.toLowerCase().includes(keyword)) {
        return keyword;
      }
    }
  }
  return undefined;
};

export const extractIndustryInfo = (messages: ChatMessage[], currentLanguage: 'en' | 'ar') => {
  const industries = currentLanguage === 'ar' ? 
    ['تجارة', 'تعليم', 'صحة', 'تقنية'] :
    ['ecommerce', 'education', 'healthcare', 'technology'];
  
  for (const message of messages) {
    for (const industry of industries) {
      if (message.message.toLowerCase().includes(industry.toLowerCase())) {
        return industry;
      }
    }
  }
  return undefined;
};

export const extractDesignPreferences = (messages: ChatMessage[], currentLanguage: 'en' | 'ar') => {
  const preferences: string[] = [];
  const designKeywords = currentLanguage === 'ar' ? 
    ['بسيط', 'عصري', 'كلاسيكي'] : ['minimalist', 'modern', 'classic'];
  
  designKeywords.forEach(keyword => {
    if (messages.some(m => m.message.toLowerCase().includes(keyword.toLowerCase()))) {
      preferences.push(keyword);
    }
  });
  
  return preferences;
};
