export interface ProcessorChatMessage {
  id: string;
  sender: 'user' | 'nujmooz';
  content: string;
  timestamp: Date;
  generatedFiles?: string[];
}

export interface MessageProcessorProps {
  sessionId: string | undefined;
  onAddMessage: (message: ProcessorChatMessage) => void;
  onSetLoading: (loading: boolean) => void;
  detectLanguage: (text: string) => 'ar' | 'en';
}

export interface MessageProcessorState {
  processMessage: (messageToSend: string) => Promise<void>;
  suggestedReplies: string[];
  setSuggestedReplies: (replies: string[]) => void;
}

export interface MessageResponse {
  response?: string;
  error?: {
    message: string;
  };
} 