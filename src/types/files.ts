import { ChatMessage } from '@/utils/sessionManager';

export type FileType = 'brief' | 'ideas' | 'names' | 'tone' | 'colors' | 'strategy';

export interface AIAnalysis {
  quality: number;
  completeness: number;
  relevance: number;
  suggestions: string[];
}

export interface GeneratedFile {
  id: string;
  title: string;
  type: FileType;
  content: string;
  summary: string;
  createdAt: Date;
  lastModified?: Date;
  isFavorite?: boolean;
  aiAnalysis?: AIAnalysis;
}

export interface ContentAnalysisResult {
  containsBrief: boolean;
  containsIdeas: boolean;
  containsNames: boolean;
  containsStrategy: boolean;
  containsToneAnalysis: boolean;
  containsColorSuggestions: boolean;
  sentiment: number;
  complexity: number;
  keywords: string[];
}

export interface FileProcessingResult {
  success: boolean;
  files: GeneratedFile[];
  error?: string;
} 