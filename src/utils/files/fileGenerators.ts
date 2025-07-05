import { GeneratedFile, AIAnalysis, ContentAnalysisResult } from '@/types/files';

const calculateQualityScore = (content: string, analysis: ContentAnalysisResult): number => {
  const lengthScore = Math.min(1, content.length / 1000);
  const keywordsScore = analysis.keywords.length / 10;
  const complexityScore = 1 - Math.abs(0.7 - analysis.complexity);
  return (lengthScore + keywordsScore + complexityScore) / 3;
};

const calculateCompletenessScore = (content: string): number => {
  const sections = content.split(/\n\s*\n/);
  const hasIntro = sections.length > 0;
  const hasBody = sections.length > 2;
  const hasConclusion = sections.length > 3;
  return (hasIntro ? 0.3 : 0) + (hasBody ? 0.4 : 0) + (hasConclusion ? 0.3 : 0);
};

const calculateRelevanceScore = (content: string, analysis: ContentAnalysisResult): number => {
  return (analysis.sentiment + 1) / 2;
};

const generateImprovementSuggestions = (content: string, analysis: ContentAnalysisResult): string[] => {
  const suggestions: string[] = [];
  
  if (analysis.complexity > 0.8) {
    suggestions.push('Consider simplifying the language for better clarity');
  }
  if (analysis.complexity < 0.3) {
    suggestions.push('Add more detailed explanations to enhance understanding');
  }
  if (analysis.sentiment < 0) {
    suggestions.push('Consider using more positive language');
  }
  
  return suggestions;
};

const enhanceContentWithAI = (content: string, type: string): string => {
  // Add formatting and structure based on content type
  const sections = content.split(/\n\s*\n/);
  return sections
    .map(section => section.trim())
    .filter(Boolean)
    .join('\n\n');
};

const generateIntelligentSummary = (content: string, type: string): string => {
  const firstParagraph = content.split(/\n\s*\n/)[0] || '';
  return firstParagraph.length > 150 
    ? firstParagraph.slice(0, 147) + '...'
    : firstParagraph;
};

export const createFile = async (
  content: string,
  type: string,
  analysis: ContentAnalysisResult
): Promise<GeneratedFile> => {
  const aiAnalysis: AIAnalysis = {
    quality: calculateQualityScore(content, analysis),
    completeness: calculateCompletenessScore(content),
    relevance: calculateRelevanceScore(content, analysis),
    suggestions: generateImprovementSuggestions(content, analysis)
  };

  const titles = {
    brief: 'موجز إبداعي محسّن - مشروعك الجديد',
    ideas: 'أفكار إبداعية ذكية',
    names: 'اقتراحات الأسماء الذكية',
    strategy: 'استراتيجية ذكية شاملة',
    tone: 'تحليل النبرة والشخصية',
    colors: 'لوحة الألوان الذكية'
  };

  return {
    id: `${type}-${Date.now()}`,
    title: titles[type] || 'Generated File',
    type: type as any,
    content: enhanceContentWithAI(content, type),
    summary: generateIntelligentSummary(content, type),
    createdAt: new Date(),
    isFavorite: false,
    aiAnalysis
  };
}; 