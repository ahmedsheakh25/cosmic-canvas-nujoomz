
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTypewriterAnimation } from '@/hooks/useTypewriterAnimation';
import ThinkingIndicator from './ThinkingIndicator';
import TypewriterCursor from './TypewriterCursor';

interface TypewriterMessageProps {
  message: string;
  currentLanguage: 'en' | 'ar';
  onComplete?: () => void;
  enableSkip?: boolean;
  timestamp?: Date;
  autoStart?: boolean;
}

const TypewriterMessage: React.FC<TypewriterMessageProps> = ({
  message,
  currentLanguage,
  onComplete,
  enableSkip = true,
  timestamp,
  autoStart = true
}) => {
  const isRTL = currentLanguage === 'ar';
  
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
    if (autoStart && message) {
      // Start with thinking animation
      startThinking();
      
      // After a brief thinking period, start typing
      const thinkingDuration = Math.random() * 1000 + 500; // 0.5-1.5s
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
    margin: isRTL ? 'ml-12' : 'mr-12',
    headerJustify: isRTL ? 'justify-end' : 'justify-start',
    flexRow: isRTL ? 'flex-row-reverse' : 'flex-row',
    textAlign: isRTL ? 'text-right' : 'text-left',
    spaceReverse: isRTL ? 'space-x-reverse' : '',
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
      className={`flex ${rtlClasses.justify} group`}
    >
      <div className={`max-w-2xl ${rtlClasses.margin}`}>
        {/* Message Header */}
        <div className={`flex items-center gap-2 mb-2 ${rtlClasses.flexRow} ${rtlClasses.spaceReverse} ${rtlClasses.headerJustify}`}>
          <div className="w-8 h-8 gradient-bg-primary rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-nujmooz-text-secondary mixed-text">
            {currentLanguage === 'ar' ? 'نجموز' : 'Najmooz'}
          </span>
        </div>

        {/* Message Bubble */}
        <AnimatePresence mode="wait">
          {isThinking ? (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="p-4 bg-nujmooz-surface border border-nujmooz-border text-nujmooz-text-primary">
                <ThinkingIndicator currentLanguage={currentLanguage} />
              </Card>
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
              <Card className="p-4 shadow-lg backdrop-blur-xl border-0 bg-nujmooz-surface border border-nujmooz-border text-nujmooz-text-primary">
                <div className={`whitespace-pre-wrap leading-relaxed text-base mixed-text ${rtlClasses.textAlign}`} dir={isRTL ? 'rtl' : 'ltr'}>
                  {displayText}
                  <TypewriterCursor show={showCursor} isRTL={isRTL} />
                </div>
                
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

                {/* Completion pulse animation */}
                {isComplete && (
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 pointer-events-none"
                  />
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TypewriterMessage;
