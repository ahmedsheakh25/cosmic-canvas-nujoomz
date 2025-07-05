
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Image, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import VoiceInterface from './VoiceInterface';

interface ModernChatInputBoxProps {
  currentInput: string;
  setCurrentInput: (value: string) => void;
  onSendMessage: (content?: string) => void;
  isLoading?: boolean;
  currentLanguage: 'en' | 'ar';
  showWelcome?: boolean;
}

const ModernChatInputBox: React.FC<ModernChatInputBoxProps> = ({
  currentInput,
  setCurrentInput,
  onSendMessage,
  isLoading = false,
  currentLanguage,
  showWelcome = false
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRTL = currentLanguage === 'ar';
  const placeholder = currentLanguage === 'ar' 
    ? 'اكتب رسالتك هنا... أو استخدم الميكروفون 🎤'
    : 'Type your message here... or use the microphone 🎤';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentInput.trim() && !isLoading) {
      onSendMessage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      console.log('Files dropped:', files);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setCurrentInput(transcript);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative ${currentLanguage === 'ar' ? 'arabic-text' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`
            relative border-2 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm
            transition-all duration-300 shadow-lg hover:shadow-xl
            ${isDragOver 
              ? 'border-nujmooz-primary bg-nujmooz-primary/5' 
              : 'border-gray-200/50 dark:border-gray-700/50 hover:border-nujmooz-primary/50'
            }
            ${isLoading ? 'opacity-70' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Main Input Area */}
          <div className={`flex items-end gap-3 p-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Voice Interface */}
            <div className="flex-shrink-0">
              <VoiceInterface
                currentLanguage={currentLanguage}
                onTranscript={handleVoiceTranscript}
                isEnabled={!isLoading}
              />
            </div>

            {/* Text Input */}
            <div className="flex-1 min-w-0">
              <Textarea
                ref={textareaRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={isLoading}
                className={`
                  resize-none border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0
                  text-base leading-relaxed min-h-[24px] max-h-32
                  placeholder:text-gray-400 dark:placeholder:text-gray-500
                  mixed-text
                  ${isRTL ? 'text-right' : 'text-left'}
                `}
                rows={1}
                style={{
                  height: 'auto',
                  minHeight: '24px'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className={`flex items-center gap-2 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* File Upload */}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx"
                className="hidden"
              />
              
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className="w-8 h-8 p-0 text-gray-500 hover:text-nujmooz-primary hover:bg-nujmooz-primary/10"
                title={currentLanguage === 'ar' ? 'إرفاق ملف' : 'Attach file'}
              >
                <Paperclip className="w-4 h-4" />
              </Button>

              {/* Send Button */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  size="sm"
                  disabled={!currentInput.trim() || isLoading}
                  className={`
                    w-10 h-10 p-0 bg-gradient-to-r from-nujmooz-primary to-nujmooz-primary/90 
                    hover:from-nujmooz-primary/90 hover:to-nujmooz-primary text-white
                    disabled:opacity-50 disabled:cursor-not-allowed
                    shadow-lg hover:shadow-xl transition-all duration-200
                  `}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  )}
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Drag Overlay */}
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-nujmooz-primary/10 border-2 border-dashed border-nujmooz-primary rounded-2xl flex items-center justify-center"
            >
              <div className="text-center">
                <Image className="w-8 h-8 text-nujmooz-primary mx-auto mb-2" />
                <p className="text-sm font-medium text-nujmooz-primary mixed-text">
                  {currentLanguage === 'ar' ? 'أفلت الملف هنا' : 'Drop file here'}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Quick Tips */}
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`mt-3 text-xs text-gray-500 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}
          >
            <span className="mixed-text">
              {currentLanguage === 'ar' 
                ? '💡 يمكنك استخدام الصوت أو الكتابة أو إرفاق الملفات'
                : '💡 You can use voice, typing, or attach files'
              }
            </span>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default ModernChatInputBox;
