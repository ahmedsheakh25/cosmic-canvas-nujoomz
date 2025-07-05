
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import ThinkingIndicator from './ThinkingIndicator';

interface LoadingMessageProps {
  currentLanguage: 'en' | 'ar';
}

const LoadingMessage: React.FC<LoadingMessageProps> = ({ currentLanguage }) => {
  const isRTL = currentLanguage === 'ar';
  
  // RTL-aware classes
  const rtlClasses = {
    justify: isRTL ? 'justify-end' : 'justify-start',
    margin: isRTL ? 'ml-12' : 'mr-12',
    headerJustify: isRTL ? 'justify-end' : 'justify-start',
    flexRow: isRTL ? 'flex-row-reverse' : 'flex-row',
    spaceReverse: isRTL ? 'space-x-reverse' : '',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${rtlClasses.justify}`}
    >
      <div className={`max-w-2xl ${rtlClasses.margin}`}>
        <div className={`flex items-center gap-2 mb-2 ${rtlClasses.flexRow} ${rtlClasses.spaceReverse} ${rtlClasses.headerJustify}`}>
          <div className="w-8 h-8 gradient-bg-primary rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-medium text-nujmooz-text-secondary mixed-text">
            {currentLanguage === 'ar' ? 'نجموز' : 'Najmooz'}
          </span>
        </div>
        <Card className="p-4 bg-nujmooz-surface border border-nujmooz-border backdrop-blur-xl">
          <ThinkingIndicator currentLanguage={currentLanguage} />
        </Card>
      </div>
    </motion.div>
  );
};

export default LoadingMessage;
