
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MobileLayout from '@/components/Mobile/MobileLayout';
import { useMobileDetection } from '@/hooks/useMobileDetection';

const MobileNujmooz: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('ar');
  const detection = useMobileDetection();

  // Auto-detect language from browser on mobile
  useEffect(() => {
    if (detection.isMobile) {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ar')) {
        setCurrentLanguage('ar');
      }
    }
  }, [detection.isMobile]);

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  // Redirect to desktop version if not mobile
  if (detection.isDesktop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8"
        >
          <h1 className="text-2xl font-bold mb-4">
            {currentLanguage === 'ar' ? 'الرجاء استخدام الهاتف المحمول' : 'Please use mobile device'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentLanguage === 'ar' 
              ? 'هذه الصفحة مُحسّنة للهواتف المحمولة' 
              : 'This page is optimized for mobile devices'
            }
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <MobileLayout
      currentLanguage={currentLanguage}
      onLanguageToggle={handleLanguageToggle}
    />
  );
};

export default MobileNujmooz;
