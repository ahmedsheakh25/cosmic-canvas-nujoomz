
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useTypewriterAnimation } from '@/hooks/useTypewriterAnimation';
import ThinkingIndicator from './ThinkingIndicator';
import TypewriterCursor from './TypewriterCursor';
import EnhancedResponseFormatter from './EnhancedResponseFormatter';
import { detectResponseType } from '@/lib/enhancedNujmoozInstructions';

interface EnhancedTypewriterMessageProps {
  message: string;
  currentLanguage: 'en' | 'ar';
  onComplete?: () => void;
  enableSkip?: boolean;
  timestamp?: Date;
  autoStart?: boolean;
}

const EnhancedTypewriterMessage: React.FC<EnhancedTypewriterMessageProps> = ({
  message,
  currentLanguage,
  onComplete,
  enableSkip = true,
  timestamp,
  autoStart = true
}) => {
  const isRTL = currentLanguage === 'ar';
  const [responseType, setResponseType] = useState<'professional' | 'creative' | 'technical' | 'casual'>('professional');
  
  const {
    displayText,
    isTyping,
    isThinking,
    isComplete,
    showCursor,
    startThinking,
    startTyping,
    skipAnimation
  } = useTypewriterAnimation(message, {
    speed: 65,
    enableSkip,
    onComplete
  });

  useEffect(() => {
    if (message) {
      setResponseType(detectResponseType(message));
    }
  }, [message]);

  useEffect(() => {
    if (autoStart && message) {
      startThinking();
      
      const thinkingDuration = Math.random() * 1000 + 500;
      const timer = setTimeout(() => {
        startTyping();
      }, thinkingDuration);

      return () => clearTimeout(timer);
    }
  }, [message, autoStart, startThinking, startTyping]);

  const handleSkip = () => {
    if (enableSkip && (isThinking || isTyping)) {
      skipAnimation();
    }
  };

  // RTL-aware classes
  const rtlClasses = {
    justify: isRTL ? 'justify-end' : 'justify-start',
    avatarSide: isRTL ? 'right-4' : 'left-4',
    contentMargin: isRTL ? 'mr-16' : 'ml-16',
    textAlign: isRTL ? 'text-right' : 'text-left',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      className={`flex ${rtlClasses.justify} group relative`}
    >
      <div className="max-w-4xl w-full relative">
        {/* Avatar positioned at top-right or top-left */}
        <div className={`absolute top-0 ${rtlClasses.avatarSide} z-10 flex flex-col items-center gap-1`}>
          <div className="w-10 h-10 gradient-bg-primary rounded-full flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-medium text-nujmooz-text-secondary mixed-text whitespace-nowrap">
            {currentLanguage === 'ar' ? 'نجموز' : 'Najmooz'}
          </span>
        </div>

        {/* Message Content with margin for avatar */}
        <div className={rtlClasses.contentMargin}>
          <AnimatePresence mode="wait">
            {isThinking ? (
              <motion.div
                key="thinking"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="p-4 bg-nujmooz-surface border border-nujmooz-border backdrop-blur-xl rounded-lg"
              >
                <ThinkingIndicator currentLanguage={currentLanguage} />
              </motion.div>
            ) : (
              <motion.div
                key="message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={handleSkip}
                className={enableSkip ? 'cursor-pointer' : ''}
                title={enableSkip ? (currentLanguage === 'ar' ? 'انقر لإكمال الرسالة' : 'Click to complete message') : ''}
              >
                {isComplete ? (
                  <EnhancedResponseFormatter 
                    content={displayText}
                    language={currentLanguage}
                    responseType={responseType}
                  />
                ) : (
                  <div className="p-4 bg-nujmooz-surface border border-nujmooz-border backdrop-blur-xl rounded-lg">
                    <div className={`whitespace-pre-wrap leading-relaxed text-base mixed-text ${rtlClasses.textAlign}`} dir={isRTL ? 'rtl' : 'ltr'}>
                      {displayText}
                      <TypewriterCursor show={showCursor} isRTL={isRTL} />
                    </div>
                  </div>
                )}
                
                {/* Timestamp */}
                {timestamp && isComplete && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 0.5 }}
                    className={`text-xs mt-2 text-nujmooz-text-muted ${isRTL ? 'text-left' : 'text-right'}`}
                  >
                    {timestamp.toLocaleTimeString(currentLanguage === 'ar' ? 'ar' : 'en', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedTypewriterMessage;
