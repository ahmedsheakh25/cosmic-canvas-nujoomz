import { IntentConfig, IntentAnalysis, ServiceMatch, BuyingSignal } from './types';
import { UserInput, SessionContext } from '../NujmoozEngine/types';
import { servicesMap, ServiceKey } from '@/services_instructions';

export class IntentAnalyzer {
  private config: IntentConfig;
  private serviceHistory: Map<string, ServiceKey[]>;

  constructor(config?: Partial<IntentConfig>) {
    this.config = {
      minServiceMatchConfidence: 0.6,
      maxServicesToReturn: 3,
      enableContextualMatching: true,
      ...config
    };
    this.serviceHistory = new Map();
  }

  async analyzeIntent(input: UserInput, context: SessionContext): Promise<IntentAnalysis> {
    try {
      // Match services based on tags
      const matchedServices = await this.matchServices(input, context);

      // Analyze buying signals
      const buyingSignals = this.detectBuyingSignals(input);

      // Extract user goals
      const userGoals = this.extractUserGoals(input);

      // Get service history
      const previousServices = this.getServiceHistory(context.sessionId);

      return {
        matchedServices,
        buyingIntent: {
          score: this.calculateBuyingScore(buyingSignals),
          signals: buyingSignals,
          confidence: this.calculateConfidence(buyingSignals)
        },
        userGoals,
        context: {
          previousServices,
          userPreferences: this.extractUserPreferences(input, context),
          sessionContext: {
            currentPhase: this.determineConversationPhase(context),
            interactionCount: context.conversationHistory.length
          }
        },
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error in intent analysis:', error);
      return this.getFallbackAnalysis();
    }
  }

  private async matchServices(input: UserInput, context: SessionContext): Promise<ServiceMatch[]> {
    const content = input.content.toLowerCase();
    const matches: ServiceMatch[] = [];

    // Process each service
    Object.entries(servicesMap).forEach(([serviceKey, service]) => {
      const matchedTags: string[] = [];
      let tagMatchScore = 0;

      // Check each tag for the service
      service.tags.forEach(tag => {
        // Get keywords for this tag (could be expanded to a more sophisticated system)
        const keywords = this.getTagKeywords(tag);
        
        // Check if any keywords match
        const matched = keywords.some(keyword => content.includes(keyword.toLowerCase()));
        if (matched) {
          matchedTags.push(tag);
          tagMatchScore += 1;
        }
      });

      // Calculate base confidence from tag matches
      const baseConfidence = tagMatchScore / service.tags.length;

      // Add contextual scoring if enabled
      const contextualScore = this.config.enableContextualMatching
        ? this.calculateContextualScore(serviceKey as ServiceKey, context)
        : 0;

      // Calculate final confidence
      const confidence = (baseConfidence * 0.7) + (contextualScore * 0.3);

      if (confidence >= this.config.minServiceMatchConfidence) {
        matches.push({
          serviceKey: serviceKey as ServiceKey,
          confidence,
          matchedTags,
          contextualScore
        });
      }
    });

    // Sort by confidence and limit results
    return matches
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, this.config.maxServicesToReturn);
  }

  private getTagKeywords(tag: string): string[] {
    // Map tags to relevant keywords in both English and Arabic
    const tagKeywordMap: Record<string, string[]> = {
      'branding': ['brand', 'logo', 'identity', 'هوية', 'شعار', 'براند'],
      'marketing-strategy': ['marketing', 'strategy', 'campaign', 'تسويق', 'استراتيجية', 'حملة'],
      'social-media': ['social', 'instagram', 'twitter', 'سوشيال', 'انستقرام', 'تويتر'],
      'copywriting': ['content', 'copy', 'writing', 'محتوى', 'كتابة', 'نصوص'],
      'arabic-speaking': ['arabic', 'local', 'gulf', 'عربي', 'خليجي', 'محلي'],
      'modern': ['modern', 'contemporary', 'عصري', 'حديث'],
      'playful': ['fun', 'playful', 'creative', 'مرح', 'إبداعي'],
      'luxury': ['luxury', 'premium', 'فاخر', 'مميز'],
      // Add more tag mappings as needed
    };

    return tagKeywordMap[tag] || [tag];
  }

