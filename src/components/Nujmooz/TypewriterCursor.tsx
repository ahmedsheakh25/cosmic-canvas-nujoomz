
import React from 'react';
import { motion } from 'framer-motion';

interface TypewriterCursorProps {
  show: boolean;
  isRTL?: boolean;
}

const TypewriterCursor: React.FC<TypewriterCursorProps> = ({ show, isRTL = false }) => {
  if (!show) return null;

  return (
    <motion.span
      className="inline-block w-0.5 h-5 bg-nujmooz-text-primary ml-0.5"
      animate={{
        opacity: [1, 0, 1]
      }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        marginLeft: isRTL ? '0' : '2px',
        marginRight: isRTL ? '2px' : '0'
      }}
    />
  );
};

export default TypewriterCursor;
