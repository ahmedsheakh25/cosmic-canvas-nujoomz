
import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type ChatMessage } from '@/utils/sessionManager';

interface ConversationSaveSectionProps {
  currentLanguage: 'en' | 'ar';
  messages: ChatMessage[];
  sessionId: string;
  isLoading: boolean;
  onSave: (messages: ChatMessage[], title?: string) => Promise<string | null>;
}

const ConversationSaveSection: React.FC<ConversationSaveSectionProps> = ({
  currentLanguage,
  messages,
  sessionId,
  isLoading,
  onSave
}) => {
  const [saveTitle, setSaveTitle] = useState('');

  const handleSave = async () => {
    const result = await onSave(messages, saveTitle);
    if (result) {
      setSaveTitle('');
    }
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <Input
        placeholder={currentLanguage === 'ar' ? 'عنوان المحادثة (اختياري)' : 'Conversation title (optional)'}
        value={saveTitle}
        onChange={(e) => setSaveTitle(e.target.value)}
        className="flex-1"
      />
      <Button
        onClick={handleSave}
        disabled={messages.length === 0 || isLoading || !sessionId}
        className="shrink-0"
      >
        <Save className="w-4 h-4 mr-2" />
        {currentLanguage === 'ar' ? 'حفظ' : 'Save'}
      </Button>
    </div>
  );
};

export default ConversationSaveSection;
