
import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, Clock } from 'lucide-react';
import EditMessageButton from './EditMessageButton';

interface InteractiveMessageProps {
  message: {
    id: string;
    sender: 'user' | 'nujmooz';
    message: string;
    created_at: string;
  };
  currentLanguage: string;
  index: number;
  onEdit?: () => void;
  canEdit?: boolean;
}

const InteractiveMessage: React.FC<InteractiveMessageProps> = ({ 
  message, 
  currentLanguage, 
  index,
  onEdit,
  canEdit = false
}) => {
  const isUser = message.sender === 'user';
  const isArabic = currentLanguage === 'ar';

  return (
    <motion.div
      key={message.id || index}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 25,
        delay: index * 0.1
      }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}
    >
      <div className={`max-w-2xl ${isUser ? 'text-right' : 'text-left'}`}>
        {/* Sender info */}
        <motion.div 
          className="flex items-center space-x-2 mb-2 text-sm text-white/60 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.1 }}
        >
          {!isUser && <Sparkles className="w-4 h-4 text-[#7EF5A5]" />}
          {isUser && <User className="w-4 h-4 text-[#4AE374]" />}
          <span>
            {isUser 
              ? (isArabic ? 'أنت' : 'You')
              : 'Nujmooz 👽'
            }
          </span>
          
          {/* Edit Button - Only for user messages */}
          {isUser && canEdit && onEdit && (
            <EditMessageButton 
              onEdit={onEdit}
              currentLanguage={currentLanguage}
            />
          )}
        </motion.div>

        {/* Message bubble */}
        <motion.div
          className={`relative p-4 rounded-2xl shadow-lg backdrop-blur-sm ${
            isUser
              ? 'bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] text-black'
              : 'bg-white/10 text-white border border-white/20'
          }`}
          dir={isArabic ? 'rtl' : 'ltr'}
          whileHover={{ 
            scale: 1.02,
            boxShadow: isUser 
              ? "0 10px 30px rgba(126, 245, 165, 0.3)" 
              : "0 10px 30px rgba(255, 255, 255, 0.1)"
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {/* Message content */}
          <motion.p 
            className="whitespace-pre-wrap leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
          >
            {message.message}
          </motion.p>

          {/* Timestamp */}
          <motion.div 
            className={`flex items-center space-x-1 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${
              isUser ? 'text-black/60' : 'text-white/50'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <Clock className="w-3 h-3" />
            <span>
              {new Date(message.created_at).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </motion.div>

          {/* Message tail */}
          <div 
            className={`absolute top-4 w-0 h-0 ${
              isUser 
                ? 'right-[-8px] border-l-8 border-l-[#7EF5A5] border-t-4 border-t-transparent border-b-4 border-b-transparent'
                : 'left-[-8px] border-r-8 border-r-white/10 border-t-4 border-t-transparent border-b-4 border-b-transparent'
            }`}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InteractiveMessage;
