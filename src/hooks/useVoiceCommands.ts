
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface VoiceCommand {
  command: string;
  type: 'navigate' | 'action' | 'query';
  confidence: number;
}

export const useVoiceCommands = (sessionId: string, currentLanguage: 'en' | 'ar') => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<VoiceCommand | null>(null);

  const startVoiceCommandListening = useCallback(async () => {
    setIsListening(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await processVoiceCommand(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      
      // Auto-stop after 5 seconds for command detection
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsListening(false);
        }
      }, 5000);

    } catch (error) {
      console.error('Error starting voice command listening:', error);
      setIsListening(false);
    }
  }, []);

  const processVoiceCommand = useCallback(async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'command.webm');
      formData.append('language', currentLanguage);
      formData.append('mode', 'command');

      const { data, error } = await supabase.functions.invoke('process-voice-command', {
        body: formData
      });

      if (error) throw error;

      const command: VoiceCommand = {
        command: data.text,
        type: data.commandType,
        confidence: data.confidence
      };

      setLastCommand(command);

      // Save command to database
      await supabase.from('voice_commands').insert({
        session_id: sessionId,
        command_text: command.command,
        command_type: command.type,
        execution_result: { confidence: command.confidence }
      });

      return command;
    } catch (error) {
      console.error('Error processing voice command:', error);
      return null;
    } finally {
      setIsListening(false);
    }
  }, [sessionId, currentLanguage]);

  const executeCommand = useCallback((command: VoiceCommand) => {
    // Command execution logic based on type
    switch (command.type) {
      case 'navigate':
        // Handle navigation commands
        console.log('Navigation command:', command.command);
        break;
      case 'action':
        // Handle action commands
        console.log('Action command:', command.command);
        break;
      case 'query':
        // Handle query commands
        console.log('Query command:', command.command);
        break;
    }
  }, []);

  return {
    isListening,
    lastCommand,
    startVoiceCommandListening,
    executeCommand
  };
};
