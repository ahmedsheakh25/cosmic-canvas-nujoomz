
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import WelcomeScreen from './WelcomeScreen';
import ChatLayout from './ChatLayout';
import ChatDialogs from './ChatDialogs';
import { useChatContainer } from './ChatContainer';

const NujmoozFullChat = () => {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('en');
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);

  const chatContainer = useChatContainer({
    currentLanguage,
    setCurrentLanguage,
    setShowWelcomeAnimation
  });

  const handleLanguageToggle = () => {
    setCurrentLanguage(prev => (prev === 'ar' ? 'en' : 'ar') as 'en' | 'ar');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 border border-[#7EF5A5]/20 rounded-full"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <motion.div
          className="absolute bottom-32 right-16 w-24 h-24 border border-[#4AE374]/30 rounded-full"
          animate={{ 
            rotate: -360,
            y: [-10, 10, -10]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <motion.div
          className="absolute top-1/2 right-8 w-16 h-16 border border-[#7EF5A5]/40 rounded-full"
          animate={{ 
            rotate: 360,
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        />
      </div>

      {/* Welcome Animation Overlay */}
      <WelcomeScreen 
        showWelcomeAnimation={showWelcomeAnimation}
        currentLanguage={currentLanguage}
      />

      {/* Main Chat Interface */}
      <ChatLayout
        showWelcomeAnimation={showWelcomeAnimation}
        currentLanguage={currentLanguage}
        onLanguageToggle={handleLanguageToggle}
        messages={chatContainer.messages}
        isLoading={chatContainer.isLoading}
        briefData={chatContainer.messageHandler.conversationFlow.getBriefData()}
        savedBriefId={chatContainer.messageHandler.conversationFlow.savedBriefId}
        onEditMessage={chatContainer.handleEditMessage}
        messagesEndRef={chatContainer.messagesEndRef}
        inputMessage={chatContainer.inputMessage}
        setInputMessage={chatContainer.setInputMessage}
        onSendMessage={() => chatContainer.handleSendMessage()}
        suggestedReplies={chatContainer.messageHandler.suggestedReplies}
        onSuggestedReply={chatContainer.handleSuggestedReply}
        onVoiceTranscript={chatContainer.handleVoiceTranscript}
        onCreativeSkill={chatContainer.handleCreativeSkill}
        conversationPhase={chatContainer.messageHandler.conversationFlow.conversationPhase}
        currentQuestionIndex={chatContainer.messageHandler.conversationFlow.currentQuestionIndex}
        showBriefPreview={chatContainer.messageHandler.conversationFlow.showBriefPreview}
        currentService={chatContainer.messageHandler.conversationFlow.currentService}
      />

      {/* Dialogs and Floating Elements */}
      <ChatDialogs
        showConfirmationDialog={chatContainer.showConfirmationDialog}
        currentLanguage={currentLanguage}
        onConfirmationContinue={chatContainer.handleConfirmationContinue}
        onConfirmationEdit={chatContainer.handleConfirmationEdit}
        onConfirmationRequestHelp={chatContainer.handleConfirmationRequestHelp}
        sessionId={chatContainer.sessionId}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#7EF5A5] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default NujmoozFullChat;
