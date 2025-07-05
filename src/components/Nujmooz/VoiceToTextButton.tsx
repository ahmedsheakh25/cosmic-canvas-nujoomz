
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceToTextButtonProps {
  currentLanguage: 'en' | 'ar';
  onTranscript: (transcript: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
}

const VoiceToTextButton: React.FC<VoiceToTextButtonProps> = ({
  currentLanguage,
  onTranscript,
  disabled = false,
  size = 'sm'
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ في التسجيل' : 'Recording Error',
        description: currentLanguage === 'ar' 
          ? 'لا يمكن الوصول إلى الميكروفون' 
          : 'Cannot access microphone',
        variant: 'destructive'
      });
    }
  }, [currentLanguage, toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  }, [isRecording]);

  const processAudio = useCallback(async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('language', currentLanguage === 'ar' ? 'ar' : 'en');

      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: formData
      });

      if (error) throw error;
      
      if (data.text && data.text.trim()) {
        onTranscript(data.text.trim());
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: currentLanguage === 'ar' ? 'خطأ في المعالجة' : 'Processing Error',
        description: currentLanguage === 'ar' 
          ? 'فشل في تحويل الصوت إلى نص' 
          : 'Failed to convert speech to text',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [currentLanguage, onTranscript, toast]);

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
        size={size}
        variant={isRecording ? "destructive" : "outline"}
        onClick={handleToggleRecording}
        disabled={disabled || isProcessing}
        className={`${size === 'sm' ? 'w-10 h-10' : 'w-12 h-12'} p-0 relative transition-all duration-200 ${
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
        
        {/* Recording pulse effect */}
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

      {/* Status indicator */}
      <AnimatePresence>
        {(isRecording || isProcessing) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-medium px-2 py-1 rounded-full ${
              currentLanguage === 'ar' ? 'arabic-text' : ''
            } ${
              isRecording 
                ? 'bg-red-100 text-red-700' 
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {isRecording 
              ? (currentLanguage === 'ar' ? 'يسجل...' : 'Recording...') 
              : (currentLanguage === 'ar' ? 'معالجة...' : 'Processing...')
            }
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VoiceToTextButton;
