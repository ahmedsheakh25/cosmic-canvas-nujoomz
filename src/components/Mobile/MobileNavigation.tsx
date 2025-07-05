
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  currentLanguage: 'en' | 'ar';
  onLanguageToggle: () => void;
  isVoiceActive?: boolean;
  onVoiceToggle?: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isOpen,
  onToggle,
  currentLanguage,
  onLanguageToggle,
  isVoiceActive = false,
  onVoiceToggle
}) => {
  return (
    <>
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">👽</span>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {currentLanguage === 'ar' ? 'نجموز' : 'Nujmooz'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Voice Toggle */}
            {onVoiceToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onVoiceToggle}
                className={`rounded-full ${isVoiceActive ? 'bg-green-100 text-green-600 dark:bg-green-900/20' : ''}`}
              >
                {isVoiceActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>
            )}

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onLanguageToggle}
              className="rounded-full min-w-[2.5rem]"
            >
              <span className="font-medium">
                {currentLanguage === 'ar' ? 'EN' : 'ع'}
              </span>
            </Button>

            {/* Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="rounded-full"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={onToggle}
            />
            
            <motion.div
              initial={{ x: currentLanguage === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: currentLanguage === 'ar' ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`fixed top-0 ${currentLanguage === 'ar' ? 'left-0' : 'right-0'} h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 z-50 shadow-2xl lg:hidden`}
              dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">
                    {currentLanguage === 'ar' ? 'القائمة' : 'Menu'}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={onToggle}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Chat Options */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {currentLanguage === 'ar' ? 'المحادثة' : 'Chat'}
                  </h3>
                  
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-left"
                    onClick={onToggle}
                  >
                    <MessageCircle className="w-5 h-5" />
                    {currentLanguage === 'ar' ? 'محادثة جديدة' : 'New Chat'}
                  </Button>
                </div>

                {/* Settings */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {currentLanguage === 'ar' ? 'الإعدادات' : 'Settings'}
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <span className="text-sm">
                        {currentLanguage === 'ar' ? 'اللغة' : 'Language'}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onLanguageToggle}
                        className="h-8 w-16"
                      >
                        {currentLanguage === 'ar' ? 'EN' : 'عربي'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation;
