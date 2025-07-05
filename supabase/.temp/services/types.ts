export interface Label {
  en: string;
  ar: string;
}

export interface Question {
  key: string;
  type: 'text' | 'multi-choice' | 'file';
  required: boolean;
  label: Label;
  options?: Array<Label>;
  multiple?: boolean;
  fileTypes?: string[];
}

export interface SubService {
  label: Label;
  questions: Question[];
  suggestMoodboard?: boolean;
  suggestPalettes?: string;
  relatedTo?: string[];
  tone?: string;
}

export interface Service {
  label: Label;
  description: Label;
  tags: string[];
  tone?: string;
  suggestMoodboard?: boolean;
  suggestPalettes?: string;
  subServices: {
    [key: string]: SubService;
  };
}

export interface ServicesMap {
  [key: string]: Service;
} 