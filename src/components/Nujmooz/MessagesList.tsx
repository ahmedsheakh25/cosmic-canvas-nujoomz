
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveMessage from './InteractiveMessage';
import BriefPreview from './BriefPreview';
import LoadingIndicator from './LoadingIndicator';
import { type ChatMessage as ChatMessageType } from '@/utils/sessionManager';

interface MessagesListProps {
  messages: ChatMessageType[];
  currentLanguage: 'en' | 'ar';
  isLoading: boolean;
  briefData: any;
  savedBriefId: string | null;
  onEditMessage?: (messageIndex: number) => void;
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  currentLanguage,
  isLoading,
  briefData,
  savedBriefId,
  onEditMessage
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <InteractiveMessage
            key={message.id || index}
            message={message}
            currentLanguage={currentLanguage}
            index={index}
            canEdit={message.sender === 'user' && !!onEditMessage}
            onEdit={() => onEditMessage?.(index)}
          />
        ))}
      </AnimatePresence>
      
      {/* Brief Preview */}
      {briefData && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
        >
          <BriefPreview briefData={briefData} />
        </motion.div>
      )}
      
      {/* Success notification */}
      {savedBriefId && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-4 p-4 bg-gradient-to-r from-green-900/30 to-green-800/30 border border-green-600/30 rounded-xl backdrop-blur-sm"
        >
          <motion.p 
            className="text-green-400 text-sm flex items-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, delay: 0.1 }}
            >
              ✅
            </motion.span>
            <span>
              {currentLanguage === 'ar' 
                ? `تم حفظ الموجز بنجاح (المعرف: ${savedBriefId})`
                : `Brief saved successfully (ID: ${savedBriefId})`
              }
            </span>
          </motion.p>
        </motion.div>
      )}
      
      {isLoading && <LoadingIndicator />}
    </div>
  );
};

export default MessagesList;
