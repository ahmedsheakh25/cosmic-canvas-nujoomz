
import React from 'react';
import { motion } from 'framer-motion';
import EnhancedChatInput from './EnhancedChatInput';
import VoiceInput from './VoiceInput';
import AnimatedSuggestedReplies from './AnimatedSuggestedReplies';
import InteractiveCreativeSkills from './InteractiveCreativeSkills';
import { type ConversationPhase } from '@/hooks/useConversationFlow';

interface ChatFooterProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  currentLanguage: 'en' | 'ar';
  suggestedReplies: string[];
  onSuggestedReply: (suggestion: string) => void;
  onVoiceTranscript: (transcript: string) => void;
  onCreativeSkill: (skillType: string) => void;
  conversationPhase: ConversationPhase;
}

const ChatFooter: React.FC<ChatFooterProps> = ({
  inputMessage,
  setInputMessage,
  onSendMessage,
  isLoading,
  currentLanguage,
  suggestedReplies,
  onSuggestedReply,
  onVoiceTranscript,
  onCreativeSkill,
  conversationPhase
}) => {
  return (
    <motion.div
      className="border-t border-white/10 bg-gradient-to-r from-black/20 via-black/10 to-black/20 backdrop-blur-sm"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Suggested Replies */}
      <div className="px-6 pt-4">
        <AnimatedSuggestedReplies
          suggestions={suggestedReplies}
          onSelect={onSuggestedReply}
          currentLanguage={currentLanguage}
        />
      </div>

      {/* Creative Skills Buttons */}
      <div className="px-6">
        <InteractiveCreativeSkills
          onSkillSelect={onCreativeSkill}
          currentLanguage={currentLanguage}
          show={conversationPhase !== 'collecting_details'}
        />
      </div>

      {/* Enhanced Input Area */}
      <div className="p-6">
        <EnhancedChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          currentLanguage={currentLanguage}
          onVoiceInput={() => {
            // Voice input integration would go here
            console.log('Voice input activated');
          }}
        />
      </div>

      {/* Powered by notice */}
      <motion.div 
        className="px-6 pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-center text-white/40 text-xs">
          {currentLanguage === 'ar' 
            ? 'مدعوم بواسطة استوديو الفضاء الذكي'
            : 'Powered by Of Space Studio AI'
          }
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ChatFooter;
