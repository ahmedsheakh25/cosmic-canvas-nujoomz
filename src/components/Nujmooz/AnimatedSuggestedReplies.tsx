
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

interface AnimatedSuggestedRepliesProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  currentLanguage: string;
}

const AnimatedSuggestedReplies: React.FC<AnimatedSuggestedRepliesProps> = ({ 
  suggestions, 
  onSelect, 
  currentLanguage 
}) => {
  if (suggestions.length === 0) return null;

  return (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      <motion.div 
        className="flex items-center space-x-2 mb-3 text-sm text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Zap className="w-4 h-4 text-[#7EF5A5]" />
        <span>
          {currentLanguage === 'ar' ? 'اقتراحات سريعة' : 'Quick suggestions'}
        </span>
      </motion.div>
      
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={`${suggestion}-${index}`}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 400,
                damping: 25
              }}
              onClick={() => onSelect(suggestion)}
              className="group relative overflow-hidden px-4 py-2 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all duration-200 backdrop-blur-sm"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 5px 15px rgba(126, 245, 165, 0.2)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "linear"
                }}
              />
              
              <span className="relative z-10">{suggestion}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AnimatedSuggestedReplies;
