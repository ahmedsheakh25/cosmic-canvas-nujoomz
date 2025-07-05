
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PromptsDropZone } from '../components/PromptsDropZone';

interface PromptsLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PromptsLibraryModal: React.FC<PromptsLibraryModalProps> = ({ isOpen, onClose }) => {
  const handleSuccess = () => {
    // Refresh or trigger any necessary updates
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Prompts Collection</DialogTitle>
        </DialogHeader>
        <PromptsDropZone onSuccess={handleSuccess} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default PromptsLibraryModal;
