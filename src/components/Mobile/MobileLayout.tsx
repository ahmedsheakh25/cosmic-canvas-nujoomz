
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MobileNavigation from './MobileNavigation';
import MobileChatInterface from './MobileChatInterface';
import { useSession } from '@/hooks/useSession';

interface MobileLayoutProps {
  children?: React.ReactNode;
  currentLanguage: 'en' | 'ar';
  onLanguageToggle: () => void;
}

interface MobileMessage {
  id: string;
  sender: 'user' | 'nujmooz';
  content: string;
  timestamp: Date;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  currentLanguage,
  onLanguageToggle
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const { sessionId } = useSession();

  // Sample chat data - replace with actual data
  const [messages, setMessages] = useState<MobileMessage[]>([
    {
      id: '1',
      sender: 'nujmooz',
      content: currentLanguage === 'ar' 
        ? 'أهلاً وسهلاً! أنا نجموز 👽، مساعدك الإبداعي الكوني. كيف يمكنني مساعدتك اليوم؟'
        : 'Hello! I\'m Nujmooz 👽, your cosmic creative assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);

  const [currentInput, setCurrentInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sample suggested replies
  const suggestedReplies = currentLanguage === 'ar' 
    ? ['أريد تصميم هوية تجارية', 'أحتاج موقع إلكتروني', 'مساعدة في التسويق']
    : ['Brand identity design', 'Website development', 'Marketing help'];

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    const userMessage: MobileMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsLoading(true);

    // Simulate response
    setTimeout(() => {
      const response: MobileMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'nujmooz',
        content: currentLanguage === 'ar' 
          ? 'شكراً لك! سأحتاج لمزيد من التفاصيل لأساعدك بأفضل طريقة ممكنة.'
          : 'Thank you! I\'ll need more details to help you in the best way possible.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestedReply = (reply: string) => {
    setCurrentInput(reply);
    handleSendMessage();
  };

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu when clicking outside or on navigation
  useEffect(() => {
    if (isMenuOpen) {
      const timer = setTimeout(() => {
        // Auto-close menu after navigation
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMenuOpen]);

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Mobile Navigation */}
      <MobileNavigation
        isOpen={isMenuOpen}
        onToggle={toggleMenu}
        currentLanguage={currentLanguage}
        onLanguageToggle={onLanguageToggle}
        isVoiceActive={isVoiceActive}
        onVoiceToggle={handleVoiceToggle}
      />

      {/* Main Content */}
      <div className="pt-16 h-screen flex flex-col lg:pt-0">
        {/* Desktop fallback - hide on mobile */}
        <div className="hidden lg:block flex-1">
          {children}
        </div>

        {/* Mobile Chat Interface */}
        <div className="flex-1 lg:hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <MobileChatInterface
              messages={messages}
              currentInput={currentInput}
              setCurrentInput={setCurrentInput}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              currentLanguage={currentLanguage}
              suggestedReplies={suggestedReplies}
              onSuggestedReply={handleSuggestedReply}
              isVoiceActive={isVoiceActive}
              onVoiceToggle={handleVoiceToggle}
            />
          </motion.div>
        </div>
      </div>

      {/* Background Effects for Mobile */}
      <div className="fixed inset-0 pointer-events-none lg:hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-green-400/10 rounded-full blur-xl" />
        <div className="absolute bottom-32 left-8 w-24 h-24 bg-blue-400/10 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-400/5 rounded-full blur-2xl" />
      </div>
    </div>
  );
};

export default MobileLayout;
