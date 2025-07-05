
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VoiceInteractionOverlayProps {
  isVisible: boolean;
  onClose: () => void;
  currentLanguage: 'en' | 'ar';
  isListening?: boolean;
  isPlaying?: boolean;
  onStartListening?: () => void;
  onStopListening?: () => void;
  onTogglePlayback?: () => void;
  transcript?: string;
  confidence?: number;
}

const VoiceInteractionOverlay: React.FC<VoiceInteractionOverlayProps> = ({
  isVisible,
  onClose,
  currentLanguage,
  isListening = false,
  isPlaying = false,
  onStartListening,
  onStopListening,
  onTogglePlayback,
  transcript = '',
  confidence = 0
}) => {
  const [waveAnimation, setWaveAnimation] = useState(false);

  useEffect(() => {
    if (isListening) {
      setWaveAnimation(true);
    } else {
      setWaveAnimation(false);
    }
  }, [isListening]);

  const handleMicToggle = () => {
    if (isListening) {
      onStopListening?.();
    } else {
      onStartListening?.();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Voice Overlay */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50"
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
          >
            <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm">👽</span>
                  </div>
                  <h2 className="font-semibold text-lg">
                    {currentLanguage === 'ar' ? 'المحادثة الصوتية' : 'Voice Chat'}
                  </h2>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Voice Visualizer */}
              <div className="p-8 text-center">
                {/* Animated Voice Waves */}
                <div className="relative mb-8">
                  <motion.div
                    className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center"
                    animate={waveAnimation ? {
                      scale: [1, 1.1, 1],
                      boxShadow: [
                        '0 0 0 0 rgba(34, 197, 94, 0.4)',
                        '0 0 0 20px rgba(34, 197, 94, 0)',
                        '0 0 0 0 rgba(34, 197, 94, 0)'
                      ]
                    } : {}}
                    transition={{
                      duration: 1.5,
                      repeat: waveAnimation ? Infinity : 0,
                      ease: 'easeInOut'
                    }}
                  >
                    {isListening ? (
                      <Mic className="w-12 h-12 text-white" />
                    ) : (
                      <MicOff className="w-12 h-12 text-white/80" />
                    )}
                  </motion.div>

                  {/* Pulse Rings */}
                  {waveAnimation && (
                    <>
                      {[0, 0.3, 0.6].map((delay, index) => (
                        <motion.div
                          key={index}
                          className="absolute inset-0 rounded-full border-2 border-green-400/30"
                          animate={{
                            scale: [1, 2],
                            opacity: [0.5, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: delay,
                            ease: 'easeOut'
                          }}
                        />
                      ))}
                    </>
                  )}
                </div>

                {/* Status Text */}
                <div className="mb-6">
                  <h3 className="text-xl font-medium mb-2">
                    {isListening 
                      ? (currentLanguage === 'ar' ? 'أستمع إليك...' : 'Listening...')
                      : (currentLanguage === 'ar' ? 'اضغط للتحدث' : 'Tap to speak')
                    }
                  </h3>
                  
                  {transcript && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-sm"
                    >
                      <p className="text-gray-700 dark:text-gray-300 mb-1">
                        {transcript}
                      </p>
                      {confidence > 0 && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Sparkles className="w-3 h-3" />
                          <span>
                            {currentLanguage === 'ar' ? 'الثقة:' : 'Confidence:'} {Math.round(confidence * 100)}%
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={handleMicToggle}
                    className={`rounded-full w-16 h-16 ${
                      isListening 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {isListening ? (
                      <MicOff className="w-6 h-6" />
                    ) : (
                      <Mic className="w-6 h-6" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={onTogglePlayback}
                    className="rounded-full w-16 h-16"
                  >
                    {isPlaying ? (
                      <VolumeX className="w-6 h-6" />
                    ) : (
                      <Volume2 className="w-6 h-6" />
                    )}
                  </Button>
                </div>

                {/* Instructions */}
                <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                  <p>
                    {currentLanguage === 'ar' 
                      ? 'اضغط مع الاستمرار للتحدث، أو اضغط مرة واحدة للتسجيل المستمر'
                      : 'Hold to speak, or tap once for continuous recording'
                    }
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VoiceInteractionOverlay;
