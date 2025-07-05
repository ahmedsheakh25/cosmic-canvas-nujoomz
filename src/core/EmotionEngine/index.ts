import { EmotionConfig, EmotionAnalysis, EmotionHistory, EmotionPattern, EmotionIntensity } from './types';
import { UserInput, SessionContext } from '../NujmoozEngine/types';

export class EmotionProcessor {
  private config: EmotionConfig;
  private emotionHistory: Map<string, EmotionHistory>;

  constructor(config?: Partial<EmotionConfig>) {
    this.config = {
      minConfidence: 0.6,
      enableSecondaryEmotions: true,
      contextTracking: true,
      ...config
    };
    this.emotionHistory = new Map();
  }

  async analyzeEmotion(input: UserInput, context: SessionContext): Promise<EmotionAnalysis> {
    try {
      // Get emotional signals from input
      const signals = await this.extractEmotionalSignals(input);
      
      // Get historical context
      const history = this.getEmotionalHistory(context.sessionId);
      
      // Analyze primary emotion
      const primaryEmotion = this.determinePrimaryEmotion(signals, history);
      
      // Analyze secondary emotions if enabled
      const secondaryEmotions = this.config.enableSecondaryEmotions
        ? this.determineSecondaryEmotions(signals, primaryEmotion)
        : [];

      // Update emotional history
      const pattern: EmotionPattern = {
        signals,
        timestamp: new Date(),
        context: {
          input: input.content,
          language: input.language,
          ...context
        }
      };
      this.updateEmotionalHistory(context.sessionId, pattern);

      return {
        primaryEmotion,
        secondaryEmotions,
        context: {
          previousEmotions: history,
          situationalFactors: this.extractSituationalFactors(input, context),
          culturalContext: this.extractCulturalContext(input, context)
        },
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error in emotion analysis:', error);
      return this.getFallbackAnalysis();
    }
  }

  private async extractEmotionalSignals(input: UserInput): Promise<EmotionPattern['signals']> {
    // TODO: Implement actual emotional signal extraction using NLP
    // For now, return a basic analysis based on keywords
    const content = input.content.toLowerCase();
    const signals: EmotionPattern['signals'] = [];

    // Basic emotion keywords (to be expanded)
    const emotionKeywords = {
      happy: ['سعيد', 'فرحان', 'مبسوط', 'happy', 'excited', 'great'],
      frustrated: ['محبط', 'متضايق', 'frustrated', 'annoyed', 'confused'],
      urgent: ['عاجل', 'سريع', 'urgent', 'quickly', 'asap'],
      curious: ['متحمس', 'مهتم', 'interested', 'curious', 'tell me more'],
      uncertain: ['متردد', 'مش متأكد', 'unsure', 'maybe', 'not sure']
    };

    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      if (keywords.some(keyword => content.includes(keyword))) {
        signals.push({
          type: emotion,
          intensity: this.determineIntensity(content, keywords),
          confidence: 0.8, // TODO: Implement proper confidence scoring
        });
      }
    });

    return signals;
  }

  private determineIntensity(content: string, keywords: string[]): EmotionIntensity {
    const matchCount = keywords.filter(k => content.includes(k)).length;
    if (matchCount > 2) return 'high';
    if (matchCount > 1) return 'medium';
    return 'low';
  }

  private determinePrimaryEmotion(
    signals: EmotionPattern['signals'],
    history?: EmotionHistory
  ) {
    if (!signals.length) {
      return {
        type: 'neutral',
        intensity: 'medium' as EmotionIntensity,
        confidence: 0.7
      };
    }

    // Sort by confidence and intensity
    const sortedSignals = [...signals].sort((a, b) => {
      const intensityScore = { high: 3, medium: 2, low: 1 };
      const aScore = a.confidence * intensityScore[a.intensity];
      const bScore = b.confidence * intensityScore[b.intensity];
      return bScore - aScore;
    });

    return {
      type: sortedSignals[0].type,
      intensity: sortedSignals[0].intensity,
      confidence: sortedSignals[0].confidence
    };
  }

  private determineSecondaryEmotions(
    signals: EmotionPattern['signals'],
    primaryEmotion: EmotionAnalysis['primaryEmotion']
  ) {
    return signals
      .filter(s => s.type !== primaryEmotion.type)
      .map(s => ({
        type: s.type,
        intensity: s.intensity,
        confidence: s.confidence * 0.8 // Reduce confidence for secondary emotions
      }))
      .slice(0, 2); // Limit to top 2 secondary emotions
  }

  private getEmotionalHistory(sessionId: string): EmotionHistory {
    return this.emotionHistory.get(sessionId) || { patterns: [] };
  }

  private updateEmotionalHistory(sessionId: string, pattern: EmotionPattern) {
    const history = this.getEmotionalHistory(sessionId);
    history.patterns.push(pattern);
    
    // Keep only last 10 patterns
    if (history.patterns.length > 10) {
      history.patterns = history.patterns.slice(-10);
    }

    // Update emotional trend
    history.dominantEmotion = this.calculateDominantEmotion(history.patterns);
    history.emotionalTrend = this.calculateEmotionalTrend(history.patterns);

    this.emotionHistory.set(sessionId, history);
  }

  private calculateDominantEmotion(patterns: EmotionPattern[]): string {
    const emotionCounts = patterns.reduce((acc, pattern) => {
      pattern.signals.forEach(signal => {
        acc[signal.type] = (acc[signal.type] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'neutral';
  }

  private calculateEmotionalTrend(patterns: EmotionPattern[]): string {
    // TODO: Implement trend analysis
    return 'stable';
  }

  private extractSituationalFactors(input: UserInput, context: SessionContext) {
    // TODO: Implement situational context extraction
    return {};
  }

  private extractCulturalContext(input: UserInput, context: SessionContext) {
    return {
      language: input.language || context.language,
      region: 'gulf', // TODO: Implement proper region detection
      formalityLevel: 'casual' // TODO: Implement formality analysis
    };
  }

  private getFallbackAnalysis(): EmotionAnalysis {
    return {
      primaryEmotion: {
        type: 'neutral',
        intensity: 'medium',
        confidence: 0.5
      },
      secondaryEmotions: [],
      context: {
        previousEmotions: { patterns: [] }
      },
      timestamp: new Date()
    };
  }
} 