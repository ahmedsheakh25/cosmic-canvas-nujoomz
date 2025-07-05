
import React from 'react';
import { motion } from 'framer-motion';

const LoadingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="max-w-2xl">
        <div className="text-sm text-white/60 mb-2 font-medium">
          Nujmooz 👽
        </div>
        <div className="bg-white/10 text-white border border-white/20 p-4 rounded-2xl shadow-lg">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingIndicator;
