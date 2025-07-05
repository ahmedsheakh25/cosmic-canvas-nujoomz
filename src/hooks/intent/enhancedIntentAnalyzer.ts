
import { type ChatMessage } from '@/utils/sessionManager';
import { type UserIntent, type IntentContext, type EnhancedIntentContext } from './intentTypes';
import { intentPatterns } from './intentPatterns';
import { extractEntities } from './entityExtraction';

export const analyzeEnhancedIntent = (
  message: string,
  conversationHistory: ChatMessage[],
  currentLanguage: 'en' | 'ar',
  intentHistory: IntentContext[]
): EnhancedIntentContext => {
  const basicContext = analyzeBasicIntent(message, conversationHistory, currentLanguage, intentHistory);
  
  // Enhanced analysis
  const emotionalState = analyzeEmotionalState(message, currentLanguage);
  const urgencyLevel = analyzeUrgencyLevel(message, currentLanguage);
  const complexityScore = calculateComplexityScore(message, conversationHistory);
  const topicProgression = analyzeTopicProgression(conversationHistory);
  const conversationQuality = assessConversationQuality(conversationHistory);
  const userSatisfaction = estimateUserSatisfaction(conversationHistory, currentLanguage);

  return {
    ...basicContext,
    emotionalState,
    urgencyLevel,
    complexityScore,
    topicProgression,
    conversationQuality,
    userSatisfaction
  };
};

const analyzeBasicIntent = (
  message: string,
  conversationHistory: ChatMessage[],
  currentLanguage: 'en' | 'ar',
  intentHistory: IntentContext[]
): IntentContext => {
  const lowerMessage = message.toLowerCase();
  const patterns = intentPatterns[currentLanguage];
  
  // Enhanced pattern matching with weights
  const intentScores: Record<UserIntent, number> = {
    project_inquiry: 0,
    service_exploration: 0,
    brief_creation: 0,
    creative_assistance: 0,
    pricing_question: 0,
    timeline_discussion: 0,
    general_chat: 0,
    technical_support: 0,
    portfolio_request: 0
  };

  // Advanced pattern matching with context
  Object.entries(patterns).forEach(([intent, keywords]) => {
    const matches = keywords.filter(keyword => lowerMessage.includes(keyword.toLowerCase()));
    const weight = getIntentWeight(intent as UserIntent, conversationHistory);
    intentScores[intent as UserIntent] = (matches.length / keywords.length) * weight;
  });

  // Contextual boosting
  applyContextualBoosting(intentScores, conversationHistory, intentHistory);

  // Sequential pattern analysis
  applySequentialAnalysis(intentScores, conversationHistory, intentHistory);

  // Find highest scoring intent
  const topIntent = Object.entries(intentScores).reduce((a, b) => 
    intentScores[a[0] as UserIntent] > intentScores[b[0] as UserIntent] ? a : b
  )[0] as UserIntent;

  const confidence = Math.min(intentScores[topIntent] * 100, 95);
  const entities = extractEntities(message, currentLanguage);
  const conversationPhase = determineAdvancedConversationPhase(conversationHistory, topIntent, intentHistory);

  return {
    intent: confidence < 0.4 ? 'general_chat' : topIntent,
    confidence,
    entities,
    previousIntents: intentHistory.slice(-3).map(h => h.intent),
    conversationPhase
  };
};

const analyzeEmotionalState = (message: string, language: 'en' | 'ar'): 'excited' | 'frustrated' | 'uncertain' | 'satisfied' => {
  const emotionPatterns = language === 'ar' ? {
    excited: ['رائع', 'ممتاز', 'هائل', 'رهيب', 'يلا', '!', 'واو'],
    frustrated: ['مشكلة', 'صعب', 'معقد', 'ما أفهم', 'ليش', 'تعبان'],
    uncertain: ['ما أدري', 'مو متأكد', 'ربما', 'ممكن', 'أظن', 'شكله'],
    satisfied: ['شكراً', 'ممتاز', 'واضح', 'مفهوم', 'تمام', 'الله يعطيك العافية']
  } : {
    excited: ['amazing', 'awesome', 'great', 'fantastic', 'wow', '!'],
    frustrated: ['problem', 'difficult', 'hard', 'confused', 'why', 'stuck'],
    uncertain: ['maybe', 'perhaps', 'not sure', 'think', 'might', 'possibly'],
    satisfied: ['thanks', 'great', 'clear', 'understood', 'perfect', 'excellent']
  };

  const scores = {
    excited: 0,
    frustrated: 0,
    uncertain: 0,
    satisfied: 0
  };

  Object.entries(emotionPatterns).forEach(([emotion, patterns]) => {
    patterns.forEach(pattern => {
      if (message.toLowerCase().includes(pattern.toLowerCase())) {
        scores[emotion as keyof typeof scores]++;
      }
    });
  });

  const dominantEmotion = Object.entries(scores).reduce((a, b) => 
    scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
  )[0] as keyof typeof scores;

  return dominantEmotion;
};

