
import React from 'react';
import { motion } from 'framer-motion';
import ChatHeader from './ChatHeader';
import MessagesList from './MessagesList';
import ChatFooter from './ChatFooter';
import ConversationProgress from './ConversationProgress';
import EnhancedChatInterface from './EnhancedChatInterface';
import { type ChatMessage as ChatMessageType } from '@/utils/sessionManager';
import { type ConversationPhase } from '@/hooks/useConversationFlow';

interface ChatLayoutProps {
  showWelcomeAnimation: boolean;
  currentLanguage: 'en' | 'ar';
  onLanguageToggle: () => void;
  messages: ChatMessageType[];
  isLoading: boolean;
  briefData: any;
  savedBriefId: string | null;
  onEditMessage: (index: number) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  suggestedReplies: string[];
  onSuggestedReply: (suggestion: string) => void;
  onVoiceTranscript: (transcript: string) => void;
  onCreativeSkill: (skillType: string) => void;
  conversationPhase: ConversationPhase;
  currentQuestionIndex: number;
  showBriefPreview: boolean;
  currentService: any;
  sessionId?: string;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({
  showWelcomeAnimation,
  currentLanguage,
  onLanguageToggle,
  messages,
  isLoading,
  briefData,
  savedBriefId,
  onEditMessage,
  messagesEndRef,
  inputMessage,
  setInputMessage,
  onSendMessage,
  suggestedReplies,
  onSuggestedReply,
  onVoiceTranscript,
  onCreativeSkill,
  conversationPhase,
  currentQuestionIndex,
  showBriefPreview,
  currentService,
  sessionId
}) => {
  const chatContent = (
    <motion.div
      className="flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: showWelcomeAnimation ? 0 : 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <ChatHeader 
          currentLanguage={currentLanguage}
          onLanguageToggle={onLanguageToggle}
        />
      </motion.div>

      <motion.div
        className="flex-1 relative"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <MessagesList
          messages={messages}
          currentLanguage={currentLanguage}
          isLoading={isLoading}
          briefData={briefData}
          savedBriefId={savedBriefId}
          onEditMessage={onEditMessage}
        />
        
        <div ref={messagesEndRef} />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <ChatFooter
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          currentLanguage={currentLanguage}
          suggestedReplies={suggestedReplies}
          onSuggestedReply={onSuggestedReply}
          onVoiceTranscript={onVoiceTranscript}
          onCreativeSkill={onCreativeSkill}
          conversationPhase={conversationPhase}
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <ConversationProgress
          conversationPhase={conversationPhase}
          currentQuestionIndex={currentQuestionIndex}
          currentLanguage={currentLanguage}
          showBriefPreview={showBriefPreview}
          currentService={currentService}
        />
      </motion.div>
    </motion.div>
  );

  // If we have a sessionId, wrap with enhanced interface
  if (sessionId) {
    return (
      <EnhancedChatInterface
        sessionId={sessionId}
        currentLanguage={currentLanguage}
      >
        {chatContent}
      </EnhancedChatInterface>
    );
  }

  // Fallback to basic interface
  return chatContent;
};

export default ChatLayout;
