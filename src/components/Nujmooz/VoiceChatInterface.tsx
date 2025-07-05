import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useRealtimeConnection } from '@/hooks/realtime/useRealtimeConnection';
import { AudioRecorder, AudioQueue } from '@/utils/realtimeAudio';
import { toast } from 'sonner';
import { REALTIME_CONFIG } from '@/hooks/realtime/config';

interface VoiceChatInterfaceProps {
  sessionId: string;
  onMessage?: (message: any) => void;
}

export const VoiceChatInterface: React.FC<VoiceChatInterfaceProps> = ({
  sessionId,
  onMessage
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioRecorder, setAudioRecorder] = useState<AudioRecorder | null>(null);
  const [audioQueue, setAudioQueue] = useState<AudioQueue | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const { isConnected, connectionStatus, sendMessage } = useRealtimeConnection({
    sessionId,
    onMessage: (data) => {
      if (data.type === 'audio') {
        handleIncomingAudio(data.audio);
      }
      onMessage?.(data);
    },
    onConnected: () => {
      toast.success('Connected to voice chat');
    },
    onDisconnected: () => {
      toast.error('Disconnected from voice chat');
      stopRecording();
    },
    onError: (error) => {
      toast.error(`Voice chat error: ${error.message}`);
      stopRecording();
    }
  });

  const initializeAudio = useCallback(async () => {
    if (isInitializing || audioContext) return;

    setIsInitializing(true);
    try {
      const context = new AudioContext();
      setAudioContext(context);

      const recorder = new AudioRecorder((audioData) => {
        if (isRecording && !isMuted) {
          sendMessage({
            type: 'audio',
            audio: Array.from(audioData)
          });
        }
      });

      const queue = new AudioQueue(context);
      setAudioQueue(queue);
      setAudioRecorder(recorder);

      await recorder.initialize();
      toast.success('Audio system initialized');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to initialize audio system');
    } finally {
      setIsInitializing(false);
    }
  }, [isInitializing, audioContext, isRecording, isMuted, sendMessage]);

  const startRecording = useCallback(async () => {
    if (!audioRecorder || !isConnected) return;

    try {
      await audioRecorder.start();
      setIsRecording(true);
      toast.success('Voice chat started');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start voice chat');
    }
  }, [audioRecorder, isConnected]);

  const stopRecording = useCallback(() => {
    if (!audioRecorder) return;

    audioRecorder.stop();
    setIsRecording(false);
    toast.info('Voice chat stopped');
  }, [audioRecorder]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
    if (audioQueue) {
      audioQueue.setVolume(isMuted ? 1 : 0);
    }
  }, [isMuted, audioQueue]);

  const handleIncomingAudio = useCallback((audioData: number[]) => {
    if (!audioQueue || isMuted) return;

    const float32Array = new Float32Array(audioData);
    const uint8Array = new Uint8Array(float32Array.buffer);
    audioQueue.addToQueue(uint8Array);
  }, [audioQueue, isMuted]);

  useEffect(() => {
    return () => {
      audioRecorder?.stop();
      audioQueue?.stop();
      audioContext?.close();
    };
  }, [audioRecorder, audioQueue, audioContext]);

  return (
    <div className="flex items-center space-x-2 p-2 bg-background rounded-lg shadow-sm">
      <Button
        variant={isRecording ? "destructive" : "default"}
        size="icon"
        disabled={!isConnected || isInitializing}
        onClick={isRecording ? stopRecording : () => {
          if (!audioContext) {
            initializeAudio().then(() => startRecording());
          } else {
            startRecording();
          }
        }}
      >
        {isInitializing ? (
          <span className="animate-spin">⌛</span>
        ) : isRecording ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        disabled={!audioQueue}
        onClick={toggleMute}
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>

      <div className="text-xs text-muted-foreground">
        {isInitializing ? 'Initializing...' : 
         !isConnected ? 'Connecting...' :
         isRecording ? 'Recording' : 'Ready'}
      </div>
    </div>
  );
}; 