
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface BriefSummaryProps {
  answers: Record<string, string>;
  currentLanguage: 'en' | 'ar';
}

const BriefSummary: React.FC<BriefSummaryProps> = ({
  answers,
  currentLanguage
}) => {
  const isRTL = currentLanguage === 'ar';
  const answeredQuestions = Object.keys(answers).length;

  if (answeredQuestions === 0) return null;

  return (
    <div className="mb-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-gray-200/50">
      <h4 className={`text-sm font-semibold text-nujmooz-text-primary mb-3 flex items-center gap-2 mixed-text ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
        <CheckCircle className="w-4 h-4 text-green-500" />
        {currentLanguage === 'ar' ? 'المعلومات المجمعة:' : 'Collected Information:'}
      </h4>
      <div className="space-y-2">
        {Object.entries(answers).slice(0, 3).map(([key, value], index) => (
          <div key={key} className={`text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
            <span className="font-medium text-nujmooz-text-primary">
              {currentLanguage === 'ar' ? `السؤال ${index + 1}:` : `Q${index + 1}:`}
            </span>
            <span className="text-nujmooz-text-secondary ml-2 truncate block">
              {value.length > 50 ? `${value.substring(0, 50)}...` : value}
            </span>
          </div>
        ))}
        {answeredQuestions > 3 && (
          <div className={`text-xs text-nujmooz-text-muted ${isRTL ? 'text-right' : 'text-left'}`}>
            {currentLanguage === 'ar' 
              ? `+ ${answeredQuestions - 3} إجابات أخرى` 
              : `+ ${answeredQuestions - 3} more answers`
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default BriefSummary;
