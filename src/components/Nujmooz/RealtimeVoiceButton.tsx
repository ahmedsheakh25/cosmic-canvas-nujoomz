
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RealtimeVoiceInterface from './RealtimeVoiceInterface';

interface RealtimeVoiceButtonProps {
  sessionId: string;
  currentLanguage: 'en' | 'ar';
  disabled?: boolean;
}

const RealtimeVoiceButton: React.FC<RealtimeVoiceButtonProps> = ({
  sessionId,
  currentLanguage,
  disabled = false
}) => {
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setShowVoiceInterface(true)}
          disabled={disabled}
          size="sm"
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 shadow-lg"
          title={currentLanguage === 'ar' 
            ? 'محادثة صوتية مع نجموز' 
            : 'Voice chat with Nujmooz'
          }
        >
          <PhoneCall className="w-4 h-4 mr-2" />
          {currentLanguage === 'ar' ? 'مكالمة صوتية' : 'Voice Call'}
        </Button>
      </motion.div>

      {showVoiceInterface && (
        <RealtimeVoiceInterface
          sessionId={sessionId}
          currentLanguage={currentLanguage}
          onClose={() => setShowVoiceInterface(false)}
        />
      )}
    </>
  );
};

export default RealtimeVoiceButton;
