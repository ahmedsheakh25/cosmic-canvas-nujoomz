
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from '@/hooks/useSession';
import UnifiedVoiceMenu from './UnifiedVoiceMenu';

interface ModernChatInputProps {
  currentInput: string;
  setCurrentInput: (value: string) => void;
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  currentLanguage?: 'en' | 'ar';
}

const ModernChatInput: React.FC<ModernChatInputProps> = ({
  currentInput,
  setCurrentInput,
  onSendMessage,
  isLoading = false,
  currentLanguage = 'ar'
}) => {
  const { sessionId } = useSession();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      if (currentInput.trim()) {
        onSendMessage(currentInput);
      }
    }
  };

  const handleSend = () => {
    if (currentInput.trim() && !isLoading) {
      onSendMessage(currentInput);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setCurrentInput(transcript);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [currentInput]);

  return (
    <div className="border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-end gap-3">
          {/* Unified Voice Menu */}
          <div className="relative">
            <UnifiedVoiceMenu
              sessionId={sessionId}
              currentLanguage={currentLanguage}
              onTranscript={handleVoiceTranscript}
              disabled={isLoading}
            />
          </div>

          {/* Input Area */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentLanguage === 'ar' 
                ? 'شاركني فكرتك الإبداعية... 💡' 
                : 'Share your creative idea... 💡'
              }
              className="min-h-[3rem] max-h-32 resize-none rounded-2xl border-gray-300 dark:border-gray-600 focus:border-nujmooz-primary dark:focus:border-nujmooz-primary focus:ring-nujmooz-primary/20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
              disabled={isLoading}
              rows={1}
            />
            
            {/* Sparkle decoration */}
            <motion.div
              className="absolute top-3 right-3 text-nujmooz-primary/40"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
          </div>

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={!currentInput.trim() || isLoading}
            className="rounded-full w-12 h-12 bg-gradient-to-r from-nujmooz-primary to-nujmooz-secondary hover:from-nujmooz-primary/90 hover:to-nujmooz-secondary/90 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center justify-center mt-4 text-sm text-gray-500 dark:text-gray-400">
            <motion.div
              className="flex gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span>{currentLanguage === 'ar' ? 'نجموز يفكر' : 'Nujmooz is thinking'}</span>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                >
                  .
                </motion.span>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernChatInput;
