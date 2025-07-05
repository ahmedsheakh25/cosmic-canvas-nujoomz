
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import EnhancedTypewriterMessage from './EnhancedTypewriterMessage';
import LoadingMessage from './LoadingMessage';

interface ChatMessage {
  id: string;
  sender: 'user' | 'nujmooz';
  content: string;
  timestamp: Date;
  generatedFiles?: string[];
}

interface ModernMessagesListProps {
  messages: ChatMessage[];
  isLoading?: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  currentLanguage?: 'en' | 'ar';
}

const ModernMessagesList: React.FC<ModernMessagesListProps> = ({
  messages,
  isLoading = false,
  messagesEndRef,
  currentLanguage = 'ar'
}) => {
  // RTL-aware classes for user messages
  const rtlClasses = {
    userJustify: currentLanguage === 'ar' ? 'justify-start' : 'justify-end',
    userAvatarSide: 'right-4', // Always on the right side now
    userContentMargin: currentLanguage === 'ar' ? 'ml-16' : 'mr-16',
    userTextAlign: currentLanguage === 'ar' ? 'text-right' : 'text-left',
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <React.Fragment key={message.id}>
            {message.sender === 'user' ? (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  duration: 0.4,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
                className={`flex ${rtlClasses.userJustify} group relative`}
              >
                <div className="max-w-2xl w-full relative">
                  {/* User Avatar positioned at top-right - now green to match message */}
                  <div className={`absolute top-0 ${rtlClasses.userAvatarSide} z-10 flex flex-col items-center gap-1`}>
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-500 mixed-text whitespace-nowrap">
                      {currentLanguage === 'ar' ? 'أنت' : 'You'}
                    </span>
                  </div>

                  {/* Message Bubble with margin for avatar */}
                  <div className={rtlClasses.userContentMargin}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <Card className="p-4 shadow-lg backdrop-blur-xl border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <p className={`whitespace-pre-wrap leading-relaxed text-base mixed-text ${rtlClasses.userTextAlign}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                          {message.content}
                        </p>
                        
                        {/* Timestamp */}
                        <div className={`text-xs mt-2 opacity-60 text-white ${
                          currentLanguage === 'ar' ? 'text-left' : 'text-right'
                        }`}>
                          {message.timestamp.toLocaleTimeString(currentLanguage === 'ar' ? 'ar' : 'en', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>

                        {/* Generated Files Indicator */}
                        {message.generatedFiles && message.generatedFiles.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/20">
                            <div className={`flex items-center gap-2 text-xs text-white/80`}>
                              <span className="mixed-text">
                                {currentLanguage === 'ar' 
                                  ? `تم إنشاء ${message.generatedFiles.length} ملف جديد`
                                  : `Generated ${message.generatedFiles.length} new files`
                                }
                              </span>
                            </div>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <EnhancedTypewriterMessage
                key={`${message.id}-enhanced-typewriter`}
                message={message.content}
                currentLanguage={currentLanguage}
                timestamp={message.timestamp}
                enableSkip={true}
                autoStart={true}
              />
            )}
          </React.Fragment>
        ))}
      </AnimatePresence>

      {/* Loading Indicator */}
      {isLoading && (
        <LoadingMessage currentLanguage={currentLanguage} />
      )}
      
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
};

export default ModernMessagesList;
