export type Language = 'en' | 'ar';

export type QuestionType = 'text' | 'multi-choice' | 'file';

export interface Question {
  key: string;
  type: QuestionType;
  required: boolean;
  label: Record<Language, string>;
  options?: Array<Record<Language, string>>;
  fileTypes?: string[];
  multiple?: boolean;
}

export interface SubServiceData {
  label: Record<Language, string>;
  suggestMoodboard?: boolean;
  suggestPalettes?: string | boolean;
  relatedTo?: string[];
  tone?: string;
  questions: Question[];
}

export interface ServiceData {
  label: Record<Language, string>;
  description: Record<Language, string>;
  tags: string[];
  tone?: string;
  suggestMoodboard?: boolean;
  suggestPalettes?: string | boolean;
  subServices: Record<string, SubServiceData>;
}

// ServiceKey will be defined in index.ts after servicesMap is created