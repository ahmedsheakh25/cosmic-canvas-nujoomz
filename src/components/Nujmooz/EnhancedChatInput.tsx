
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Mic } from 'lucide-react';

interface EnhancedChatInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  currentLanguage: string;
  onVoiceInput?: () => void;
}

const EnhancedChatInput: React.FC<EnhancedChatInputProps> = ({
  inputMessage,
  setInputMessage,
  onSendMessage,
  isLoading,
  currentLanguage,
  onVoiceInput
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  return (
    <motion.div 
      className="relative"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Glow effect when focused */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-[#7EF5A5]/20 to-[#4AE374]/20 rounded-2xl blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <div className="relative flex items-center space-x-3 p-1 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm">
        {/* Input field */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={currentLanguage === 'ar' ? 'اكتب رسالتك هنا...' : 'Type your message here...'}
            className="w-full bg-transparent px-4 py-3 text-white placeholder-white/50 focus:outline-none text-base"
            disabled={isLoading}
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
          />
          
          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <Sparkles className="w-4 h-4 text-[#7EF5A5] animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Voice input button */}
        {onVoiceInput && (
          <motion.button
            onClick={onVoiceInput}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            <Mic className="w-5 h-5 text-white" />
          </motion.button>
        )}

        {/* Send button */}
        <motion.button
          onClick={onSendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="relative overflow-hidden bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] text-black p-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: !inputMessage.trim() || isLoading ? 1 : 1.05 }}
          whileTap={{ scale: !inputMessage.trim() || isLoading ? 1 : 0.95 }}
          animate={{
            boxShadow: inputMessage.trim() ? 
              "0 0 20px rgba(126, 245, 165, 0.3)" : 
              "0 0 0px rgba(126, 245, 165, 0)"
          }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                className="flex items-center justify-center"
              >
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key="send"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <Send className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EnhancedChatInput;