const analyzeUrgencyLevel = (message: string, language: 'en' | 'ar'): 'low' | 'medium' | 'high' | 'critical' => {
  const urgencyPatterns = language === 'ar' ? {
    critical: ['فوراً', 'حالاً', 'طارئ', 'عاجل جداً', 'ضروري جداً'],
    high: ['عاجل', 'سريع', 'بسرعة', 'اليوم', 'الآن'],
    medium: ['قريباً', 'هذا الأسبوع', 'خلال أيام', 'في أسرع وقت'],
    low: ['لا يوجد عجلة', 'خلال شهر', 'ما في استعجال', 'متى ما ينفع']
  } : {
    critical: ['immediately', 'urgent', 'asap', 'emergency', 'critical'],
    high: ['soon', 'quickly', 'fast', 'today', 'now'],
    medium: ['this week', 'few days', 'relatively soon', 'within days'],
    low: ['no rush', 'whenever', 'no hurry', 'take time']
  };

  for (const [level, patterns] of Object.entries(urgencyPatterns)) {
    if (patterns.some(pattern => message.toLowerCase().includes(pattern.toLowerCase()))) {
      return level as any;
    }
  }

  // Analyze punctuation and caps for urgency
  const exclamationMarks = (message.match(/!/g) || []).length;
  const capsRatio = message.replace(/\s/g, '').length > 0 ? 
    message.replace(/[^A-Z]/g, '').length / message.replace(/\s/g, '').length : 0;

  if (exclamationMarks > 2 || capsRatio > 0.5) return 'high';
  if (exclamationMarks > 0 || capsRatio > 0.2) return 'medium';
  
  return 'low';
};

const calculateComplexityScore = (message: string, history: ChatMessage[]): number => {
  // Message complexity factors
  const sentences = message.split(/[.!?]/).length;
  const words = message.split(/\s+/).length;
  const avgWordsPerSentence = words / Math.max(sentences, 1);
  
  // Technical terms detection
  const technicalTerms = [
    'api', 'database', 'integration', 'algorithm', 'framework',
    'قاعدة بيانات', 'تكامل', 'خوارزمية', 'إطار عمل', 'برمجة'
  ];
  const technicalScore = technicalTerms.filter(term => 
    message.toLowerCase().includes(term.toLowerCase())
  ).length / technicalTerms.length;

  // Question complexity
  const questionMarks = (message.match(/\?/g) || []).length;
  const questionComplexity = questionMarks > 0 ? Math.min(questionMarks / 3, 1) : 0;

  // Final complexity score
  let complexity = 0;
  if (avgWordsPerSentence > 15) complexity += 0.3;
  if (technicalScore > 0.1) complexity += 0.4;
  if (questionComplexity > 0.3) complexity += 0.3;
  
  return Math.min(complexity, 1);
};

const analyzeTopicProgression = (history: ChatMessage[]): string[] => {
  const topics: string[] = [];
  const topicKeywords = {
    'branding': ['brand', 'logo', 'identity', 'هوية', 'علامة', 'شعار'],
    'website': ['website', 'web', 'site', 'موقع', 'ويب'],
    'marketing': ['marketing', 'promotion', 'ads', 'تسويق', 'ترويج', 'إعلان'],
    'design': ['design', 'ui', 'ux', 'تصميم', 'واجهة'],
    'strategy': ['strategy', 'plan', 'استراتيجية', 'خطة'],
    'pricing': ['price', 'cost', 'budget', 'سعر', 'تكلفة', 'ميزانية']
  };

  history.forEach((message, index) => {
    if (message.sender === 'user') {
      Object.entries(topicKeywords).forEach(([topic, keywords]) => {
        if (keywords.some(keyword => 
          message.message.toLowerCase().includes(keyword.toLowerCase())
        )) {
          if (!topics.includes(topic)) {
            topics.push(topic);
          }
        }
      });
    }
  });

  return topics;
};

const assessConversationQuality = (history: ChatMessage[]): number => {
  if (history.length < 2) return 0.5;

  let qualityScore = 0;
  const userMessages = history.filter(m => m.sender === 'user');
  const aiMessages = history.filter(m => m.sender === 'nujmooz');

  // Message length balance
  const avgUserLength = userMessages.reduce((sum, m) => sum + m.message.length, 0) / userMessages.length;
  const avgAiLength = aiMessages.reduce((sum, m) => sum + m.message.length, 0) / aiMessages.length;
  const lengthBalance = 1 - Math.abs(avgUserLength - avgAiLength) / Math.max(avgUserLength, avgAiLength);
  qualityScore += lengthBalance * 0.3;

  // Engagement indicators
  const questionCount = history.filter(m => m.message.includes('?')).length;
  const engagementScore = Math.min(questionCount / history.length, 0.5);
  qualityScore += engagementScore * 0.4;

  // Response relevance (simplified)
  const responseRelevance = history.length > 4 ? 0.3 : 0.2;
  qualityScore += responseRelevance;

  return Math.min(qualityScore, 1);
};

