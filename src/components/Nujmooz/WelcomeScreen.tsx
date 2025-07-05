
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeScreenProps {
  showWelcomeAnimation: boolean;
  currentLanguage: 'en' | 'ar';
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  showWelcomeAnimation, 
  currentLanguage 
}) => {
  if (!showWelcomeAnimation) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center z-50"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center">
          <motion.div
            className="w-24 h-24 bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "backOut" }}
          >
            <motion.span
              className="text-4xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              👽
            </motion.span>
          </motion.div>
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-white via-[#7EF5A5] to-white bg-clip-text text-transparent mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            {currentLanguage === 'ar' ? 'نجموز' : 'Nujmooz'}
          </motion.h1>
          <motion.p
            className="text-white/60"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            {currentLanguage === 'ar' ? 'مساعدك الكوني الإبداعي' : 'Your Cosmic Creative Assistant'}
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomeScreen;
