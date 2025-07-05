import { ContentAnalysisResult } from '@/types/files';

const briefPatterns = [
  /موجز|brief|استراتيجية|strategy|مشروع|project|خطة|plan/i,
  /متطلبات|requirements|مواصفات|specifications/i,
  /أهداف|goals|targets|objectives/i
];

const ideasPatterns = [
  /فكرة|أفكار|idea|ideas|اقتراح|suggestion|إبداع|creative/i,
  /حلول|solutions|بدائل|alternatives/i,
  /ابتكار|innovation|تطوير|development/i
];

const namesPatterns = [
  /اسم|أسماء|name|names|تسمية|naming|عنوان|title/i,
  /براند|brand|علامة|mark|شعار|logo/i
];

const strategyPatterns = [
  /استراتيجية|strategy|خطة|plan|منهج|approach/i,
  /تسويق|marketing|ترويج|promotion|إعلان|advertising/i
];

const tonePatterns = [
  /نبرة|tone|أسلوب|style|شخصية|personality/i,
  /مزاج|mood|طابع|character|هوية|identity/i
];

const colorPatterns = [
  /لون|ألوان|color|colors|درجة|shade/i,
  /باليت|palette|تدرج|gradient|لوحة|scheme/i
];

export const analyzeSentiment = (content: string): number => {
  const positiveWords = ['رائع', 'ممتاز', 'جيد', 'مفيد', 'great', 'excellent', 'good', 'amazing'];
  const negativeWords = ['سيء', 'ضعيف', 'مشكلة', 'bad', 'poor', 'problem', 'issue'];
  
  let score = 0;
  positiveWords.forEach(word => {
    if (content.toLowerCase().includes(word)) score += 1;
  });
  negativeWords.forEach(word => {
    if (content.toLowerCase().includes(word)) score -= 1;
  });
  
  return Math.max(-1, Math.min(1, score / 5));
};

export const analyzeComplexity = (content: string): number => {
  const sentences = content.split(/[.!?]+/);
  const avgWordsPerSentence = sentences.reduce((acc, sentence) => 
    acc + sentence.trim().split(/\s+/).length, 0) / sentences.length;
  return Math.min(1, avgWordsPerSentence / 20);
};

export const extractKeywords = (content: string): string[] => {
  const words = content.toLowerCase().split(/\s+/);
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'في', 'من', 'إلى', 'على'];
  return [...new Set(words.filter(word => !stopWords.includes(word)))].slice(0, 10);
};

export const analyzeContent = (content: string): ContentAnalysisResult => {
  return {
    containsBrief: briefPatterns.some(pattern => pattern.test(content)),
    containsIdeas: ideasPatterns.some(pattern => pattern.test(content)),
    containsNames: namesPatterns.some(pattern => pattern.test(content)),
    containsStrategy: strategyPatterns.some(pattern => pattern.test(content)),
    containsToneAnalysis: tonePatterns.some(pattern => pattern.test(content)),
    containsColorSuggestions: colorPatterns.some(pattern => pattern.test(content)),
    sentiment: analyzeSentiment(content),
    complexity: analyzeComplexity(content),
    keywords: extractKeywords(content)
  };
}; 