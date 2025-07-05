
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

interface EnhancedProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  currentLanguage: string;
  showBriefPreview: boolean;
}

const EnhancedProgressIndicator: React.FC<EnhancedProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  currentLanguage,
  showBriefPreview
}) => {
  if (currentStep >= totalSteps || showBriefPreview) return null;

  const progress = (currentStep / totalSteps) * 100;

  return (
    <motion.div
      className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/80 text-sm font-medium">
            {currentLanguage === 'ar' 
              ? `الخطوة ${currentStep + 1} من ${totalSteps}`
              : `Step ${currentStep + 1} of ${totalSteps}`
            }
          </span>
          <span className="text-[#7EF5A5] text-sm font-bold">
            {Math.round(progress)}%
          </span>
        </div>
        
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              index < currentStep
                ? 'bg-[#7EF5A5] border-[#7EF5A5] text-black'
                : index === currentStep
                  ? 'border-[#7EF5A5] text-[#7EF5A5] bg-[#7EF5A5]/10'
                  : 'border-white/20 text-white/40'
            }`}>
              {index < currentStep ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </div>
            <span className={`text-xs mt-1 ${
              index <= currentStep ? 'text-white/80' : 'text-white/40'
            }`}>
              {index + 1}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Motivational Message */}
      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-white/60 text-sm">
          {currentLanguage === 'ar'
            ? `${totalSteps - currentStep} أسئلة متبقية للوصول لهدفك الإبداعي! ✨`
            : `${totalSteps - currentStep} questions left to reach your creative goal! ✨`
          }
        </p>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedProgressIndicator;
