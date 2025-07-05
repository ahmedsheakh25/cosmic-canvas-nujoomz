import { Language } from '@/core/NujmoozEngine/types';
import { RenderedQuestion } from '@/core/ServiceQuestionRenderer/types';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    emotion?: string;
    service?: string;
    isVoice?: boolean;
    [key: string]: any;
  };
}

export interface ConversationUIProps {
  messages: Message[];
  currentQuestion?: RenderedQuestion;
  isProcessing?: boolean;
  language: Language;
  onSendMessage: (content: string, type: 'text' | 'voice') => void;
  onAnswerQuestion?: (questionId: string, answer: any) => void;
  className?: string;
}

export interface MessageListProps {
  messages: Message[];
  language: Language;
  className?: string;
}

export interface MessageInputProps {
  onSend: (content: string, type: 'text' | 'voice') => void;
  isProcessing?: boolean;
  language: Language;
  className?: string;
}

export interface MessageBubbleProps {
  message: Message;
  language: Language;
  className?: string;
} 