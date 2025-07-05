import { PromptConfig, PromptContext, ServicePrompt, PromptTemplate, GeneratedPrompt } from './types';
import { servicesMap, ServiceKey } from '@/services_instructions';
import { UserInput, SessionContext } from '../NujmoozEngine/types';

export class PromptManager {
  private config: PromptConfig;
  private templates: Map<string, PromptTemplate>;
  private servicePrompts: Map<ServiceKey, ServicePrompt>;

  constructor(config?: Partial<PromptConfig>) {
    this.config = {
      maxTokens: 2000,
      temperature: 0.7,
      enableMemory: true,
      defaultLanguage: 'ar',
      ...config
    };
    
    this.templates = new Map();
    this.servicePrompts = new Map();
    this.initializePrompts();
  }

  async selectPrompt(context: {
    input: UserInput;
    emotionalState: any;
    serviceContext: any;
    context: SessionContext;
  }): Promise<string> {
    try {
      // Get matched services
      const serviceMatches = context.serviceContext.detectedServices || [];
      
      // Build prompt context
      const promptContext: PromptContext = {
        serviceMatches,
        emotionalState: context.emotionalState,
        language: context.input.language || this.config.defaultLanguage,
        userPreferences: context.context.metadata?.userPreferences,
        conversationHistory: context.context.conversationHistory
      };

      // Generate base prompt
      const basePrompt = await this.generateBasePrompt(promptContext);

      // Apply emotional adjustments
      const emotionalPrompt = this.applyEmotionalContext(basePrompt, promptContext);

      // Apply service-specific adjustments
      const servicePrompt = this.applyServiceContext(emotionalPrompt, promptContext);

      // Format final prompt
      return this.formatPrompt(servicePrompt, promptContext);
    } catch (error) {
      console.error('Error selecting prompt:', error);
      return this.getFallbackPrompt(context.input.language || this.config.defaultLanguage);
    }
  }

  private initializePrompts() {
    // Initialize service-specific prompts
    Object.entries(servicesMap).forEach(([key, service]) => {
      this.servicePrompts.set(key as ServiceKey, {
        serviceKey: key as ServiceKey,
        basePrompt: {
          en: this.generateServicePrompt(service, 'en'),
          ar: this.generateServicePrompt(service, 'ar')
        },
        tone: service.tone || 'neutral'
      });
    });

    // Initialize general templates
    this.templates.set('discovery', {
      id: 'discovery',
      type: 'general',
      content: {
        en: 'I understand you\'re interested in {{service}}. Could you tell me more about your project?',
        ar: 'فهمت إنك مهتم بـ {{service}}. ممكن تخبرني أكثر عن مشروعك؟'
      },
      variables: ['service'],
      tone: 'friendly'
    });

    // Add more templates as needed
  }

  private generateServicePrompt(service: any, language: 'en' | 'ar'): string {
    const basePrompt = language === 'ar' 
      ? `أنا مساعد متخصص في ${service.label[language]}. ${service.description[language]}`
      : `I'm a specialist in ${service.label[language]}. ${service.description[language]}`;

    // Add service-specific context
    const contextPrompt = this.generateServiceContext(service, language);

    return `${basePrompt}\n\n${contextPrompt}`;
  }

  private generateServiceContext(service: any, language: 'en' | 'ar'): string {
    const subServices = Object.values(service.subServices || {});
    
    if (language === 'ar') {
      return subServices.length
        ? 'يمكنني مساعدتك في:\n' + subServices.map((s: any) => `- ${s.label.ar}`).join('\n')
        : '';
    }

    return subServices.length
      ? 'I can help you with:\n' + subServices.map((s: any) => `- ${s.label.en}`).join('\n')
      : '';
  }

  private async generateBasePrompt(context: PromptContext): Promise<GeneratedPrompt> {
    const primaryService = context.serviceMatches[0];
    const servicePrompt = primaryService 
      ? this.servicePrompts.get(primaryService.serviceKey)
      : null;

    return {
      content: servicePrompt
        ? servicePrompt.basePrompt[context.language]
        : this.getGeneralPrompt(context.language),
      context: {
        service: primaryService?.serviceKey,
        tone: servicePrompt?.tone || 'neutral',
        language: context.language
      },
      metadata: {
        timestamp: new Date(),
        confidence: primaryService?.confidence || 0.5
      }
    };
  }

  private applyEmotionalContext(
    prompt: GeneratedPrompt,
    context: PromptContext
  ): GeneratedPrompt {
    const { primaryEmotion } = context.emotionalState;
    let content = prompt.content;

    // Adjust tone based on emotional state
    if (primaryEmotion.type === 'frustrated') {
      content = this.addEmpathy(content, context.language);
    } else if (primaryEmotion.type === 'excited') {
      content = this.addEnthusiasm(content, context.language);
    }

    return {
      ...prompt,
      content,
      context: {
        ...prompt.context,
        emotion: primaryEmotion.type
      }
    };
  }

  private applyServiceContext(
    prompt: GeneratedPrompt,
    context: PromptContext
  ): GeneratedPrompt {
    let content = prompt.content;

    // Add service-specific adjustments
    if (context.serviceMatches.length > 0) {
      const service = context.serviceMatches[0];
      content = this.addServiceSpecifics(content, service, context.language);
    }

    return {
      ...prompt,
      content,
      metadata: {
        ...prompt.metadata,
        serviceMatches: context.serviceMatches
      }
    };
  }

  private addEmpathy(content: string, language: 'en' | 'ar'): string {
    const empathy = language === 'ar'
      ? 'أتفهم شعورك. دعني أساعدك في إيجاد الحل المناسب.'
      : 'I understand your concern. Let me help you find the right solution.';
    
    return `${empathy}\n\n${content}`;
  }

  private addEnthusiasm(content: string, language: 'en' | 'ar'): string {
    const enthusiasm = language === 'ar'
      ? 'رائع! أنا متحمس لمساعدتك في تحقيق هدفك.'
      : 'That\'s exciting! I\'m thrilled to help you achieve your goal.';
    
    return `${enthusiasm}\n\n${content}`;
  }

  private addServiceSpecifics(
    content: string,
    service: any,
    language: 'en' | 'ar'
  ): string {
    const servicePrompt = this.servicePrompts.get(service.serviceKey);
    if (!servicePrompt) return content;

    const specifics = language === 'ar'
      ? `بناءً على احتياجاتك، أقترح التركيز على ${service.serviceKey}.`
      : `Based on your needs, I suggest we focus on ${service.serviceKey}.`;

    return `${content}\n\n${specifics}`;
  }

  private formatPrompt(prompt: GeneratedPrompt, context: PromptContext): string {
    let content = prompt.content;

    // Replace variables
    content = content.replace(/{{(\w+)}}/g, (match, variable) => {
      switch (variable) {
        case 'service':
          return context.serviceMatches[0]?.serviceKey || '';
        case 'emotion':
          return context.emotionalState.primaryEmotion.type;
        default:
          return match;
      }
    });

    return content;
  }

  private getGeneralPrompt(language: 'en' | 'ar'): string {
    return language === 'ar'
      ? 'مرحباً! كيف يمكنني مساعدتك اليوم؟'
      : 'Hello! How can I assist you today?';
  }

  private getFallbackPrompt(language: 'en' | 'ar'): string {
    return language === 'ar'
      ? 'عذراً، هل يمكنك إعادة صياغة طلبك؟'
      : 'I apologize, could you rephrase your request?';
  }
} 