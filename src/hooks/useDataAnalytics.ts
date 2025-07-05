
import { useCallback } from 'react';
import { type SessionData } from './useSessionData';
import { type ChatMessage } from '@/utils/sessionManager';

export const useDataAnalytics = (currentLanguage: 'en' | 'ar') => {
  // Advanced analytics and insights
  const getSessionInsights = useCallback((sessionData: SessionData | null) => {
    if (!sessionData) return null;
    
    const { conversationHistory, performanceMetrics, userPreferences } = sessionData;
    
    return {
      conversationLength: conversationHistory.length,
      averageMessageLength: conversationHistory.reduce((sum, msg) => 
        sum + msg.message.length, 0) / Math.max(conversationHistory.length, 1),
      
      languageConsistency: calculateLanguageConsistency(conversationHistory),
      topicProgression: analyzeTopicProgression(conversationHistory),
      engagementLevel: calculateEngagementLevel(conversationHistory, performanceMetrics),
      
      userPersonality: {
        communicationStyle: userPreferences.communicationStyle,
        preferredTopics: userPreferences.topicInterests,
        responsePattern: analyzeResponsePatterns(conversationHistory)
      },
      
      projectReadiness: calculateProjectReadiness(sessionData.projectContext),
      nextBestActions: suggestNextBestActions(sessionData)
    };
  }, [currentLanguage]);

  // Helper functions for analytics
  const calculateLanguageConsistency = (messages: ChatMessage[]) => {
    const languages = messages.map(m => m.language);
    const consistency = languages.filter(lang => lang === currentLanguage).length / Math.max(languages.length, 1);
    return Math.round(consistency * 100);
  };

  const analyzeTopicProgression = (messages: ChatMessage[]) => {
    // Simplified topic analysis
    const topics = ['greeting', 'service_inquiry', 'project_details', 'pricing', 'timeline'];
    return topics.map(topic => ({
      topic,
      mentions: messages.filter(m => 
        m.message.toLowerCase().includes(topic.replace('_', ' '))
      ).length
    }));
  };

  const calculateEngagementLevel = (messages: ChatMessage[], metrics: any) => {
    const factors = [
      messages.length > 10 ? 1 : 0.5,
      metrics.averageResponseTime < 30000 ? 1 : 0.7,
      metrics.satisfactionScore > 0.7 ? 1 : metrics.satisfactionScore
    ];
    
    return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
  };

  const analyzeResponsePatterns = (messages: ChatMessage[]) => {
    const userMessages = messages.filter(m => m.sender === 'user');
    return {
      quickResponder: userMessages.length > 5,
      detailOriented: userMessages.some(m => m.message.length > 200),
      questionAsker: userMessages.filter(m => m.message.includes('?')).length > userMessages.length * 0.3
    };
  };

  const calculateProjectReadiness = (projectContext: any) => {
    const readinessFactors = [
      projectContext.mentionedServices.length > 0 ? 0.3 : 0,
      projectContext.budgetRange ? 0.2 : 0,
      projectContext.timelinePreference ? 0.2 : 0,
      projectContext.industryFocus ? 0.15 : 0,
      projectContext.designPreferences.length > 0 ? 0.15 : 0
    ];
    
    return readinessFactors.reduce((sum, factor) => sum + factor, 0);
  };

  const suggestNextBestActions = (sessionData: SessionData) => {
    const actions = [];
    
    if (sessionData.projectContext.mentionedServices.length === 0) {
      actions.push(currentLanguage === 'ar' ? 
        'استكشاف الخدمات المتاحة' : 'Explore available services');
    }
    
    if (!sessionData.projectContext.budgetRange) {
      actions.push(currentLanguage === 'ar' ? 
        'مناقشة الميزانية' : 'Discuss budget range');
    }
    
    if (sessionData.performanceMetrics.completionRate > 0.7) {
      actions.push(currentLanguage === 'ar' ? 
        'إنشاء موجز المشروع' : 'Create project brief');
    }
    
    return actions;
  };

  return {
    getSessionInsights,
    calculateLanguageConsistency,
    analyzeTopicProgression,
    calculateEngagementLevel,
    analyzeResponsePatterns,
    calculateProjectReadiness,
    suggestNextBestActions
  };
};
