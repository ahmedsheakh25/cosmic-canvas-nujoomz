import { Question, QuestionFlow, QuestionContext, RenderedQuestion } from './types';
import { ServiceKey, servicesMap } from '@/services_instructions';
import { Language } from '../NujmoozEngine/types';

export class ServiceQuestionRenderer {
  private questionFlows: Map<ServiceKey, QuestionFlow>;
  private currentFlow: QuestionFlow | null;
  private currentPosition: number;

  constructor() {
    this.questionFlows = new Map();
    this.currentFlow = null;
    this.currentPosition = 0;
    this.initializeQuestionFlows();
  }

  startFlow(serviceKey: ServiceKey): boolean {
    const flow = this.questionFlows.get(serviceKey);
    if (!flow) return false;

    this.currentFlow = flow;
    this.currentPosition = 0;
    return true;
  }

  getCurrentQuestion(context: QuestionContext): RenderedQuestion | null {
    if (!this.currentFlow) return null;

    const question = this.findNextValidQuestion(context);
    if (!question) return null;

    return this.renderQuestion(question, context);
  }

  private findNextValidQuestion(context: QuestionContext): Question | null {
    if (!this.currentFlow) return null;

    for (let i = this.currentPosition; i < this.currentFlow.questions.length; i++) {
      const question = this.currentFlow.questions[i];
      
      if (this.shouldDisplayQuestion(question, context)) {
        this.currentPosition = i;
        return question;
      }
    }

    return null;
  }

  private shouldDisplayQuestion(question: Question, context: QuestionContext): boolean {
    if (!question.conditionalDisplay) return true;

    const { dependsOn, showWhen } = question.conditionalDisplay;
    const dependentAnswer = context.previousAnswers[dependsOn];

    if (typeof showWhen === 'function') {
      return showWhen(dependentAnswer);
    }

    return dependentAnswer === showWhen;
  }

  private renderQuestion(question: Question, context: QuestionContext): RenderedQuestion {
    const { language } = context;
    
    return {
      question,
      renderedText: this.localizeText(question.text[language], context),
      validationRules: this.getValidationRules(question),
      metadata: {
        position: this.currentPosition + 1,
        total: this.getTotalQuestions(context),
        estimatedTimeLeft: this.calculateEstimatedTime()
      }
    };
  }

  private localizeText(text: string, context: QuestionContext): string {
    // Replace variables in text with context values
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      if (key === 'emotion' && context.emotionalState) {
        return context.emotionalState.primaryEmotion;
      }
      return context.previousAnswers[key] || match;
    });
  }

  private getValidationRules(question: Question): Record<string, any> {
    const rules: Record<string, any> = {};

    if (question.validation) {
      Object.entries(question.validation).forEach(([key, value]) => {
        rules[key] = value;
      });
    }

    // Add type-specific validation
    switch (question.type) {
      case 'choice':
        rules.oneOf = question.options?.map(opt => opt.value);
        break;
      case 'multiChoice':
        rules.isArray = true;
        rules.items = {
          oneOf: question.options?.map(opt => opt.value)
        };
        break;
      case 'scale':
        rules.type = 'number';
        break;
    }

    return rules;
  }

  private getTotalQuestions(context: QuestionContext): number {
    if (!this.currentFlow) return 0;

    return this.currentFlow.questions.filter(q => 
      this.shouldDisplayQuestion(q, context)
    ).length;
  }

  private calculateEstimatedTime(): number {
    if (!this.currentFlow) return 0;

    const { estimatedDuration } = this.currentFlow.metadata;
    const progress = this.currentPosition / this.currentFlow.questions.length;
    
    return Math.ceil(estimatedDuration * (1 - progress));
  }

  private initializeQuestionFlows() {
    // Initialize question flows for each service
    Object.entries(servicesMap).forEach(([key, service]) => {
      this.questionFlows.set(key as ServiceKey, {
        serviceKey: key as ServiceKey,
        questions: this.generateQuestionsForService(service),
        metadata: {
          estimatedDuration: this.calculateServiceDuration(service),
          complexity: this.determineComplexity(service)
        }
      });
    });
  }

  private generateQuestionsForService(service: any): Question[] {
    const questions: Question[] = [];

    // Add general questions
    questions.push({
      id: 'project_name',
      text: {
        en: 'What would you like to name your {{service}} project?',
        ar: 'ما هو الاسم الذي تريد إطلاقه على مشروع {{service}}؟'
      },
      type: 'text',
      validation: {
        required: true,
        min: 3,
        max: 100
      }
    });

    // Add service-specific questions
    if (service.subServices) {
      questions.push({
        id: 'sub_service',
        text: {
          en: 'Which specific aspect of {{service}} are you interested in?',
          ar: 'ما هو الجانب المحدد من {{service}} الذي يهمك؟'
        },
        type: 'choice',
        options: Object.entries(service.subServices).map(([value, subService]: [string, any]) => ({
          value,
          label: subService.label
        }))
      });
    }

    // Add timeline question
    questions.push({
      id: 'timeline',
      text: {
        en: 'When would you like to complete this project?',
        ar: 'متى تريد إنجاز هذا المشروع؟'
      },
      type: 'choice',
      options: [
        {
          value: 'urgent',
          label: {
            en: 'As soon as possible',
            ar: 'في أقرب وقت ممكن'
          }
        },
        {
          value: 'normal',
          label: {
            en: 'Within a month',
            ar: 'خلال شهر'
          }
        },
        {
          value: 'flexible',
          label: {
            en: 'No urgent deadline',
            ar: 'لا يوجد موعد نهائي عاجل'
          }
        }
      ]
    });

    return questions;
  }

  private calculateServiceDuration(service: any): number {
    // Base duration in minutes
    let duration = 5;

    // Add time for each subservice
    if (service.subServices) {
      duration += Object.keys(service.subServices).length * 2;
    }

    // Add time for complexity
    switch (this.determineComplexity(service)) {
      case 'complex':
        duration += 10;
        break;
      case 'moderate':
        duration += 5;
        break;
      default:
        break;
    }

    return duration;
  }

  private determineComplexity(service: any): 'simple' | 'moderate' | 'complex' {
    const subServiceCount = service.subServices ? Object.keys(service.subServices).length : 0;
    
    if (subServiceCount > 5) return 'complex';
    if (subServiceCount > 2) return 'moderate';
    return 'simple';
  }
} 