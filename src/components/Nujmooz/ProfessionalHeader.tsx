
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfessionalHeaderProps {
  currentLanguage: 'en' | 'ar';
  onLanguageToggle: () => void;
}

const ProfessionalHeader: React.FC<ProfessionalHeaderProps> = ({
  currentLanguage,
  onLanguageToggle
}) => {
  return (
    <motion.header 
      className="h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - Company branding */}
        <motion.div 
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {/* Company Logo */}
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">OF</span>
          </div>
          
          {/* Company Name & Nujmooz */}
          <div className="flex items-center space-x-3">
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                OfSpace Studio
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                Digital Creative Studio
              </p>
            </div>
            
            {/* Separator */}
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
            
            {/* Nujmooz branding */}
            <div className="flex items-center space-x-2">
              <motion.div 
                className="w-8 h-8 gradient-bg-primary rounded-lg flex items-center justify-center shadow-md"
                animate={{ 
                  boxShadow: [
                    "0 4px 6px -1px rgba(59, 130, 246, 0.1)",
                    "0 10px 15px -3px rgba(59, 130, 246, 0.2)",
                    "0 4px 6px -1px rgba(59, 130, 246, 0.1)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </motion.div>
              <div>
                <h2 className="text-sm font-semibold text-nujmooz-primary mixed-text">
                  {currentLanguage === 'ar' ? 'نجموز' : 'Nujmooz'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-0.5 mixed-text">
                  {currentLanguage === 'ar' ? 'مساعدك الذكي' : 'AI Assistant'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right side - Controls */}
        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onLanguageToggle}
            className="h-8 px-3 text-gray-600 dark:text-gray-300 hover:text-nujmooz-primary hover:bg-nujmooz-primary/10"
          >
            <Globe className="w-4 h-4 mr-1" />
            <span className="text-xs mixed-text">
              {currentLanguage === 'ar' ? 'English' : 'العربية'}
            </span>
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-600 dark:text-gray-300 hover:text-nujmooz-primary hover:bg-nujmooz-primary/10"
          >
            <Settings className="w-4 h-4" />
          </Button>

          {/* Connection Status */}
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-700 dark:text-green-400 mixed-text">
              {currentLanguage === 'ar' ? 'متصل' : 'Connected'}
            </span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default ProfessionalHeader;
