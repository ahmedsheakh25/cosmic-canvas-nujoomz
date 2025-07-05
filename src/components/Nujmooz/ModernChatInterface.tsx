
import React from 'react';
import ModernMessagesList from './ModernMessagesList';
import ModernSuggestedReplies from './ModernSuggestedReplies';
import ModernChatInput from './ModernChatInput';

interface ChatMessage {
  id: string;
  sender: 'user' | 'nujmooz';
  content: string;
  timestamp: Date;
  generatedFiles?: string[];
}

interface ModernChatInterfaceProps {
  messages: ChatMessage[];
  currentInput: string;
  setCurrentInput: (value: string) => void;
  onSendMessage: (content: string) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isLoading?: boolean;
  suggestedReplies?: string[];
  onSuggestedReply?: (suggestion: string) => void;
}

const ModernChatInterface: React.FC<ModernChatInterfaceProps> = ({
  messages,
  currentInput,
  setCurrentInput,
  onSendMessage,
  messagesEndRef,
  isLoading = false,
  suggestedReplies = [],
  onSuggestedReply
}) => {
  return (
    <div className="flex flex-col h-full">
      {/* Messages List */}
      <ModernMessagesList
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />

      {/* Suggested Replies */}
      <ModernSuggestedReplies
        suggestedReplies={suggestedReplies}
        messagesCount={messages.length}
        isLoading={isLoading}
        onSuggestedReply={onSuggestedReply}
        setCurrentInput={setCurrentInput}
      />

      {/* Chat Input */}
      <ModernChatInput
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        onSendMessage={onSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ModernChatInterface;
