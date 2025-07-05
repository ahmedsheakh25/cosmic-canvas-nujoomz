import { Question, RenderedQuestion } from '@/core/ServiceQuestionRenderer/types';
import { Language } from '@/core/NujmoozEngine/types';

export interface QuestionFlowProps {
  currentQuestion: RenderedQuestion | null;
  language: Language;
  onAnswer: (questionId: string, answer: any) => void;
  onComplete: () => void;
  isLoading?: boolean;
  className?: string;
}

export interface QuestionInputProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  language: Language;
  disabled?: boolean;
} 