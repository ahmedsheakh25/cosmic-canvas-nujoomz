
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Image, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVoiceAndImageSupport } from '@/hooks/useVoiceAndImageSupport';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';

interface VoiceImageInputProps {
  currentLanguage: 'en' | 'ar';
  onVoiceTranscript: (transcript: string) => void;
  onImageDescription: (description: string, imageUrl: string) => void;
  disabled?: boolean;
}

const VoiceImageInput: React.FC<VoiceImageInputProps> = ({
  currentLanguage,
  onVoiceTranscript,
  onImageDescription,
  disabled = false
}) => {
  const [lastMessage, setLastMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const voiceImage = useVoiceAndImageSupport(currentLanguage);
  const notifications = useNotificationSystem(currentLanguage);

  const handleVoiceToggle = async () => {
    if (voiceImage.isRecording) {
      const transcript = await voiceImage.stopVoiceRecording();
      if (transcript) {
        onVoiceTranscript(transcript);
      } else {
        notifications.notifyError(
          currentLanguage === 'ar' ? 'فشل في تحويل الصوت إلى نص' : 'Failed to convert voice to text'
        );
      }
    } else {
      const started = await voiceImage.startVoiceRecording();
      if (started) {
        notifications.notifyVoiceRecognitionStarted();
      } else {
        notifications.notifyError(
          currentLanguage === 'ar' ? 'فشل في بدء تسجيل الصوت' : 'Failed to start voice recording'
        );
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      notifications.notifyError(
        currentLanguage === 'ar' ? 'يرجى اختيار ملف صورة صحيح' : 'Please select a valid image file'
      );
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      notifications.notifyError(
        currentLanguage === 'ar' ? 'حجم الصورة كبير جداً (الحد الأقصى 5 ميجابايت)' : 'Image size too large (max 5MB)'
      );
      return;
    }

    const result = await voiceImage.handleImageUpload(file);
    
    if (result.description && result.imageUrl) {
      notifications.notifyImageUploaded();
      onImageDescription(result.description, result.imageUrl);
    } else {
      notifications.notifyError(
        currentLanguage === 'ar' ? 'فشل في معالجة الصورة' : 'Failed to process image'
      );
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSpeakLastMessage = async () => {
    if (!lastMessage) return;
    
    const success = await voiceImage.speakText(lastMessage);
    if (!success) {
      notifications.notifyError(
        currentLanguage === 'ar' ? 'فشل في تشغيل الصوت' : 'Failed to play audio'
      );
    }
  };

  // Update last message when new content comes in
  React.useEffect(() => {
    // This would typically be set from parent component with the last AI message
  }, []);

  return (
    <div className="flex items-center space-x-2">
      {/* Voice Recording Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant={voiceImage.isRecording ? "destructive" : "outline"}
          size="sm"
          onClick={handleVoiceToggle}
          disabled={disabled || voiceImage.isProcessingVoice}
          className={`${voiceImage.isRecording ? 'animate-pulse' : ''}`}
        >
          {voiceImage.isRecording ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
          {voiceImage.isProcessingVoice && (
            <span className="ml-2 text-xs">
              {currentLanguage === 'ar' ? 'معالجة...' : 'Processing...'}
            </span>
          )}
        </Button>
      </motion.div>

      {/* Image Upload Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || voiceImage.isProcessingImage}
        >
          <Image className="w-4 h-4" />
          {voiceImage.isProcessingImage && (
            <span className="ml-2 text-xs">
              {currentLanguage === 'ar' ? 'معالجة...' : 'Processing...'}
            </span>
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </motion.div>

      {/* Text to Speech Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={handleSpeakLastMessage}
          disabled={disabled || !lastMessage}
          title={currentLanguage === 'ar' ? 'تشغيل آخر رسالة صوتياً' : 'Play last message as audio'}
        >
          <Volume2 className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  );
};

export default VoiceImageInput;
