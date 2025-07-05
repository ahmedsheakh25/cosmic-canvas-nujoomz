import { useState } from 'react';
import { type ChatMessage } from '@/utils/sessionManager';
import { GeneratedFile, ContentAnalysisResult, FileProcessingResult } from '@/types/files';
import { analyzeContent } from '@/utils/analysis/contentAnalysis';
import { createFile } from '@/utils/files/fileGenerators';

export const useModernNujmoozState = () => {
  const [generatedFiles, setGeneratedFilesState] = useState<GeneratedFile[]>([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);

  const processMessageForFiles = async (message: ChatMessage): Promise<FileProcessingResult> => {
    if (message.sender !== 'nujmooz') {
      return { success: true, files: [] };
    }

    setIsProcessingFiles(true);
    
    try {
      const content = message.message;
      const newFiles: GeneratedFile[] = [];

      // Analyze content using the new utility
      const analysisResult = await analyzeContent(content);

      // Create files based on analysis results
      const fileTypes = [
        { type: 'brief', condition: analysisResult.containsBrief },
        { type: 'ideas', condition: analysisResult.containsIdeas },
        { type: 'names', condition: analysisResult.containsNames },
        { type: 'strategy', condition: analysisResult.containsStrategy },
        { type: 'tone', condition: analysisResult.containsToneAnalysis },
        { type: 'colors', condition: analysisResult.containsColorSuggestions }
      ];

      for (const { type, condition } of fileTypes) {
        if (condition) {
          const file = await createFile(content, type, analysisResult);
          newFiles.push(file);
        }
      }

      if (newFiles.length > 0) {
        setGeneratedFilesState(prev => [...prev, ...newFiles]);
      }

      return { success: true, files: newFiles };
    } catch (error) {
      console.error('Error processing message for files:', error);
      return { 
        success: false, 
        files: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    } finally {
      setIsProcessingFiles(false);
    }
  };

  const setGeneratedFiles = (files: GeneratedFile[]) => {
    setGeneratedFilesState(files);
  };

  return {
    generatedFiles,
    isProcessingFiles,
    processMessageForFiles,
    setGeneratedFiles
  };
};