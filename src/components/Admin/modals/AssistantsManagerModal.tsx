
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AssistantDropZone } from '../components/AssistantDropZone';

interface AssistantsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AssistantsManagerModal: React.FC<AssistantsManagerModalProps> = ({ isOpen, onClose }) => {
  const handleSuccess = () => {
    // Refresh or trigger any necessary updates
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Assistant Configuration</DialogTitle>
        </DialogHeader>
        <AssistantDropZone onSuccess={handleSuccess} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default AssistantsManagerModal;
