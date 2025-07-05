
import { useEffect, useCallback, useState } from 'react';
import { useRealtimeConnection } from './useRealtimeConnection';
import { useRealtimeAudio } from './useRealtimeAudio';
import { useRealtimeMessages } from './useRealtimeMessages';

export const useRealtimeVoiceChat = (sessionId: string) => {
  const [overallError, setOverallError] = useState<string | null>(null);

  const {
    isConnected,
    sessionReady,
    connectionStatus,
    error: connectionError,
    messages,
    connect,
    disconnect,
    sendMessage
  } = useRealtimeConnection({
    sessionId,
    onMessage: () => {},
    onConnected: () => {},
    onDisconnected: () => {},
    onError: () => {}
  });

  const {
    isRecording,
    isAISpeaking,
    audioError,
    initializeAudio,
    startRecording,
    stopRecording,
    playAudioDelta,
    stopAISpeaking,
    cleanup: cleanupAudio
  } = useRealtimeAudio(sendMessage);

  const messageHandlers = {
    onAudioDelta: playAudioDelta,
    onAudioDone: stopAISpeaking,
    onSpeechStarted: () => {
      console.log("User started speaking");
    },
    onSpeechStopped: () => {
      console.log("User stopped speaking");
    },
    onError: (message: string) => {
      console.error("Message handler error:", message);
      setOverallError(message);
    },
    onConnectionClosed: (reason: string) => {
      console.log("Connection closed:", reason);
      setOverallError(`Connection closed: ${reason}`);
    }
  };

  const { handleMessage, createTextMessage, createResponseTrigger } = useRealtimeMessages(messageHandlers);

  useEffect(() => {
    if (messages.length > 0) {
      const latestMessage = messages[messages.length - 1];
      handleMessage(latestMessage);
    }
  }, [messages, handleMessage]);

  const combinedError = overallError || connectionError || audioError;

  const connectWithAudio = useCallback(async () => {
    try {
      console.log("Starting connection with audio for session:", sessionId);
      setOverallError(null);
      
      await initializeAudio();
      console.log("Audio initialized, connecting to WebSocket...");
      
      await connect();
      console.log("Connection established successfully");
    } catch (error) {
      console.error('Error connecting with audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect';
      setOverallError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [initializeAudio, connect, sessionId]);

  const sendTextMessage = useCallback((text: string) => {
    if (!isConnected || !sessionReady) {
      const errorMsg = sessionReady ? "Not connected to voice chat service" : "Session not ready - please wait";
      console.error(errorMsg);
      setOverallError(errorMsg);
      return false;
    }

    if (!text.trim()) {
      console.error("Cannot send empty message");
      return false;
    }

    console.log("Sending text message:", text);
    
    try {
      const textMessage = createTextMessage(text);
      const responseMessage = createResponseTrigger();
      
      const success1 = sendMessage(textMessage);
      const success2 = sendMessage(responseMessage);
      
      const success = success1 && success2;
      
      if (!success) {
        setOverallError("Failed to send message");
      } else {
        setOverallError(null);
      }
      
      return success;
    } catch (error) {
      console.error("Error sending text message:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      setOverallError(errorMessage);
      return false;
    }
  }, [isConnected, sessionReady, sendMessage, createTextMessage, createResponseTrigger]);

  const safeStartRecording = useCallback(async () => {
    if (!sessionReady) {
      setOverallError("Session not ready - please wait for connection to complete");
      return;
    }
    
    try {
      await startRecording();
      setOverallError(null);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  }, [startRecording, sessionReady]);

  const cleanup = useCallback(() => {
    console.log("Cleaning up voice chat...");
    cleanupAudio();
    disconnect();
    setOverallError(null);
  }, [cleanupAudio, disconnect]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    isConnected,
    sessionReady,
    isRecording,
    isAISpeaking,
    connectionStatus,
    messages,
    error: combinedError,
    connect: connectWithAudio,
    disconnect,
    startRecording: safeStartRecording,
    stopRecording,
    sendTextMessage
  };
};
