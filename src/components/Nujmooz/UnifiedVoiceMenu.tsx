
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Phone, ChevronUp, Volume2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useVoiceInterface } from '@/hooks/useVoiceInterface';
import RealtimeVoiceInterface from './RealtimeVoiceInterface';
import VoiceConnectionStatus from './VoiceConnectionStatus';

interface UnifiedVoiceMenuProps {
  sessionId?: string;
  currentLanguage: 'en' | 'ar';
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
}

const UnifiedVoiceMenu: React.FC<UnifiedVoiceMenuProps> = ({
  sessionId,
  currentLanguage,
  onTranscript,
  disabled = false
}) => {
  const [showRealtimeInterface, setShowRealtimeInterface] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { 
    isRecording, 
    isProcessing, 
    isSpeaking,
    startRecording, 
    stopRecording 
  } = useVoiceInterface(currentLanguage);

  const handleQuickRecord = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      startRecording();
    }
    setIsMenuOpen(false);
  };

  const handleRealtimeChat = () => {
    setShowRealtimeInterface(true);
    setIsMenuOpen(false);
  };

  const getButtonState = () => {
    if (isProcessing) return 'processing';
    if (isSpeaking) return 'speaking';
    if (isRecording) return 'recording';
    return 'idle';
  };

  const getButtonIcon = () => {
    switch (getButtonState()) {
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'speaking':
        return <Volume2 className="w-4 h-4" />;
      case 'recording':
        return <Mic className="w-4 h-4 text-red-400" />;
      default:
        return <Mic className="w-4 h-4" />;
    }
  };

  const getButtonStyle = () => {
    switch (getButtonState()) {
      case 'recording':
        return 'bg-red-500 hover:bg-red-600 text-white shadow-lg';
      case 'speaking':
        return 'bg-green-500 hover:bg-green-600 text-white shadow-lg';
      case 'processing':
        return 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg';
      default:
        return 'hover:bg-nujmooz-primary/10 hover:text-nujmooz-primary border-nujmooz-primary/30';
    }
  };

  return (
    <div className="relative">
      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Button
              size="sm"
              variant="outline"
              disabled={disabled}
              className={`w-10 h-10 p-0 relative transition-all duration-200 ${getButtonStyle()}`}
            >
              {getButtonIcon()}
              
              {/* Pulse effect for recording */}
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
              
              {/* Menu indicator */}
              <ChevronUp className="w-2 h-2 absolute -top-1 -right-1 opacity-60" />
            </Button>
          </motion.div>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          align="center" 
          side="top"
          className={`w-48 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
        >
          <DropdownMenuItem 
            onClick={handleQuickRecord}
            disabled={disabled || isProcessing}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>
              {isRecording 
                ? (currentLanguage === 'ar' ? 'إيقاف التسجيل' : 'Stop Recording')
                : (currentLanguage === 'ar' ? 'تسجيل سريع' : 'Quick Record')
              }
            </span>
          </DropdownMenuItem>

          {sessionId && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleRealtimeChat}
                disabled={disabled}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>
                  {currentLanguage === 'ar' ? 'محادثة صوتية متقدمة' : 'Advanced Voice Chat'}
                </span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Status indicator */}
      <AnimatePresence>
        {(isRecording || isProcessing || isSpeaking) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
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

      {/* Realtime Voice Interface */}
      {showRealtimeInterface && sessionId && (
        <RealtimeVoiceInterface
          sessionId={sessionId}
          currentLanguage={currentLanguage}
          onClose={() => setShowRealtimeInterface(false)}
        />
      )}
    </div>
  );
};

export default UnifiedVoiceMenu;
