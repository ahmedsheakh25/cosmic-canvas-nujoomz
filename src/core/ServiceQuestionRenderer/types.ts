import { ServiceKey } from '@/services_instructions';
import { Language } from '../NujmoozEngine/types';

export interface Question {
  id: string;
  text: Record<Language, string>;
  type: 'text' | 'choice' | 'multiChoice' | 'scale';
  options?: Array<{
    value: string;
    label: Record<Language, string>;
  }>;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
  conditionalDisplay?: {
    dependsOn: string;
    showWhen: any;
  };
}

export interface QuestionFlow {
  serviceKey: ServiceKey;
  questions: Question[];
  metadata: {
    estimatedDuration: number;
    complexity: 'simple' | 'moderate' | 'complex';
  };
}

export interface QuestionContext {
  language: Language;
  previousAnswers: Record<string, any>;
  emotionalState?: {
    primaryEmotion: string;
    intensity: number;
  };
}

export interface RenderedQuestion {
  question: Question;
  renderedText: string;
  validationRules: Record<string, any>;
  metadata: {
    position: number;
    total: number;
    estimatedTimeLeft: number;
  };
} 