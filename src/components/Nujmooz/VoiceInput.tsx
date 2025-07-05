
import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  language: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, language }) => {
  const [isListening, setIsListening] = useState(false);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const startListening = () => {
    resetTranscript();
    setIsListening(true);
    SpeechRecognition.startListening({ 
      continuous: true,
      language: language === 'ar' ? 'ar-SA' : 'en-US'
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsListening(false);
    if (transcript) {
      onTranscript(transcript);
      resetTranscript();
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <button
      onMouseDown={startListening}
      onMouseUp={stopListening}
      onTouchStart={startListening}
      onTouchEnd={stopListening}
      className={`p-3 rounded-full transition-all duration-200 ${
        isListening || listening
          ? 'bg-red-500 text-white animate-pulse'
          : 'bg-white/10 hover:bg-white/20 text-white'
      }`}
      title={language === 'ar' ? 'اضغط واستمر للتحدث' : 'Hold to speak'}
    >
      {isListening || listening ? (
        <MicOff className="w-5 h-5" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
    </button>
  );
};

export default VoiceInput;
