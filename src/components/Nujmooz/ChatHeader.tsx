
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Settings, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  currentLanguage: 'en' | 'ar';
  onLanguageToggle: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ currentLanguage, onLanguageToggle }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-black/20 via-black/10 to-black/20 backdrop-blur-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center space-x-4"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="w-12 h-12 bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Sparkles className="w-6 h-6 text-black" />
        </motion.div>
        <div>
          <motion.h1 
            className="text-2xl font-bold bg-gradient-to-r from-white via-[#7EF5A5] to-white bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {currentLanguage === 'ar' ? 'نجموز' : 'Nujmooz'}
          </motion.h1>
          <motion.p 
            className="text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {currentLanguage === 'ar' ? 'مساعدك الكوني الإبداعي' : 'Your Cosmic Creative Assistant'}
          </motion.p>
        </div>
      </motion.div>

      <div className="flex items-center space-x-3">
        <motion.button
          onClick={() => navigate('/api-test')}
          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          title="API Status"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Settings className="w-5 h-5 text-white" />
        </motion.button>
        
        <motion.button
          onClick={onLanguageToggle}
          className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          title={currentLanguage === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Globe className="w-5 h-5 text-white" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ChatHeader;
