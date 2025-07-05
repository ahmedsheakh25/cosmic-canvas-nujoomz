import { ContentAnalysisResult } from '@/types/files';
import type { FileTypeConfig } from './types';

export const getFileTypeConfigs = (analysisResult: ContentAnalysisResult): FileTypeConfig[] => [
  { type: 'brief', condition: analysisResult.containsBrief },
  { type: 'ideas', condition: analysisResult.containsIdeas },
  { type: 'names', condition: analysisResult.containsNames },
  { type: 'strategy', condition: analysisResult.containsStrategy },
  { type: 'tone', condition: analysisResult.containsToneAnalysis },
  { type: 'colors', condition: analysisResult.containsColorSuggestions }
]; 