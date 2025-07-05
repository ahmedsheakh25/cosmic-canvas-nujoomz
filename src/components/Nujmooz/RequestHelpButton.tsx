
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RequestHelpButtonProps {
  sessionId: string;
  currentLanguage: string;
}

const RequestHelpButton: React.FC<RequestHelpButtonProps> = ({ sessionId, currentLanguage }) => {
  const [isRequested, setIsRequested] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestHelp = async () => {
    if (isRequested || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Save help request to database using the correct table structure
      const { error } = await supabase
        .from('chat_conversations')
        .insert({
          session_id: sessionId,
          message: currentLanguage === 'ar' 
            ? '🆘 طلب مساعدة من الفريق - يحتاج المستخدم دعم إضافي'
            : '🆘 Help request from team - User needs additional support',
          sender: 'system',
          language: currentLanguage
        });

      if (error) throw error;

      setIsRequested(true);
      
      toast.success(
        currentLanguage === 'ar'
          ? '✅ تم إرسال طلبك، فريقنا بيتواصل معك قريباً! 🚀'
          : '✅ Request sent, our team will contact you soon! 🚀'
      );
    } catch (error) {
      console.error('Error requesting help:', error);
      toast.error(
        currentLanguage === 'ar'
          ? '❌ حدث خطأ في إرسال الطلب'
          : '❌ Error sending request'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed bottom-24 right-6 z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: "spring", stiffness: 300 }}
    >
      <motion.button
        onClick={handleRequestHelp}
        disabled={isRequested || isLoading}
        className={`w-14 h-14 rounded-full shadow-lg backdrop-blur-sm border transition-all duration-300 flex items-center justify-center ${
          isRequested 
            ? 'bg-green-500/20 border-green-500/30 text-green-400'
            : 'bg-purple-600/20 hover:bg-purple-600/30 border-purple-500/30 text-purple-300 hover:text-purple-200'
        }`}
        whileHover={!isRequested ? { scale: 1.1, y: -2 } : {}}
        whileTap={!isRequested ? { scale: 0.9 } : {}}
        title={currentLanguage === 'ar' ? 'طلب مساعدة من الفريق' : 'Request help from team'}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              className="w-5 h-5 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin"
            />
          ) : isRequested ? (
            <motion.div
              key="success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-green-400"
            >
              <Check className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="users"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <Users className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
      
      {/* Floating tooltip */}
      {!isRequested && (
        <motion.div
          className="absolute bottom-16 right-0 bg-black/80 text-white text-xs py-2 px-3 rounded-lg whitespace-nowrap backdrop-blur-sm border border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
          dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
        >
          {currentLanguage === 'ar' ? '👤 طلب مساعدة من الفريق' : '👤 Request team help'}
        </motion.div>
      )}
    </motion.div>
  );
};

export default RequestHelpButton;
