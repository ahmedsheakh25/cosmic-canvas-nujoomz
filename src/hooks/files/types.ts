import { ChatMessage } from '@/utils/sessionManager';
import { GeneratedFile, FileProcessingResult } from '@/types/files';

export type FileType = 'brief' | 'ideas' | 'names' | 'strategy' | 'tone' | 'colors';

export interface FileTypeConfig {
  type: FileType;
  condition: boolean;
}

export interface FileState {
  generatedFiles: GeneratedFile[];
  isProcessingFiles: boolean;
  processMessageForFiles: (message: ChatMessage) => Promise<FileProcessingResult>;
}

export interface UseFileProcessingProps {
  onSetGeneratedFiles: (files: GeneratedFile[]) => void;
  onSetProcessingStatus: (status: boolean) => void;
} 