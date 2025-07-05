
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SmartSuggestionsProps {
  suggestions: string[];
  currentLanguage: 'en' | 'ar';
  onSuggestionClick: (suggestion: string) => void;
  isLoading?: boolean;
}

const SmartSuggestionsPanel: React.FC<SmartSuggestionsProps> = ({
  suggestions,
  currentLanguage,
  onSuggestionClick,
  isLoading = false
}) => {
  const isRTL = currentLanguage === 'ar';

  if (suggestions.length === 0 && !isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mb-4 ${currentLanguage === 'ar' ? 'arabic-text' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="bg-gradient-to-r from-blue-50/80 via-white/80 to-purple-50/80 dark:from-gray-800/80 dark:via-gray-700/80 dark:to-gray-800/80 rounded-xl p-4 border border-nujmooz-primary/20 backdrop-blur-sm shadow-sm">
        
        {/* العنوان */}
        <div className={`flex items-center gap-3 mb-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="w-8 h-8 bg-gradient-to-br from-nujmooz-primary to-nujmooz-primary/80 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <h4 className="font-semibold text-nujmooz-text-primary mixed-text">
            {currentLanguage === 'ar' ? 'اقتراحات ذكية' : 'Smart Suggestions'}
          </h4>
        </div>

        {/* الاقتراحات */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-4"
            >
              <div className="flex items-center gap-2 text-nujmooz-text-secondary">
                <div className="w-4 h-4 border-2 border-nujmooz-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm mixed-text">
                  {currentLanguage === 'ar' ? 'جاري تحضير الاقتراحات...' : 'Preparing suggestions...'}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2"
            >
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={`${suggestion}-${index}`}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => onSuggestionClick(suggestion)}
                    className={`w-full justify-start p-3 h-auto text-sm text-nujmooz-text-secondary hover:text-nujmooz-primary hover:bg-nujmooz-primary/10 transition-all duration-200 border border-transparent hover:border-nujmooz-primary/30 rounded-lg ${
                      isRTL ? 'text-right flex-row-reverse' : 'text-left'
                    }`}
                  >
                    <MessageCircle className={`w-4 h-4 flex-shrink-0 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    <span className="mixed-text leading-relaxed break-words">
                      {suggestion}
                    </span>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* رسالة إرشادية */}
        {suggestions.length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className={`mt-3 flex items-center gap-2 text-xs text-nujmooz-text-muted ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
          >
            <Lightbulb className="w-3 h-3" />
            <span className="mixed-text">
              {currentLanguage === 'ar' 
                ? 'اضغط على أي اقتراح لاستخدامه أو اكتب رسالتك الخاصة'
                : 'Click any suggestion to use it or type your own message'
              }
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SmartSuggestionsPanel;
