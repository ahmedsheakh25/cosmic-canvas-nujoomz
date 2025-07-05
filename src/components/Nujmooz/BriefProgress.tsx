
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface BriefProgressProps {
  answeredQuestions: number;
  totalQuestions: number;
  currentLanguage: 'en' | 'ar';
}

const BriefProgress: React.FC<BriefProgressProps> = ({
  answeredQuestions,
  totalQuestions,
  currentLanguage
}) => {
  const isRTL = currentLanguage === 'ar';
  const progress = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="mb-4">
      <div className={`flex justify-between items-center mb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
        <span className="text-sm font-semibold text-nujmooz-text-primary mixed-text">
          {currentLanguage === 'ar' ? 'التقدم في جمع المعلومات' : 'Information Collection Progress'}
        </span>
        <span className="text-sm text-nujmooz-text-secondary font-mono">
          {answeredQuestions}/{totalQuestions}
        </span>
      </div>
      <Progress 
        value={progress} 
        className="h-3 bg-gray-200 dark:bg-gray-700"
      />
    </div>
  );
};

export default BriefProgress;
