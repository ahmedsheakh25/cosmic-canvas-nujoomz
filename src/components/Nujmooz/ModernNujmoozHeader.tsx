
import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Sparkles, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

interface ModernNujmoozHeaderProps {
  leftPanelOpen: boolean;
  setLeftPanelOpen: (open: boolean) => void;
  sessionId?: string;
}

const ModernNujmoozHeader: React.FC<ModernNujmoozHeaderProps> = ({
  leftPanelOpen,
  setLeftPanelOpen,
  sessionId
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <motion.header 
      className="h-16 border-b border-[#c9c4bf]/20 bg-white/50 dark:bg-black/20 backdrop-blur-xl sticky top-0 z-50"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            className="text-[#a9a39b] hover:text-[#ebb650] transition-colors"
          >
            {leftPanelOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
          </Button>
          
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-[#ebb650] to-[#d4a574] rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#2a2a2a] to-[#a9a39b] dark:from-white dark:to-[#c9c4bf] bg-clip-text text-transparent">
                نجموز
              </h1>
              <p className="text-sm text-[#a9a39b]">مساعدك الكوني الإبداعي</p>
            </div>
          </motion.div>
        </div>

        <div className="flex items-center space-x-2">
          {sessionId && (
            <div className="text-xs text-[#a9a39b] bg-white/20 dark:bg-black/20 px-3 py-1 rounded-full">
              متصل
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-[#a9a39b] hover:text-[#ebb650] transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default ModernNujmoozHeader;
