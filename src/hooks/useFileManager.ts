
import { useState } from 'react';

interface GeneratedFile {
  id: string;
  title: string;
  type: 'brief' | 'ideas' | 'names' | 'tone' | 'colors' | 'strategy';
  content: string;
  summary: string;
  createdAt: Date;
  lastModified?: Date;
  isFavorite?: boolean;
}

export const useFileManager = () => {
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const selectFile = (file: GeneratedFile) => {
    setSelectedFile(file);
    setIsPreviewMode(true);
  };

  const exportFile = (file: GeneratedFile, format: 'txt' | 'json' = 'txt') => {
    try {
      let content: string;
      let mimeType: string;
      let fileName: string;

      switch (format) {
        case 'json':
          content = JSON.stringify(file, null, 2);
          mimeType = 'application/json';
          fileName = `${file.title}.json`;
          break;
        default:
          content = `${file.title}\n\n${file.summary}\n\n${file.content}`;
          mimeType = 'text/plain';
          fileName = `${file.title}.txt`;
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('Error exporting file:', error);
      return false;
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      return true;
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return false;
    }
  };

  const duplicateFile = (file: GeneratedFile): GeneratedFile => {
    return {
      ...file,
      id: `${file.id}-copy-${Date.now()}`,
      title: `${file.title} - نسخة`,
      createdAt: new Date(),
      isFavorite: false
    };
  };

  return {
    selectedFile,
    isPreviewMode,
    setSelectedFile,
    setIsPreviewMode,
    selectFile,
    exportFile,
    copyToClipboard,
    duplicateFile
  };
};
