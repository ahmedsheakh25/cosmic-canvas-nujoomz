
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVoiceAndImageSupport = (currentLanguage: 'en' | 'ar') => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Voice Recording Functions
  const startVoiceRecording = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      return true;
    } catch (error) {
      console.error('Error starting voice recording:', error);
      return false;
    }
  }, []);

  const stopVoiceRecording = useCallback(async (): Promise<string | null> => {
    if (!mediaRecorderRef.current || !isRecording) return null;

    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!;
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const transcript = await processVoiceToText(audioBlob);
        
        // Clean up
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        resolve(transcript);
      };

      mediaRecorder.stop();
    });
  }, [isRecording]);

  const processVoiceToText = useCallback(async (audioBlob: Blob): Promise<string | null> => {
    setIsProcessingVoice(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.wav');
      formData.append('model', 'whisper-1');
      formData.append('language', currentLanguage === 'ar' ? 'ar' : 'en');

      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: formData
      });

      if (error) throw error;
      return data.transcript || null;
    } catch (error) {
      console.error('Error processing voice to text:', error);
      return null;
    } finally {
      setIsProcessingVoice(false);
    }
  }, [currentLanguage]);

  // Image Processing Functions
  const processImage = useCallback(async (file: File): Promise<string | null> => {
    setIsProcessingImage(true);
    try {
      // Convert image to base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const { data, error } = await supabase.functions.invoke('process-image', {
        body: { 
          image: base64Image,
          language: currentLanguage,
          prompt: currentLanguage === 'ar' ? 
            'صف هذه الصورة بالتفصيل وما يمكن أن تعنيه في سياق مشروع إبداعي' :
            'Describe this image in detail and what it might mean in the context of a creative project'
        }
      });

      if (error) throw error;
      return data.description || null;
    } catch (error) {
      console.error('Error processing image:', error);
      return null;
    } finally {
      setIsProcessingImage(false);
    }
  }, [currentLanguage]);

  const handleImageUpload = useCallback(async (file: File): Promise<{
    description: string | null;
    imageUrl: string | null;
  }> => {
    try {
      // Upload image to storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('chat-images')
        .getPublicUrl(fileName);

      // Process image for description
      const description = await processImage(file);

      return {
        description,
        imageUrl: urlData.publicUrl
      };
    } catch (error) {
      console.error('Error handling image upload:', error);
      return { description: null, imageUrl: null };
    }
  }, [processImage]);

  // Text to Speech
  const speakText = useCallback(async (text: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text,
          language: currentLanguage,
          voice: currentLanguage === 'ar' ? 'ar-SA-Standard-A' : 'en-US-Standard-A'
        }
      });

      if (error) throw error;

      // Play the audio
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      await audio.play();
      return true;
    } catch (error) {
      console.error('Error with text to speech:', error);
      return false;
    }
  }, [currentLanguage]);

  return {
    // Voice recording
    isRecording,
    isProcessingVoice,
    startVoiceRecording,
    stopVoiceRecording,
    
    // Image processing
    isProcessingImage,
    processImage,
    handleImageUpload,
    
    // Text to speech
    speakText
  };
};
