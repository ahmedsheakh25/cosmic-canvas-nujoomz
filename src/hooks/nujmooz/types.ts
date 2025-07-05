import { GeneratedFile } from '@/types/files';
import { ChatMessage as SessionChatMessage } from '@/utils/sessionManager';

export type FileAction = 'view' | 'edit' | 'export' | 'copy' | 'duplicate' | 'delete' | 'favorite';

export interface FileProcessingResult {
  success: boolean;
  files: GeneratedFile[];
  error?: string;
}

export interface ConversationChatMessage {
  id: string;
  sender: 'user' | 'nujmooz';
  content: string;
  timestamp: Date;
  generatedFiles?: string[];
}

export interface NujmoozState {
  // Session
  sessionId: string;

  // Conversation
  messages: ConversationChatMessage[];
  inputMessage: string;
  isLoading: boolean;
  setInputMessage: (message: string) => void;
  clearInput: () => void;
  addMessage: (message: ConversationChatMessage) => void;
  detectLanguage: (text: string) => string;

  // Interface
  isRightPanelOpen: boolean;
  openRightPanel: () => void;
  closeRightPanel: () => void;

  // Files
  generatedFiles: GeneratedFile[];
  isProcessingFiles: boolean;

  // Message Processing
  suggestedReplies: string[];

  // Actions
  handleSendMessage: (content?: string) => Promise<void>;
  handleFileAction: (fileId: string, action: FileAction) => void;
}

export interface MessageHandlerProps {
  sessionId: string;
  inputMessage: string;
  clearInput: () => void;
  isLoading: boolean;
  detectLanguage: (text: string) => string;
  processMessage: (message: string) => Promise<void>;
  processMessageForFiles: (message: SessionChatMessage) => Promise<FileProcessingResult>;
} 