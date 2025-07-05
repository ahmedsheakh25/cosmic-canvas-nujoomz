
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/hooks/useSession';
import { useEnhancedNujmoozChat } from '@/hooks/useEnhancedNujmoozChat';
import { useEnhancedBriefGeneration } from '@/hooks/useEnhancedBriefGeneration';
import ProfessionalHeader from './ProfessionalHeader';
import ModernNujmoozParticles from './ModernNujmoozParticles';
import ModernWelcomeScreen from './ModernWelcomeScreen';
import ModernMessagesList from './ModernMessagesList';
import EnhancedProjectBriefCard from './EnhancedProjectBriefCard';
import SmartSuggestionsPanel from './SmartSuggestionsPanel';
import ModernChatInput from './ModernChatInput';

const EnhancedNujmoozInterface: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('ar');
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentInput, setCurrentInput] = useState('');
  
  const { sessionId } = useSession();
  
  const {
    messages,
    isLoading,
    currentBrief,
    suggestedReplies,
    messagesEndRef,
    handleSendMessage,
    setSuggestedReplies
  } = useEnhancedNujmoozChat(sessionId, currentLanguage);

  const {
    isGenerating,
    generateBrief,
    saveBriefNote
  } = useEnhancedBriefGeneration(sessionId);

  // إخفاء شاشة الترحيب عند إرسال أول رسالة
  useEffect(() => {
    if (messages.length > 0) {
      setShowWelcome(false);
    }
  }, [messages.length]);

  // تشغيل الكشف التلقائي للغة
  useEffect(() => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.includes('ar')) {
      setCurrentLanguage('ar');
    }
  }, []);

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  const handleSuggestionClick = (suggestion: string) => {
    setShowWelcome(false);
    handleSendMessage(suggestion);
  };

  const handleSendWithInput = async (content?: string) => {
    const messageToSend = content || currentInput.trim();
    if (!messageToSend) return;

    setCurrentInput('');
    setShowWelcome(false);
    await handleSendMessage(messageToSend);
  };

  const handleGenerateBrief = async () => {
    if (!currentBrief) return;
    
    const briefData = {
      ...currentBrief,
      language: currentLanguage,
      sessionId
    };
    
    await generateBrief(briefData);
    
    // إضافة رسالة نجح الإنشاء
    const successMessage = currentLanguage === 'ar' 
      ? '🎉 تم إنشاء موجز المشروع بنجاح! سيتواصل معك فريقنا الإبداعي قريباً لبدء العمل على مشروعك.'
      : '🎉 Project brief created successfully! Our creative team will contact you soon to start working on your project.';
    
    await handleSendMessage(successMessage);
  };

  return (
    <div 
      className="h-screen flex flex-col bg-gradient-to-br from-blue-50/20 via-white to-purple-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden"
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* الخلفية المتحركة */}
      <div className="absolute inset-0 pointer-events-none">
        <ModernNujmoozParticles />
      </div>

      {/* الهيدر المحترف */}
      <ProfessionalHeader
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
      />

      {/* المحتوى الرئيسي */}
      <div className="flex-1 min-h-0 relative z-10">
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <motion.div
              key="welcome"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              <div className="flex-1 overflow-y-auto">
                <ModernWelcomeScreen
                  currentLanguage={currentLanguage}
                  onSuggestionClick={handleSuggestionClick}
                />
              </div>
              
              {/* صندوق الإدخال في الأسفل */}
              <div className="flex-shrink-0">
                <ModernChatInput
                  currentInput={currentInput}
                  setCurrentInput={setCurrentInput}
                  onSendMessage={handleSendWithInput}
                  isLoading={isLoading}
                  currentLanguage={currentLanguage}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              {/* بطاقة موجز المشروع */}
              <div className="flex-shrink-0 p-6 pb-0">
                <EnhancedProjectBriefCard
                  currentBrief={currentBrief}
                  currentLanguage={currentLanguage}
                  onGenerateBrief={handleGenerateBrief}
                />
              </div>

              {/* منطقة الرسائل */}
              <div className="flex-1 min-h-0 px-6">
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto">
                    <ModernMessagesList
                      messages={messages}
                      isLoading={isLoading}
                      messagesEndRef={messagesEndRef}
                      currentLanguage={currentLanguage}
                    />
                  </div>

                  {/* الاقتراحات الذكية */}
                  <div className="flex-shrink-0 py-4">
                    <SmartSuggestionsPanel
                      suggestions={suggestedReplies}
                      currentLanguage={currentLanguage}
                      onSuggestionClick={handleSuggestionClick}
                      isLoading={isLoading}
                    />
                  </div>

                  {/* صندوق الإدخال */}
                  <div className="flex-shrink-0 pb-4">
                    <ModernChatInput
                      currentInput={currentInput}
                      setCurrentInput={setCurrentInput}
                      onSendMessage={handleSendWithInput}
                      isLoading={isLoading || isGenerating}
                      currentLanguage={currentLanguage}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedNujmoozInterface;
