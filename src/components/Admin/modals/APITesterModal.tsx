import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Code } from 'lucide-react';
import EnhancedAPITester from '../components/EnhancedAPITester';

interface APITesterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const APITesterModal: React.FC<APITesterModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="cosmic-modal max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="cosmic-modal-content">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <Code className="w-6 h-6 text-purple-400" />
              Enhanced API Function Tester
            </DialogTitle>
          </DialogHeader>

          <div className="mt-6">
            <EnhancedAPITester />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default APITesterModal;
