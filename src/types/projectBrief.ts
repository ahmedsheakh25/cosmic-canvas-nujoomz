
export interface ProjectBrief {
  service: string;
  answers: Record<string, string>;
  clientInfo: {
    name?: string;
    email?: string;
    phone?: string;
  };
  status: 'collecting' | 'generating' | 'complete';
  progress?: number;
}

export interface BriefData extends ProjectBrief {
  language: 'en' | 'ar';
  sessionId?: string;
}
