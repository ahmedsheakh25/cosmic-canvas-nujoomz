
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ConversationManagerHeaderProps {
  sessionId: string;
  currentLanguage: 'en' | 'ar';
}

const ConversationManagerHeader: React.FC<ConversationManagerHeaderProps> = ({
  sessionId,
  currentLanguage
}) => {
  if (!sessionId) {
    return (
      <div className="text-center p-4">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
        <p className="text-sm text-red-600">
          {currentLanguage === 'ar' ? 'معرف الجلسة غير صحيح' : 'Invalid session ID'}
        </p>
      </div>
    );
  }

  return null;
};

export default ConversationManagerHeader;
