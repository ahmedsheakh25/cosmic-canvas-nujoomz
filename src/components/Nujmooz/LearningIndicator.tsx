
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LearningIndicatorProps {
  isLearning: boolean;
  currentLanguage: 'en' | 'ar';
}

const LearningIndicator: React.FC<LearningIndicatorProps> = ({
  isLearning,
  currentLanguage
}) => {
  const isArabic = currentLanguage === 'ar';

  return (
    <AnimatePresence>
      {isLearning && (
        <motion.div
          className="fixed top-16 right-4 z-40"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="bg-gradient-to-r from-[#7EF5A5]/20 to-[#4AE374]/20 backdrop-blur-sm border border-[#7EF5A5]/30 rounded-lg px-3 py-2">
            <div className="flex items-center space-x-2">
              <motion.div
                className="w-2 h-2 bg-[#7EF5A5] rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[#7EF5A5] text-xs font-medium">
                {isArabic ? 'جاري التعلم...' : 'Learning...'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LearningIndicator;
