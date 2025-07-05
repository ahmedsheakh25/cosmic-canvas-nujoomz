
import { type UserEngagementMetrics, type EngagementData, type MemorySnapshot, type PatternAnalysisData, type InteractionPattern } from '@/types/interactiveMemory';

export const calculateEngagementScore = (newData: EngagementData, currentMetrics: UserEngagementMetrics): number => {
  const factors = [
    (newData.messageLength || 0) > 20 ? 0.3 : 0.1,
    newData.hasQuestions ? 0.2 : 0,
    (newData.responseTime || 0) < 30000 ? 0.3 : 0.1,
    newData.interactionType === 'positive' ? 0.2 : 0
  ];
  
  const newScore = factors.reduce((sum, factor) => sum + factor, 0);
  return (currentMetrics.engagementScore * 0.8) + (newScore * 0.2); // Weighted average
};

export const updateCompletionRate = (newData: EngagementData, currentMetrics: UserEngagementMetrics): number => {
  if (newData.completedAction) {
    return Math.min(currentMetrics.completionRate + 0.1, 1.0);
  }
  return currentMetrics.completionRate;
};

export const analyzeMemoryEvolution = (snapshots: MemorySnapshot[]) => {
  if (snapshots.length < 2) return { stable: true, changes: [] };
  
  const changes = [];
  for (let i = 1; i < snapshots.length; i++) {
    const prev = snapshots[i - 1];
    const current = snapshots[i];
    
    // Compare key memory aspects
    if (prev.memory.userPreferences?.communicationStyle !== current.memory.userPreferences?.communicationStyle) {
      changes.push('communication_style_change');
    }
    
    if (prev.memory.projectContext?.mentionedServices?.length !== current.memory.projectContext?.mentionedServices?.length) {
      changes.push('service_interests_change');
    }
  }
  
  return {
    stable: changes.length === 0,
    changes
  };
};

export const calculatePatternStability = (patterns: PatternAnalysisData[]) => {
  if (patterns.length < 3) return 0.5;
  
  const recentPatterns = patterns.slice(-3);
  let stabilityScore = 0;
  
  // Check consistency across recent patterns
  const responseSpeedConsistency = recentPatterns.every(p => 
    p.data.responseSpeed === recentPatterns[0].data.responseSpeed
  ) ? 1 : 0;
  
  const messageStyleConsistency = recentPatterns.every(p => 
    p.data.messageStyle === recentPatterns[0].data.messageStyle
  ) ? 1 : 0;
  
  stabilityScore = (responseSpeedConsistency + messageStyleConsistency) / 2;
  return stabilityScore;
};

export const analyzeEngagementTrends = (metrics: UserEngagementMetrics) => {
  return {
    trending: metrics.engagementScore > 0.7 ? 'up' : metrics.engagementScore < 0.3 ? 'down' : 'stable',
    completionTrend: metrics.completionRate > 0.8 ? 'high' : metrics.completionRate < 0.3 ? 'low' : 'moderate',
    activityLevel: metrics.totalInteractions > 20 ? 'high' : metrics.totalInteractions < 5 ? 'low' : 'moderate'
  };
};

export const generateRecommendations = (patterns: InteractionPattern, metrics: UserEngagementMetrics, currentLanguage: 'en' | 'ar') => {
  const recommendations = [];
  
  if (patterns.responseSpeed === 'slow') {
    recommendations.push(currentLanguage === 'ar' ? 
      'استخدام إجابات أسرع وأكثر مباشرة' : 
      'Use faster, more direct responses');
  }
  
  if (metrics.engagementScore < 0.4) {
    recommendations.push(currentLanguage === 'ar' ? 
      'إضافة المزيد من العناصر التفاعلية' : 
      'Add more interactive elements');
  }
  
  if (patterns.questionFrequency === 'low') {
    recommendations.push(currentLanguage === 'ar' ? 
      'طرح أسئلة توجيهية أكثر' : 
      'Ask more guiding questions');
  }
  
  return recommendations;
};
