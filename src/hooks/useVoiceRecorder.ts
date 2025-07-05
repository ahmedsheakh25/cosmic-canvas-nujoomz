import { useState, useCallback, useEffect } from 'react';

interface VoiceRecorderOptions {
  onRecordingComplete: (blob: Blob) => void;
  maxDuration?: number;
  onError?: (error: Error) => void;
}

export function useVoiceRecorder({
  onRecordingComplete,
  maxDuration = 60000, // 1 minute default
  onError
}: VoiceRecorderOptions) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);

  const handleError = useCallback((error: Error) => {
    console.error('Voice recorder error:', error);
    onError?.(error);
  }, [onError]);

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, e.data]);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        setAudioChunks([]);
        setRecordingDuration(0);
        if (recordingTimer) {
          clearInterval(recordingTimer);
          setRecordingTimer(null);
        }
      };

      recorder.onerror = (e) => {
        handleError(new Error('MediaRecorder error: ' + (e as any).error?.message || 'Unknown error'));
      };

      setMediaRecorder(recorder);
      setHasPermission(true);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Unknown error requesting microphone'));
      setHasPermission(false);
    }
  }, [onRecordingComplete, audioChunks, handleError, recordingTimer]);

  const startRecording = useCallback(() => {
    if (mediaRecorder && !isRecording) {
      try {
        mediaRecorder.start(1000); // Collect data every second
        setIsRecording(true);

        // Start duration timer
        const timer = setInterval(() => {
          setRecordingDuration((duration) => {
            if (duration >= maxDuration) {
              stopRecording();
              return 0;
            }
            return duration + 1000;
          });
        }, 1000);
        setRecordingTimer(timer);

        // Stop recording after maxDuration
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            stopRecording();
          }
        }, maxDuration);
      } catch (error) {
        handleError(error instanceof Error ? error : new Error('Failed to start recording'));
      }
    }
  }, [mediaRecorder, isRecording, maxDuration, handleError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      try {
        mediaRecorder.stop();
        setIsRecording(false);
        if (recordingTimer) {
          clearInterval(recordingTimer);
          setRecordingTimer(null);
        }
      } catch (error) {
        handleError(error instanceof Error ? error : new Error('Failed to stop recording'));
      }
    }
  }, [mediaRecorder, isRecording, recordingTimer, handleError]);

  useEffect(() => {
    // Check if browser supports MediaRecorder
    if (!('MediaRecorder' in window)) {
      handleError(new Error('MediaRecorder is not supported in this browser'));
      return;
    }

    // Clean up on unmount
    return () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
    };
  }, [mediaRecorder, recordingTimer, handleError]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    hasRecordingPermission: hasPermission,
    requestPermission,
    recordingDuration,
    progress: (recordingDuration / maxDuration) * 100
  };
} 