
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModernSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: 'en' | 'ar';
  onNewChat: () => void;
}

const ModernSidebar: React.FC<ModernSidebarProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onNewChat
}) => {
  const sidebarItems = [
    {
      icon: Plus,
      label: currentLanguage === 'ar' ? 'محادثة جديدة' : 'New Chat',
      action: onNewChat
    },
    {
      icon: Search,
      label: currentLanguage === 'ar' ? 'بحث' : 'Search',
      action: () => console.log('Search clicked')
    },
    {
      icon: Settings,
      label: currentLanguage === 'ar' ? 'الإعدادات' : 'Settings',
      action: () => console.log('Settings clicked')
    }
  ];

  // RTL-aware classes
  const rtlClasses = {
    position: currentLanguage === 'ar' ? 'right-0' : 'left-0',
    border: currentLanguage === 'ar' ? 'border-l' : 'border-r',
    translateX: currentLanguage === 'ar' ? 300 : -300,
    flexRow: currentLanguage === 'ar' ? 'flex-row-reverse' : 'flex-row',
    textAlign: currentLanguage === 'ar' ? 'text-right' : 'text-left',
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: rtlClasses.translateX }}
        animate={{ x: isOpen ? 0 : rtlClasses.translateX }}
        exit={{ x: rtlClasses.translateX }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`
          fixed top-0 ${rtlClasses.position} 
          h-full w-80 bg-nujmooz-surface ${rtlClasses.border} 
          border-nujmooz-border z-50 flex flex-col
          lg:static lg:translate-x-0 lg:w-20 lg:items-center
          shadow-lg lg:shadow-none
        `}
        dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between lg:justify-center border-b border-nujmooz-border">
          {/* Logo */}
          <div className={`flex items-center gap-3 lg:justify-center ${rtlClasses.flexRow}`}>
            <div className="w-10 h-10 gradient-bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
              OP
            </div>
            <span className="font-semibold text-nujmooz-text-primary lg:hidden mixed-text">
              {currentLanguage === 'ar' ? 'استوديو الفضاء' : 'Of Space'}
            </span>
          </div>

          {/* Close button - only on mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-nujmooz-surface-dark"
          >
            <X className="w-5 h-5 text-nujmooz-text-secondary" />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-2">
            {sidebarItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: currentLanguage === 'ar' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={item.action}
                  className={`
                    w-full flex items-center gap-4 p-3 rounded-xl
                    hover:bg-nujmooz-surface-dark transition-all duration-200
                    text-nujmooz-text-secondary hover:text-nujmooz-primary
                    lg:justify-center lg:w-12 lg:h-12 lg:p-0
                    ${rtlClasses.flexRow} ${rtlClasses.textAlign}
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium lg:hidden mixed-text">
                    {item.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 lg:p-2 border-t border-nujmooz-border">
          <div className={`flex items-center gap-3 lg:justify-center ${rtlClasses.flexRow}`}>
            <div className="w-10 h-10 gradient-bg-secondary rounded-full flex items-center justify-center text-white font-semibold">
              👤
            </div>
            <div className="lg:hidden">
              <p className="font-medium text-nujmooz-text-primary text-sm mixed-text">
                {currentLanguage === 'ar' ? 'المستخدم' : 'User'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ModernSidebar;