  private calculateContextualScore(serviceKey: ServiceKey, context: SessionContext): number {
    let score = 0;

    // Check service history
    const history = this.getServiceHistory(context.sessionId);
    if (history.includes(serviceKey)) {
      score += 0.2; // Boost for previously used services
    }

    // Check conversation phase
    const phase = this.determineConversationPhase(context);
    if (phase === 'discovery' && serviceKey === 'custom_project') {
      score += 0.3; // Boost for discovery-phase appropriate services
    }

    // Add more contextual scoring rules as needed

    return Math.min(score, 1); // Cap at 1.0
  }

  private detectBuyingSignals(input: UserInput): BuyingSignal[] {
    const content = input.content.toLowerCase();
    const signals: BuyingSignal[] = [];

    // Direct buying signals
    const directSignals = {
      high: ['أبغى أطلب', 'أريد أن أبدأ', 'كم السعر', 'want to start', 'how much', 'price'],
      medium: ['متى نقدر نبدأ', 'عندي ميزانية', 'when can we start', 'budget'],
      low: ['ممكن', 'maybe later', 'بفكر', 'thinking about']
    };

    // Indirect buying signals
    const indirectSignals = {
      high: ['urgent', 'عاجل', 'asap', 'بأسرع وقت'],
      medium: ['soon', 'قريباً', 'next week', 'الأسبوع الجاي'],
      low: ['eventually', 'في المستقبل', 'later', 'بعدين']
    };

    // Check direct signals
    Object.entries(directSignals).forEach(([intensity, keywords]) => {
      if (keywords.some(k => content.includes(k))) {
        signals.push({
          type: 'direct',
          intensity: intensity as 'low' | 'medium' | 'high',
          confidence: 0.8,
        });
      }
    });

    // Check indirect signals
    Object.entries(indirectSignals).forEach(([intensity, keywords]) => {
      if (keywords.some(k => content.includes(k))) {
        signals.push({
          type: 'indirect',
          intensity: intensity as 'low' | 'medium' | 'high',
          confidence: 0.6,
        });
      }
    });

    return signals;
  }

  private calculateBuyingScore(signals: BuyingSignal[]): number {
    if (!signals.length) return 0;

    const intensityWeights = {
      high: 1,
      medium: 0.6,
      low: 0.3
    };

    const typeWeights = {
      direct: 1,
      indirect: 0.7
    };

    const scores = signals.map(signal => 
      intensityWeights[signal.intensity] * typeWeights[signal.type] * signal.confidence
    );

    return Math.min(1, scores.reduce((a, b) => a + b, 0) / signals.length);
  }

  private calculateConfidence(signals: BuyingSignal[]): number {
    if (!signals.length) return 0.5;
    return signals.reduce((acc, signal) => acc + signal.confidence, 0) / signals.length;
  }

  private extractUserGoals(input: UserInput): string[] {
    // TODO: Implement goal extraction
    return [];
  }

  private getServiceHistory(sessionId: string): ServiceKey[] {
    return this.serviceHistory.get(sessionId) || [];
  }

  private extractUserPreferences(input: UserInput, context: SessionContext) {
    // TODO: Implement preference extraction
    return {};
  }

  private determineConversationPhase(context: SessionContext): string {
    const messageCount = context.conversationHistory.length;
    
    if (messageCount <= 2) return 'discovery';
    if (messageCount <= 5) return 'exploration';
    return 'engagement';
  }

  private getFallbackAnalysis(): IntentAnalysis {
    return {
      matchedServices: [],
      buyingIntent: {
        score: 0,
        signals: [],
        confidence: 0.5
      },
      userGoals: [],
      context: {},
      timestamp: new Date()
    };
  }
} 