
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import EnhancedSessionInsights from './EnhancedSessionInsights';
import InteractiveProgressTracker from './InteractiveProgressTracker';

interface FloatingActionButtonsProps {
  showInsights: boolean;
  setShowInsights: (show: boolean) => void;
  showProgress: boolean;
  setShowProgress: (show: boolean) => void;
  insights: any;
  currentLanguage: 'en' | 'ar';
}

const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  showInsights,
  setShowInsights,
  showProgress,
  setShowProgress,
  insights,
  currentLanguage
}) => {
  const isArabic = currentLanguage === 'ar';

  // Sample progress steps - this would be dynamic based on conversation flow
  const progressSteps = [
    {
      id: 'greeting',
      title: isArabic ? 'الترحيب والتعارف' : 'Greeting & Introduction',
      description: isArabic ? 'البدء بالمحادثة وفهم الاحتياجات' : 'Starting conversation and understanding needs',
      status: 'completed' as const,
      progress: 100
    },
    {
      id: 'service_exploration',
      title: isArabic ? 'استكشاف الخدمات' : 'Service Exploration',
      description: isArabic ? 'تحديد الخدمات المطلوبة' : 'Identifying required services',
      status: 'current' as const,
      progress: 60
    },
    {
      id: 'details_collection',
      title: isArabic ? 'جمع التفاصيل' : 'Details Collection',
      description: isArabic ? 'جمع تفاصيل المشروع' : 'Collecting project details',
      status: 'upcoming' as const,
      progress: 0
    },
    {
      id: 'brief_generation',
      title: isArabic ? 'إنشاء الموجز' : 'Brief Generation',
      description: isArabic ? 'إنشاء موجز المشروع النهائي' : 'Creating final project brief',
      status: 'upcoming' as const,
      progress: 0
    }
  ];

  return (
    <motion.div
      className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
    >
      {/* Progress Tracker Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Dialog open={showProgress} onOpenChange={setShowProgress}>
          <DialogTrigger asChild>
            <Button
              className="w-12 h-12 rounded-full bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] text-black hover:shadow-lg transition-all"
              size="icon"
            >
              <BarChart3 className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-[#0A0A0A] border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-[#7EF5A5]" />
                <span>{isArabic ? 'تتبع التقدم' : 'Progress Tracker'}</span>
              </DialogTitle>
            </DialogHeader>
            <InteractiveProgressTracker
              steps={progressSteps}
              currentLanguage={currentLanguage}
              onStepClick={(stepId) => {
                console.log('Step clicked:', stepId);
                // Handle step interaction
              }}
            />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Insights Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Dialog open={showInsights} onOpenChange={setShowInsights}>
          <DialogTrigger asChild>
            <Button
              className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all"
              size="icon"
            >
              <Eye className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto bg-[#0A0A0A] border-white/20">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center space-x-2">
                <Eye className="h-5 w-5 text-purple-400" />
                <span>{isArabic ? 'رؤى الجلسة' : 'Session Insights'}</span>
              </DialogTitle>
            </DialogHeader>
            {insights && (
              <EnhancedSessionInsights
                insights={insights}
                currentLanguage={currentLanguage}
              />
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </motion.div>
  );
};

export default FloatingActionButtons;
