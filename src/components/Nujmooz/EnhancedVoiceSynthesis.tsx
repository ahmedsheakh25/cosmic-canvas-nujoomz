import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, VolumeX, Loader2, Play, Pause } from 'lucide-react';
import { elevenLabsClient } from '@/integrations/elevenlabs/client';
import { useToast } from '@/components/ui/use-toast';

interface EnhancedVoiceSynthesisProps {
  text: string;
  onSpeakingChange?: (isSpeaking: boolean) => void;
  language?: 'ar' | 'en';
  autoSpeak?: boolean;
  className?: string;
}

export const EnhancedVoiceSynthesis: React.FC<EnhancedVoiceSynthesisProps> = ({
  text,
  onSpeakingChange,
  language = 'ar',
  autoSpeak = false,
  className = ''
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleAudioEnd = useCallback(() => {
    setIsPlaying(false);
    onSpeakingChange?.(false);
    
    // Clean up audio URL
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setCurrentAudio(null);
  }, [audioUrl, onSpeakingChange]);

  const generateAndPlaySpeech = useCallback(async () => {
    if (!text.trim()) {
      toast({
        title: language === 'ar' ? 'خطأ' : 'Error',
        description: language === 'ar' ? 'لا يوجد نص للتحويل إلى صوت' : 'No text to convert to speech',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsGenerating(true);
      console.log('🎤 Generating speech for:', text.substring(0, 50) + '...');

      const audioBlob = await elevenLabsClient.textToSpeech(text, {
        modelId: 'eleven_multilingual_v2',
        stability: 0.5,
        similarityBoost: 0.75,
        speakerBoost: true
      });

      if (!audioBlob) {
        throw new Error('Failed to generate speech - service may be unavailable');
      }

      // Create audio URL and play
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      const audio = new Audio(url);
      setCurrentAudio(audio);

      audio.onended = handleAudioEnd;
      audio.onerror = () => {
        console.error('❌ Audio playback error');
        handleAudioEnd();
        toast({
          title: language === 'ar' ? 'خطأ في التشغيل' : 'Playback Error',
          description: language === 'ar' ? 'فشل في تشغيل الصوت' : 'Failed to play audio',
          variant: 'destructive'
        });
      };

      await audio.play();
      setIsPlaying(true);
      onSpeakingChange?.(true);

      console.log('✅ Audio playback started successfully');

    } catch (error) {
      console.error('❌ Speech synthesis error:', error);
      
      toast({
        title: language === 'ar' ? 'خطأ في تحويل النص إلى صوت' : 'Text-to-Speech Error',
        description: error instanceof Error ? error.message : 'Failed to generate speech',
        variant: 'destructive'
      });
      
      handleAudioEnd();
    } finally {
      setIsGenerating(false);
    }
  }, [text, language, onSpeakingChange, toast, handleAudioEnd]);

  const stopSpeech = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      handleAudioEnd();
    }
  }, [currentAudio, handleAudioEnd]);

  const toggleSpeech = useCallback(() => {
    if (isPlaying) {
      stopSpeech();
    } else {
      generateAndPlaySpeech();
    }
  }, [isPlaying, stopSpeech, generateAndPlaySpeech]);

  // Auto-speak effect
  React.useEffect(() => {
    if (autoSpeak && text.trim() && !isGenerating && !isPlaying) {
      const timer = setTimeout(generateAndPlaySpeech, 500);
      return () => clearTimeout(timer);
    }
  }, [autoSpeak, text, isGenerating, isPlaying, generateAndPlaySpeech]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={toggleSpeech}
        disabled={isGenerating || !text.trim()}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 hover:bg-accent"
        title={
          isGenerating
            ? (language === 'ar' ? 'جاري إنشاء الصوت...' : 'Generating speech...')
            : isPlaying
            ? (language === 'ar' ? 'إيقاف الصوت' : 'Stop speech')
            : (language === 'ar' ? 'تشغيل الصوت' : 'Play speech')
        }
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      
      {isPlaying && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-primary animate-pulse"></div>
            <div className="w-1 h-2 bg-primary animate-pulse delay-75"></div>
            <div className="w-1 h-4 bg-primary animate-pulse delay-150"></div>
          </div>
          <span className="hidden sm:inline">
            {language === 'ar' ? 'يتم التشغيل...' : 'Playing...'}
          </span>
        </div>
      )}
    </div>
  );
};

export default EnhancedVoiceSynthesis;