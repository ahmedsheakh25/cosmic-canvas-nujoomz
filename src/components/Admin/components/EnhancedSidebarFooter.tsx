
import React from 'react';
import { motion } from 'framer-motion';

const EnhancedSidebarFooter: React.FC = () => {
  return (
    <motion.div 
      className="p-6 border-t border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
    >
      <div className="text-center text-xs text-gray-400">
        <motion.div
          className="cosmic-float"
        >
          🛸 OfSpace Studio Admin v2.0
        </motion.div>
        <div className="mt-2">Enhanced with Framer Motion</div>
      </div>
    </motion.div>
  );
};

export default EnhancedSidebarFooter;
