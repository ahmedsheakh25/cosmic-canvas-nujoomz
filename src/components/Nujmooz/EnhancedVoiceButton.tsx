
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceInterface } from '@/hooks/useVoiceInterface';

interface EnhancedVoiceButtonProps {
  currentLanguage: 'en' | 'ar';
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

const EnhancedVoiceButton: React.FC<EnhancedVoiceButtonProps> = ({
  currentLanguage,
  onTranscript,
  disabled = false
}) => {
  const { 
    isRecording, 
    isProcessing, 
    isSpeaking,
    startRecording, 
    stopRecording 
  } = useVoiceInterface(currentLanguage);

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Button
        size="sm"
        variant={isRecording ? "destructive" : "outline"}
        onClick={handleToggleRecording}
        disabled={disabled || isProcessing}
        className={`w-10 h-10 p-0 relative transition-all duration-200 ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg' 
            : 'hover:bg-nujmooz-primary/10 hover:text-nujmooz-primary border-nujmooz-primary/30'
        }`}
      >
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            />
          ) : isSpeaking ? (
            <motion.div
              key="speaking"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Volume2 className="w-4 h-4" />
            </motion.div>
          ) : isRecording ? (
            <motion.div
              key="recording"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <MicOff className="w-4 h-4" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Mic className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* تأثير النبض أثناء التسجيل */}
        {isRecording && (
          <motion.div
            className="absolute inset-0 border-2 border-red-400 rounded-md"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.7, 0, 0.7]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </Button>

      {/* مؤشر الحالة */}
      <AnimatePresence>
        {(isRecording || isProcessing || isSpeaking) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium px-2 py-1 rounded-full ${
              currentLanguage === 'ar' ? 'arabic-text' : ''
            } ${
              isRecording 
                ? 'bg-red-100 text-red-700' 
                : isProcessing 
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {isRecording 
              ? (currentLanguage === 'ar' ? 'يسجل...' : 'Recording...') 
              : isProcessing 
              ? (currentLanguage === 'ar' ? 'معالجة...' : 'Processing...')
              : (currentLanguage === 'ar' ? 'يتحدث...' : 'Speaking...')
            }
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedVoiceButton;
