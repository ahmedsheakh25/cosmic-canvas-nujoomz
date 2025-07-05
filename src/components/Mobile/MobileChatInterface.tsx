
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import VoiceInteractionOverlay from './VoiceInteractionOverlay';

interface MobileChatMessage {
  id: string;
  sender: 'user' | 'nujmooz';
  content: string;
  timestamp: Date;
}

interface MobileChatInterfaceProps {
  messages: MobileChatMessage[];
  currentInput: string;
  setCurrentInput: (value: string) => void;
  onSendMessage: () => void;
  isLoading?: boolean;
  currentLanguage: 'en' | 'ar';
  suggestedReplies?: string[];
  onSuggestedReply?: (reply: string) => void;
  isVoiceActive?: boolean;
  onVoiceToggle?: () => void;
}

const MobileChatInterface: React.FC<MobileChatInterfaceProps> = ({
  messages,
  currentInput,
  setCurrentInput,
  onSendMessage,
  isLoading = false,
  currentLanguage,
  suggestedReplies = [],
  onSuggestedReply,
  isVoiceActive = false,
  onVoiceToggle
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (currentInput.trim() && !isLoading) {
      onSendMessage();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedReply = (reply: string) => {
    if (onSuggestedReply) {
      onSuggestedReply(reply);
    }
  };

  const handleVoiceOverlayToggle = () => {
    setShowVoiceOverlay(!showVoiceOverlay);
    if (onVoiceToggle) {
      onVoiceToggle();
    }
  };

  const handleStartListening = () => {
    setIsListening(true);
    // TODO: Implement actual speech recognition
    console.log('Starting voice recognition...');
  };

  const handleStopListening = () => {
    setIsListening(false);
    // TODO: Stop speech recognition and process transcript
    if (voiceTranscript) {
      setCurrentInput(voiceTranscript);
      setVoiceTranscript('');
      setShowVoiceOverlay(false);
    }
    console.log('Stopping voice recognition...');
  };

  return (
    <>
      <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                  {message.sender === 'nujmooz' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                        <span className="text-white text-sm">👽</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {currentLanguage === 'ar' ? 'نجموز' : 'Nujmooz'}
                      </span>
                    </div>
                  )}
                  
                  <Card className={`p-4 ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                      : 'bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <div className={`text-xs mt-2 opacity-70 ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {message.timestamp.toLocaleTimeString(currentLanguage === 'ar' ? 'ar' : 'en', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                  <span className="text-white text-sm">👽</span>
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Replies */}
        {suggestedReplies.length > 0 && (
          <div className="px-4 pb-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {suggestedReplies.map((reply, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedReply(reply)}
                    className="whitespace-nowrap text-xs bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    {reply}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <Textarea
                  ref={textareaRef}
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={currentLanguage === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
                  className="resize-none pr-12 min-h-[3rem] max-h-32 text-sm rounded-2xl border-gray-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400"
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  disabled={isLoading}
                />
              </div>

              {/* Voice Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleVoiceOverlayToggle}
                className={`rounded-full w-12 h-12 ${
                  isVoiceActive 
                    ? 'bg-green-100 text-green-600 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-600' 
                    : ''
                }`}
              >
                {isVoiceActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </Button>

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={!currentInput.trim() || isLoading}
                className="rounded-full w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Interaction Overlay */}
      <VoiceInteractionOverlay
        isVisible={showVoiceOverlay}
        onClose={() => setShowVoiceOverlay(false)}
        currentLanguage={currentLanguage}
        isListening={isListening}
        onStartListening={handleStartListening}
        onStopListening={handleStopListening}
        transcript={voiceTranscript}
        confidence={0.95}
      />
    </>
  );
};

export default MobileChatInterface;
