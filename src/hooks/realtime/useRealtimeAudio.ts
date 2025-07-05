
import { useState, useRef, useCallback, useEffect } from 'react';
import { AudioRecorder, AudioQueue, encodeAudioForAPI } from '@/utils/realtimeAudio';
import { REALTIME_CONFIG } from './config';

export const useRealtimeAudio = (sendMessage: (message: any) => boolean) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isInitializedRef = useRef(false);

  const initializeAudio = useCallback(async () => {
    if (isInitializedRef.current) {
      console.log("Audio system already initialized");
      return;
    }

    try {
      console.log("Initializing audio system...");
      setAudioError(null);
      
      // Create audio context with optimal settings
      audioContextRef.current = new AudioContext({
        sampleRate: REALTIME_CONFIG.AUDIO.DEFAULT_SAMPLE_RATE
      });

      // Resume if suspended (required by some browsers)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      // Initialize audio queue
      audioQueueRef.current = new AudioQueue(audioContextRef.current);
      
      isInitializedRef.current = true;
      console.log("Audio system initialized successfully");
    } catch (error) {
      console.error("Error initializing audio system:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize audio system';
      setAudioError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      console.log("Starting audio recording...");
      setAudioError(null);
      
      if (!isInitializedRef.current) {
        await initializeAudio();
      }

      // Stop any existing recording
      if (audioRecorderRef.current) {
        audioRecorderRef.current.stop();
        audioRecorderRef.current = null;
      }
      
      audioRecorderRef.current = new AudioRecorder((audioData) => {
        try {
          const base64Audio = encodeAudioForAPI(audioData);
          const success = sendMessage({
            type: 'input_audio_buffer.append',
            audio: base64Audio
          });
          
          if (!success) {
            console.error("Failed to send audio data - WebSocket not connected");
            setAudioError("Connection lost while recording");
            stopRecording();
          }
        } catch (error) {
          console.error("Error sending audio data:", error);
          setAudioError("Failed to process audio");
          stopRecording();
        }
      });

      await audioRecorderRef.current.start();
      setIsRecording(true);
      console.log("Audio recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to start recording';
      setAudioError(errorMessage);
      setIsRecording(false);
      throw new Error(errorMessage);
    }
  }, [sendMessage, initializeAudio]);

  const stopRecording = useCallback(() => {
    if (audioRecorderRef.current) {
      console.log("Stopping audio recording...");
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
      setIsRecording(false);
      console.log("Audio recording stopped");
    }
  }, []);

  const playAudioDelta = useCallback(async (deltaData: string) => {
    if (!deltaData || !audioQueueRef.current) {
      return;
    }

    try {
      const binaryString = atob(deltaData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      await audioQueueRef.current.addToQueue(bytes);
      setIsAISpeaking(true);
      setAudioError(null);
    } catch (audioError) {
      console.error("Error processing audio delta:", audioError);
      setAudioError("Failed to play audio response");
    }
  }, []);

  const stopAISpeaking = useCallback(() => {
    console.log("AI finished speaking");
    setIsAISpeaking(false);
    
    // Stop any playing audio
    if (audioQueueRef.current) {
      audioQueueRef.current.stop();
    }
  }, []);

  const cleanup = useCallback(() => {
    console.log("Cleaning up audio resources...");
    
    // Stop recording
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
    }
    
    // Stop audio playback
    if (audioQueueRef.current) {
      audioQueueRef.current.stop();
      audioQueueRef.current = null;
    }
    
    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    isInitializedRef.current = false;
    setIsRecording(false);
    setIsAISpeaking(false);
    setAudioError(null);
  }, []);

  // Handle audio context state changes
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && audioContextRef.current?.state === 'suspended') {
        try {
          await audioContextRef.current.resume();
          console.log("Audio context resumed");
        } catch (error) {
          console.error("Error resuming audio context:", error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isRecording,
    isAISpeaking,
    audioError,
    initializeAudio,
    startRecording,
    stopRecording,
    playAudioDelta,
    stopAISpeaking,
    cleanup
  };
};
