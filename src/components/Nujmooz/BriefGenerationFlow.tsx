
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ProjectBrief } from '@/types/projectBrief';

interface BriefGenerationFlowProps {
  currentBrief: ProjectBrief | null;
  currentLanguage: 'en' | 'ar';
  onGenerateBrief: () => void;
  isLoading?: boolean;
}

const BriefGenerationFlow: React.FC<BriefGenerationFlowProps> = ({
  currentBrief,
  currentLanguage,
  onGenerateBrief,
  isLoading = false
}) => {
  if (!currentBrief || currentBrief.status === 'complete') return null;

  const isRTL = currentLanguage === 'ar';
  const answeredQuestions = Object.keys(currentBrief.answers).length;
  const totalQuestions = 5; // Assuming 5 questions per service
  const progress = (answeredQuestions / totalQuestions) * 100;

  const serviceNames = {
    ar: {
      branding: 'الهوية التجارية',
      website: 'تطوير الموقع',
      marketing: 'التسويق الرقمي',
      motion: 'الموشن جرافيك',
      photography: 'التصوير',
      uiux: 'تجربة المستخدم'
    },
    en: {
      branding: 'Brand Identity',
      website: 'Website Development',
      marketing: 'Digital Marketing',
      motion: 'Motion Graphics',
      photography: 'Photography',
      uiux: 'UI/UX Design'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-4 ${currentLanguage === 'ar' ? 'arabic-text' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <Card className="p-4 bg-gradient-to-r from-nujmooz-surface/50 to-nujmooz-surface/30 border-nujmooz-border/50">
        {/* Service Header */}
        <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="w-8 h-8 bg-nujmooz-primary/20 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-nujmooz-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-nujmooz-text-primary mixed-text">
              {currentLanguage === 'ar' ? 'موجز المشروع' : 'Project Brief'}
            </h3>
            <p className="text-sm text-nujmooz-text-secondary mixed-text">
              {serviceNames[currentLanguage][currentBrief.service as keyof typeof serviceNames['en']] || currentBrief.service}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className={`flex justify-between items-center mb-2 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <span className="text-sm font-medium text-nujmooz-text-primary mixed-text">
              {currentLanguage === 'ar' ? 'التقدم' : 'Progress'}
            </span>
            <span className="text-sm text-nujmooz-text-secondary mixed-text">
              {answeredQuestions}/{totalQuestions}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-nujmooz-primary to-nujmooz-primary/80 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Current Answers Summary */}
        {answeredQuestions > 0 && (
          <div className="mb-4">
            <h4 className={`text-sm font-medium text-nujmooz-text-primary mb-2 mixed-text ${isRTL ? 'text-right' : 'text-left'}`}>
              {currentLanguage === 'ar' ? 'الإجابات المجمعة:' : 'Collected Answers:'}
            </h4>
            <div className="space-y-1">
              {Object.entries(currentBrief.answers).slice(0, 3).map(([key, value], index) => (
                <div key={key} className={`text-xs text-nujmooz-text-secondary truncate ${isRTL ? 'text-right' : 'text-left'}`}>
                  <span className="font-medium">Q{index + 1}:</span> {value}
                </div>
              ))}
              {answeredQuestions > 3 && (
                <div className={`text-xs text-nujmooz-text-muted ${isRTL ? 'text-right' : 'text-left'}`}>
                  {currentLanguage === 'ar' ? `+${answeredQuestions - 3} إجابات أخرى` : `+${answeredQuestions - 3} more answers`}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generate Brief Button - only show when collecting */}
        {currentBrief.status === 'collecting' && progress >= 60 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={onGenerateBrief}
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-nujmooz-primary to-nujmooz-primary/90 hover:from-nujmooz-primary/90 hover:to-nujmooz-primary text-white ${
                isRTL ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  <span className="mixed-text">
                    {currentLanguage === 'ar' ? 'جاري الإنشاء...' : 'Generating...'}
                  </span>
                </>
              ) : (
                <>
                  <Send className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  <span className="mixed-text">
                    {currentLanguage === 'ar' ? 'إنشاء موجز المشروع' : 'Generate Project Brief'}
                  </span>
                </>
              )}
            </Button>
          </motion.div>
        )}

        {/* Status indicator for generating state */}
        {currentBrief.status === 'generating' && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-blue-700 dark:text-blue-300 mixed-text">
              {currentLanguage === 'ar' 
                ? 'جاري إنشاء موجز المشروع...' 
                : 'Generating project brief...'
              }
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default BriefGenerationFlow;