const estimateUserSatisfaction = (history: ChatMessage[], language: 'en' | 'ar'): number => {
  const satisfactionIndicators = language === 'ar' ? {
    positive: ['شكراً', 'ممتاز', 'رائع', 'مفيد', 'واضح', 'الله يعطيك العافية'],
    negative: ['مو واضح', 'ما فهمت', 'صعب', 'معقد', 'مشكلة']
  } : {
    positive: ['thanks', 'great', 'excellent', 'helpful', 'clear', 'perfect'],
    negative: ['unclear', 'confused', 'difficult', 'problem', 'wrong']
  };

  let satisfactionScore = 0.5; // neutral start
  
  history.filter(m => m.sender === 'user').forEach(message => {
    satisfactionIndicators.positive.forEach(indicator => {
      if (message.message.toLowerCase().includes(indicator.toLowerCase())) {
        satisfactionScore += 0.1;
      }
    });
    
    satisfactionIndicators.negative.forEach(indicator => {
      if (message.message.toLowerCase().includes(indicator.toLowerCase())) {
        satisfactionScore -= 0.1;
      }
    });
  });

  return Math.max(0, Math.min(1, satisfactionScore));
};

const getIntentWeight = (intent: UserIntent, history: ChatMessage[]): number => {
  const recentHistory = history.slice(-3);
  const contextualRelevance = {
    project_inquiry: 1.2,
    service_exploration: 1.1,
    brief_creation: 1.3,
    creative_assistance: 1.1,
    pricing_question: 1.0,
    timeline_discussion: 1.0,
    general_chat: 0.8,
    technical_support: 0.9,
    portfolio_request: 1.0
  };

  return contextualRelevance[intent] || 1.0;
};

const applyContextualBoosting = (
  scores: Record<UserIntent, number>,
  history: ChatMessage[],
  intentHistory: IntentContext[]
) => {
  // Boost based on conversation flow
  if (intentHistory.length > 0) {
    const lastIntent = intentHistory[intentHistory.length - 1].intent;
    
    // Natural progression patterns
    const progressionBoosts = {
      'project_inquiry': ['service_exploration', 'brief_creation'],
      'service_exploration': ['pricing_question', 'brief_creation'],
      'brief_creation': ['creative_assistance', 'timeline_discussion'],
      'pricing_question': ['timeline_discussion', 'brief_creation']
    };

    const boosts = progressionBoosts[lastIntent] || [];
    boosts.forEach(intent => {
      scores[intent as UserIntent] *= 1.3;
    });
  }
};

const applySequentialAnalysis = (
  scores: Record<UserIntent, number>,
  history: ChatMessage[],
  intentHistory: IntentContext[]
) => {
  // Analyze intent patterns in sequence
  if (intentHistory.length >= 2) {
    const pattern = intentHistory.slice(-2).map(h => h.intent).join('-');
    
    const sequentialBoosts = {
      'project_inquiry-service_exploration': 'brief_creation',
      'service_exploration-pricing_question': 'timeline_discussion',
      'brief_creation-creative_assistance': 'portfolio_request'
    };

    const boostIntent = sequentialBoosts[pattern];
    if (boostIntent && scores[boostIntent as UserIntent] !== undefined) {
      scores[boostIntent as UserIntent] *= 1.4;
    }
  }
};

const determineAdvancedConversationPhase = (
  history: ChatMessage[],
  currentIntent: UserIntent,
  intentHistory: IntentContext[]
): 'discovery' | 'qualification' | 'briefing' | 'completion' => {
  if (history.length < 3) return 'discovery';
  
  const recentIntents = intentHistory.slice(-3).map(h => h.intent);
  const userMessages = history.filter(m => m.sender === 'user').length;
  
  // Advanced phase detection
  if (recentIntents.includes('brief_creation') && userMessages > 8) {
    return 'completion';
  }
  
  if (recentIntents.filter(intent => 
    ['brief_creation', 'creative_assistance'].includes(intent)
  ).length >= 2) {
    return 'briefing';
  }
  
  if (recentIntents.filter(intent => 
    ['project_inquiry', 'service_exploration', 'pricing_question'].includes(intent)
  ).length >= 2) {
    return 'qualification';
  }
  
  return 'discovery';
};

export { type EnhancedIntentContext };
