
import React from 'react';
import { motion } from 'framer-motion';

interface SuggestedRepliesProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  currentLanguage: string;
}

const SuggestedReplies: React.FC<SuggestedRepliesProps> = ({ 
  suggestions, 
  onSelect, 
  currentLanguage 
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(suggestion)}
          className="px-3 py-2 text-sm bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white transition-all duration-200"
        >
          {suggestion}
        </motion.button>
      ))}
    </div>
  );
};

export default SuggestedReplies;
