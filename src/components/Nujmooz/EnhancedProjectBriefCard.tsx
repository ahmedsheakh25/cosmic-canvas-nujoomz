
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import type { ProjectBrief } from '@/types/projectBrief';
import BriefHeader from './BriefHeader';
import BriefProgress from './BriefProgress';
import BriefSummary from './BriefSummary';
import BriefActions from './BriefActions';

interface EnhancedProjectBriefCardProps {
  currentBrief: ProjectBrief | null;
  currentLanguage: 'en' | 'ar';
  onGenerateBrief: () => void;
  onDownloadPDF?: () => void;
  pdfUrl?: string;
}

const EnhancedProjectBriefCard: React.FC<EnhancedProjectBriefCardProps> = ({
  currentBrief,
  currentLanguage,
  onGenerateBrief,
  onDownloadPDF,
  pdfUrl
}) => {
  if (!currentBrief) return null;

  const isRTL = currentLanguage === 'ar';
  const answeredQuestions = Object.keys(currentBrief.answers).length;
  const totalQuestions = 6; // عدد الأسئلة المعتادة لكل خدمة
  const progress = (answeredQuestions / totalQuestions) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mb-6 ${currentLanguage === 'ar' ? 'arabic-text' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Card className="p-6 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900 border-2 border-nujmooz-primary/20 shadow-lg backdrop-blur-sm">
        
        <BriefHeader
          service={currentBrief.service}
          status={currentBrief.status}
          currentLanguage={currentLanguage}
        />

        <BriefProgress
          answeredQuestions={answeredQuestions}
          totalQuestions={totalQuestions}
          currentLanguage={currentLanguage}
        />

        <BriefSummary
          answers={currentBrief.answers}
          currentLanguage={currentLanguage}
        />

        <BriefActions
          status={currentBrief.status}
          progress={progress}
          currentLanguage={currentLanguage}
          onGenerateBrief={onGenerateBrief}
          onDownloadPDF={onDownloadPDF}
          pdfUrl={pdfUrl}
        />

        {/* رسالة إرشادية */}
        {currentBrief.status === 'collecting' && progress < 50 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400 ${isRTL ? 'border-l-0 border-r-4 text-right' : 'text-left'}`}
          >
            <p className="text-sm text-blue-700 dark:text-blue-300 mixed-text">
              {currentLanguage === 'ar' 
                ? 'استمر في الإجابة على الأسئلة لإنشاء موجز مشروع مفصل وشامل 💡'
                : 'Continue answering questions to create a detailed and comprehensive project brief 💡'
              }
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default EnhancedProjectBriefCard;
