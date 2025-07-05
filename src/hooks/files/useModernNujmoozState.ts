import { useState } from 'react';
import type { FileState } from './types';
import { useFileProcessing } from './useFileProcessing';
import { GeneratedFile } from '@/types/files';

export const useModernNujmoozState = (): FileState => {
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);

  const { processMessageForFiles } = useFileProcessing({
    onSetGeneratedFiles: (files: GeneratedFile[]) => setGeneratedFiles(prev => [...prev, ...files]),
    onSetProcessingStatus: setIsProcessingFiles
  });

  return {
    generatedFiles,
    isProcessingFiles,
    processMessageForFiles
  };
}; 