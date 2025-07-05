import { ChatMessage } from '@/utils/sessionManager';
import { FileProcessingResult, GeneratedFile } from '@/types/files';
import { analyzeContent } from '@/utils/analysis/contentAnalysis';
import { createFile } from '@/utils/files/fileGenerators';
import { getFileTypeConfigs } from './fileConfig';
import type { UseFileProcessingProps } from './types';

export const useFileProcessing = ({
  onSetGeneratedFiles,
  onSetProcessingStatus
}: UseFileProcessingProps) => {
  const processMessageForFiles = async (message: ChatMessage): Promise<FileProcessingResult> => {
    if (message.sender !== 'nujmooz') {
      return { success: true, files: [] };
    }

    onSetProcessingStatus(true);
    
    try {
      const content = message.message;
      const newFiles: GeneratedFile[] = [];

      // Analyze content using the new utility
      const analysisResult = await analyzeContent(content);

      // Create files based on analysis results
      const fileTypes = getFileTypeConfigs(analysisResult);

      for (const { type, condition } of fileTypes) {
        if (condition) {
          const file = await createFile(content, type, analysisResult);
          newFiles.push(file);
        }
      }

      if (newFiles.length > 0) {
        onSetGeneratedFiles(newFiles);
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
      onSetProcessingStatus(false);
    }
  };

  return {
    processMessageForFiles
  };
}; 