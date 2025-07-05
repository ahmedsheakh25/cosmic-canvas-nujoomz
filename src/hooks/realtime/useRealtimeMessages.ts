
import { useCallback } from 'react';
import type { RealtimeMessage } from './types';

interface MessageHandlers {
  onAudioDelta: (delta: string) => void;
  onAudioDone: () => void;
  onSpeechStarted: () => void;
  onSpeechStopped: () => void;
  onError: (message: string) => void;
  onConnectionClosed: (reason: string) => void;
}

export const useRealtimeMessages = (handlers: MessageHandlers) => {
  const handleMessage = useCallback((message: RealtimeMessage) => {
    switch (message.type) {
      case 'session.created':
        console.log("OpenAI session created successfully");
        break;

      case 'session.updated':
        console.log("OpenAI session updated successfully");
        break;

      case 'response.audio.delta':
        if (message.delta) {
          handlers.onAudioDelta(message.delta);
        }
        break;

      case 'response.audio.done':
        handlers.onAudioDone();
        break;

      case 'input_audio_buffer.speech_started':
        console.log("User started speaking");
        handlers.onSpeechStarted();
        break;

      case 'input_audio_buffer.speech_stopped':
        console.log("User stopped speaking");
        handlers.onSpeechStopped();
        break;

      case 'error':
        console.error("Received error from server:", message.message);
        handlers.onError(message.message || 'An error occurred');
        break;

      case 'connection_closed':
        console.log("Connection closed by server:", message.reason);
        handlers.onConnectionClosed(message.reason || 'Unknown reason');
        break;

      default:
        console.log("Received unknown message type:", message.type);
        break;
    }
  }, [handlers]);

  const createTextMessage = useCallback((text: string) => {
    return {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{
          type: 'input_text',
          text
        }]
      }
    };
  }, []);

  const createResponseTrigger = useCallback(() => {
    return { type: 'response.create' };
  }, []);

  return {
    handleMessage,
    createTextMessage,
    createResponseTrigger
  };
};
