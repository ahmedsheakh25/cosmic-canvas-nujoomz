
import React from 'react';
import { motion } from 'framer-motion';

interface ThinkingIndicatorProps {
  currentLanguage: 'en' | 'ar';
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ currentLanguage }) => {
  const text = currentLanguage === 'ar' ? 'نجموز يفكر' : 'Najmooz is thinking';

  return (
    <div className="flex items-center gap-2 text-nujmooz-text-secondary">
      <span className="text-sm font-medium mixed-text">{text}</span>
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-1.5 h-1.5 bg-nujmooz-primary rounded-full"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ThinkingIndicator;
