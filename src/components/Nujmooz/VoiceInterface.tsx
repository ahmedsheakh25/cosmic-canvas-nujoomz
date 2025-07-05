
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceInterfaceProps {
  currentLanguage: 'en' | 'ar';
  onTranscript: (transcript: string) => void;
  isEnabled?: boolean;
}

const VoiceInterface: React.FC<VoiceInterfaceProps> = ({
  currentLanguage,
  onTranscript,
  isEnabled = true
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
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
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
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

      mediaRecorder.start(1000);
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

  const speakText = useCallback(async (text: string) => {
    if (!isSpeakerEnabled || !text.trim()) return;

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text,
          language: currentLanguage,
          voice: currentLanguage === 'ar' ? 'nova' : 'alloy'
        }
      });

      if (error) throw error;

      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      await audio.play();
    } catch (error) {
      console.error('Error with text-to-speech:', error);
    }
  }, [currentLanguage, isSpeakerEnabled]);

  if (!isEnabled) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Voice Recording Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size="sm"
          variant={isRecording ? "destructive" : "outline"}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`w-10 h-10 p-0 relative ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'hover:bg-nujmooz-primary/10 hover:text-nujmooz-primary'
          }`}
        >
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
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
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </Button>
      </motion.div>

      {/* Speaker Toggle */}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsSpeakerEnabled(!isSpeakerEnabled)}
        className={`w-8 h-8 p-0 ${
          isSpeakerEnabled 
            ? 'text-nujmooz-primary hover:bg-nujmooz-primary/10' 
            : 'text-gray-400 hover:bg-gray-100'
        }`}
        title={currentLanguage === 'ar' 
          ? (isSpeakerEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت')
          : (isSpeakerEnabled ? 'Mute speaker' : 'Enable speaker')
        }
      >
        {isSpeakerEnabled ? (
          <Volume2 className="w-4 h-4" />
        ) : (
          <VolumeX className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
};

export default VoiceInterface;
