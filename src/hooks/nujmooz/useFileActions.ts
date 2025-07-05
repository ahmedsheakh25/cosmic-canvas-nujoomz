import { useState } from 'react';
import { GeneratedFile } from '@/types/files';
import type { FileAction } from './types';

interface UseFileActionsProps {
  onOpenRightPanel: () => void;
}

export const useFileActions = ({ onOpenRightPanel }: UseFileActionsProps) => {
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);

  const handleFileAction = (fileId: string, action: FileAction) => {
    const file = generatedFiles.find(f => f.id === fileId);
    if (!file) return;

    switch (action) {
      case 'view':
        onOpenRightPanel();
        break;
      case 'edit':
        console.log('Edit file:', fileId);
        break;
      case 'export':
        console.log('Export file:', fileId);
        break;
      case 'copy':
        navigator.clipboard.writeText(file.content);
        break;
      case 'duplicate':
        const duplicatedFile = {
          ...file,
          id: `${file.id}-copy-${Date.now()}`,
          title: `${file.title} - نسخة`,
          createdAt: new Date()
        };
        setGeneratedFiles(prev => [...prev, duplicatedFile]);
        break;
      case 'delete':
        if (window.confirm(`هل أنت متأكد من حذف الملف: ${file.title}؟`)) {
          setGeneratedFiles(prev => prev.filter(f => f.id !== fileId));
        }
        break;
      case 'favorite':
        setGeneratedFiles(prev => 
          prev.map(f => f.id === fileId ? { ...f, isFavorite: !f.isFavorite } : f)
        );
        break;
    }
  };

  return {
    generatedFiles,
    setGeneratedFiles,
    handleFileAction
  };
}; 