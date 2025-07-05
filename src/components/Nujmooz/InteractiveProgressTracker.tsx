
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, ArrowRight, Sparkles } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  progress: number;
}

interface InteractiveProgressTrackerProps {
  steps: ProgressStep[];
  currentLanguage: 'en' | 'ar';
  onStepClick?: (stepId: string) => void;
}

const InteractiveProgressTracker: React.FC<InteractiveProgressTrackerProps> = ({
  steps,
  currentLanguage,
  onStepClick
}) => {
  const isArabic = currentLanguage === 'ar';
  const overallProgress = (steps.filter(s => s.status === 'completed').length / steps.length) * 100;

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500 border-green-500';
      case 'current': return 'text-[#7EF5A5] border-[#7EF5A5]';
      default: return 'text-white/40 border-white/20';
    }
  };

  const getStepBg = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20';
      case 'current': return 'bg-[#7EF5A5]/20';
      default: return 'bg-white/5';
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border border-white/10 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Sparkles className="h-6 w-6 text-[#7EF5A5]" />
          <h3 className="text-white text-lg font-semibold">
            {isArabic ? 'تتبع التقدم التفاعلي' : 'Interactive Progress Tracker'}
          </h3>
        </div>
        <div className="text-right">
          <div className="text-[#7EF5A5] text-2xl font-bold">
            {Math.round(overallProgress)}%
          </div>
          <div className="text-white/60 text-sm">
            {isArabic ? 'مكتمل' : 'Complete'}
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Progress 
          value={overallProgress} 
          className="h-3 bg-white/10"
        />
        <div className="flex justify-between mt-2 text-xs text-white/60">
          <span>{isArabic ? 'البداية' : 'Start'}</span>
          <span>{isArabic ? 'الإكمال' : 'Completion'}</span>
        </div>
      </motion.div>

      {/* Steps */}
      <div className="space-y-4">
        <AnimatePresence>
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02] ${getStepColor(step.status)} ${getStepBg(step.status)}`}
              initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isArabic ? -20 : 20 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onStepClick?.(step.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-4">
                {/* Step Icon */}
                <motion.div
                  className="flex-shrink-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                >
                  {step.status === 'completed' ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : step.status === 'current' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Circle className="h-6 w-6 text-[#7EF5A5]" />
                    </motion.div>
                  ) : (
                    <Circle className="h-6 w-6 text-white/40" />
                  )}
                </motion.div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold ${
                      step.status === 'completed' ? 'text-green-400' :
                      step.status === 'current' ? 'text-[#7EF5A5]' : 'text-white/60'
                    }`}>
                      {step.title}
                    </h4>
                    {step.status === 'current' && (
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-[#7EF5A5] text-sm font-bold"
                      >
                        {Math.round(step.progress)}%
                      </motion.div>
                    )}
                  </div>
                  <p className="text-white/60 text-sm mt-1">
                    {step.description}
                  </p>
                  
                  {/* Current Step Progress */}
                  {step.status === 'current' && (
                    <motion.div
                      className="mt-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ delay: 0.3 }}
                    >
                      <Progress 
                        value={step.progress} 
                        className="h-2 bg-white/10"
                      />
                    </motion.div>
                  )}
                </div>

                {/* Arrow for non-completed steps */}
                {step.status !== 'completed' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <ArrowRight className={`h-5 w-5 ${
                      step.status === 'current' ? 'text-[#7EF5A5]' : 'text-white/40'
                    }`} />
                  </motion.div>
                )}
              </div>

              {/* Glow effect for current step */}
              {step.status === 'current' && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-[#7EF5A5]/10 -z-10"
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(126, 245, 165, 0.3)',
                      '0 0 0 10px rgba(126, 245, 165, 0)',
                      '0 0 0 0 rgba(126, 245, 165, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <motion.div
        className="mt-6 flex justify-center space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          className="px-6 py-2 bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] text-black font-semibold rounded-lg hover:shadow-lg transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const currentStep = steps.find(s => s.status === 'current');
            if (currentStep) onStepClick?.(currentStep.id);
          }}
        >
          {isArabic ? 'متابعة الخطوة الحالية' : 'Continue Current Step'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default InteractiveProgressTracker;
