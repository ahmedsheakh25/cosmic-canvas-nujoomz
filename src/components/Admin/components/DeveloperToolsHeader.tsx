
import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Bot, FileText } from 'lucide-react';

export const DeveloperToolsHeader: React.FC = () => {
  return (
    <motion.div 
      className="flex items-center justify-between"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Terminal className="w-6 h-6 text-purple-600" />
          Integrated Developer Tools
        </h2>
        <p className="text-gray-600 mt-1">
          Enhanced modal-based tools for testing, managing, and configuring Nujmooz functionality
        </p>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Bot className="w-4 h-4" />
            AI Management
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            Prompts Library
          </span>
          <span className="flex items-center gap-1">
            <Terminal className="w-4 h-4" />
            API Testing
          </span>
        </div>
      </div>
      
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">All systems operational</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
