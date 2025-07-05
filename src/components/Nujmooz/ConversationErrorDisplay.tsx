
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConversationErrorDisplayProps {
  error: string | null;
}

const ConversationErrorDisplay: React.FC<ConversationErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center">
        <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
        <p className="text-sm text-red-700">{error}</p>
      </div>
    </div>
  );
};

export default ConversationErrorDisplay;
