
import React from 'react';
import { motion } from 'framer-motion';

interface ModernSuggestedRepliesProps {
  suggestedReplies: string[];
  messagesCount: number;
  isLoading: boolean;
  onSuggestedReply?: (reply: string) => void;
  setCurrentInput: (value: string) => void;
}

const ModernSuggestedReplies: React.FC<ModernSuggestedRepliesProps> = ({
  suggestedReplies,
  messagesCount,
  isLoading,
  onSuggestedReply,
  setCurrentInput
}) => {
  const defaultSmartReplies = [
    'أخبرني عن خدماتكم',
    'أريد تصميم هوية تجارية',
    'ما هي أسعاركم؟',
    'كيف يمكنني البدء؟'
  ];

  const displayReplies = suggestedReplies.length > 0 ? suggestedReplies : defaultSmartReplies;

  if ((messagesCount > 1 && displayReplies.length === 0) || isLoading) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 pb-4"
    >
      <div className="flex flex-wrap gap-2">
        {displayReplies.slice(0, 4).map((reply, index) => (
          <button
            key={index}
            onClick={() => onSuggestedReply ? onSuggestedReply(reply) : setCurrentInput(reply)}
            className="px-4 py-2 bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-[#c9c4bf]/20 rounded-2xl text-sm text-[#2a2a2a] dark:text-white hover:bg-[#ebb650]/20 hover:border-[#ebb650]/40 transition-all duration-300"
          >
            {reply}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default ModernSuggestedReplies;
