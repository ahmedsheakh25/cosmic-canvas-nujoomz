
import React from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import ModernMessagesList from './ModernMessagesList';
import ModernSuggestedReplies from './ModernSuggestedReplies';
import ModernChatInputBox from './ModernChatInputBox';

interface ChatMessage {
  id: string;
  sender: 'user' | 'nujmooz';
  content: string;
  timestamp: Date;
  generatedFiles?: string[];
}

interface ProfessionalChatContainerProps {
  messages: ChatMessage[];
  currentInput: string;
  setCurrentInput: (value: string) => void;
  onSendMessage: (content?: string) => void;
  isLoading: boolean;
  currentLanguage: 'en' | 'ar';
  messagesEndRef: React.RefObject<HTMLDivElement>;
  suggestedReplies: string[];
  onSuggestedReply: (suggestion: string) => void;
}

const ProfessionalChatContainer: React.FC<ProfessionalChatContainerProps> = ({
  messages,
  currentInput,
  setCurrentInput,
  onSendMessage,
  isLoading,
  currentLanguage,
  messagesEndRef,
  suggestedReplies,
  onSuggestedReply
}) => {
  return (
    <div className="flex flex-col h-full bg-gray-50/30 dark:bg-gray-900/30">
      {/* Chat Messages Area - Fixed height with internal scroll */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <ModernMessagesList
              messages={messages}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
              currentLanguage={currentLanguage}
            />
          </div>
        </ScrollArea>
      </div>

      {/* Suggested Replies - Fixed position above input */}
      {suggestedReplies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="px-6 py-2"
        >
          <ModernSuggestedReplies
            suggestedReplies={suggestedReplies}
            messagesCount={messages.length}
            isLoading={isLoading}
            onSuggestedReply={onSuggestedReply}
            setCurrentInput={setCurrentInput}
          />
        </motion.div>
      )}

      {/* Chat Input - Fixed at bottom */}
      <div className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="p-6">
          <ModernChatInputBox
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            onSendMessage={onSendMessage}
            isLoading={isLoading}
            currentLanguage={currentLanguage}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalChatContainer;
