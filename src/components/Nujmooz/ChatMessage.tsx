
import React from 'react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: {
    id: string;
    sender: 'user' | 'nujmooz';
    message: string;
    created_at: string;
  };
  currentLanguage: string;
  index: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, currentLanguage, index }) => {
  return (
    <motion.div
      key={message.id || index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-2xl ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
        <div className="text-sm text-white/60 mb-2 font-medium">
          {message.sender === 'user' 
            ? (currentLanguage === 'ar' ? 'أنت' : 'You')
            : 'Nujmooz 👽'
          }
        </div>
        <div
          className={`p-4 rounded-2xl ${
            message.sender === 'user'
              ? 'bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] text-black'
              : 'bg-white/10 text-white border border-white/20'
          } shadow-lg`}
          dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
        >
          <p className="whitespace-pre-wrap leading-relaxed">{message.message}</p>
          <div className={`text-xs mt-2 ${
            message.sender === 'user' ? 'text-black/60' : 'text-white/50'
          }`}>
            {new Date(message.created_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
