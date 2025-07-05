import React, { useState, useRef } from 'react';
import { MessageInputProps } from './types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Mic, MicOff, Send } from 'lucide-react';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { VoiceVisualization } from '../VoiceVisualization';
import { toast } from '@/hooks/use-toast';

export function MessageInput({
  onSend,
  isProcessing,
  language,
  className
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    isRecording,
    startRecording,
    stopRecording,
    hasRecordingPermission,
    requestPermission,
    progress
  } = useVoiceRecorder({
    onRecordingComplete: (audioBlob) => {
      onSend(URL.createObjectURL(audioBlob), 'voice');
    },
    onError: (error) => {
      toast({
        title: language === 'ar' ? 'خطأ في التسجيل' : 'Recording Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const handleSubmit = () => {
    if (message.trim()) {
      onSend(message.trim(), 'text');
      setMessage('');
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={cn('space-y-2 p-4', className)}>
      {isRecording && (
        <VoiceVisualization
          isRecording={isRecording}
          progress={progress}
          className="px-4"
        />
      )}

      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            language === 'ar'
              ? 'اكتب رسالتك هنا...'
              : 'Type your message here...'
          }
          className={cn(
            'min-h-[60px] max-h-[120px]',
            language === 'ar' ? 'text-right' : 'text-left'
          )}
          disabled={isProcessing || isRecording}
        />

        <div className="flex gap-2">
          {hasRecordingPermission ? (
            <Button
              variant="outline"
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              className={cn(
                'transition-colors',
                isRecording && 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
              )}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={requestPermission}
              disabled={isProcessing}
            >
              <Mic className="h-5 w-5" />
            </Button>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isProcessing || !message.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
} 