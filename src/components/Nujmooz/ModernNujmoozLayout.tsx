
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ModernChatInterface from './ModernChatInterface';
import ModernFilesPanel from './ModernFilesPanel';
import ModernRightPanel from './ModernRightPanel';
import ConversationManager from './ConversationManager';
import NotificationCenter from './NotificationCenter';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { useSession } from '@/hooks/useSession';
import { type ChatMessage } from '@/utils/sessionManager';

interface ModernNujmoozLayoutProps {
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  setRightPanelOpen: (open: boolean) => void;
  messages: any[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  isLoading: boolean;
  handleSendMessage: (content?: string) => Promise<void>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  generatedFiles: any[];
  handleFileAction: (fileId: string, action: string) => void;
  suggestedReplies: string[];
}

const ModernNujmoozLayout: React.FC<ModernNujmoozLayoutProps> = ({
  leftPanelOpen,
  rightPanelOpen,
  setRightPanelOpen,
  messages,
  inputMessage,
  setInputMessage,
  isLoading,
  handleSendMessage,
  messagesEndRef,
  generatedFiles,
  handleFileAction,
  suggestedReplies
}) => {
  const currentLanguage: 'en' | 'ar' = 'ar';
  const { sessionId } = useSession();
  
  const notifications = useNotificationSystem(currentLanguage);

  const handleLoadConversation = (loadedMessages: ChatMessage[]) => {
    console.log('Loading conversation:', loadedMessages);
  };

  const handleSuggestedReply = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  if (!sessionId) {
    return (
      <div className="flex h-[calc(100vh-60px)] items-center justify-center">
        <div className="text-lg">جاري التحضير...</div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-60px)] relative">
      <NotificationCenter
        notifications={notifications.notifications}
        onRemoveNotification={notifications.removeNotification}
        currentLanguage={currentLanguage}
      />

      {leftPanelOpen && (
        <motion.div
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          className="w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-r border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">
              {currentLanguage === 'ar' ? 'إدارة المحادثات' : 'Conversation Manager'}
            </h2>
          </div>
          
          <ScrollArea className="h-[calc(100vh-140px)]">
            <div className="p-4">
              <ConversationManager
                sessionId={sessionId}
                currentLanguage={currentLanguage}
                messages={messages}
                onLoadConversation={handleLoadConversation}
              />
            </div>
          </ScrollArea>
        </motion.div>
      )}

      <div className="flex-1 flex flex-col">
        <ModernChatInterface
          messages={messages.map(msg => ({
            id: msg.id || Date.now().toString(),
            sender: msg.sender,
            content: msg.message || msg.content,
            timestamp: new Date(msg.created_at || Date.now()),
            generatedFiles: []
          }))}
          currentInput={inputMessage}
          setCurrentInput={setInputMessage}
          onSendMessage={handleSendMessage}
          messagesEndRef={messagesEndRef}
          isLoading={isLoading}
          suggestedReplies={suggestedReplies}
          onSuggestedReply={handleSuggestedReply}
        />
      </div>

      {rightPanelOpen && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          className="w-80 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-l border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">
              {currentLanguage === 'ar' ? 'الملفات المُنشأة' : 'Generated Files'}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRightPanelOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <ScrollArea className="h-[calc(100vh-140px)]">
            <ModernFilesPanel
              files={generatedFiles}
              onFileAction={handleFileAction}
              currentLanguage={currentLanguage}
            />
          </ScrollArea>
        </motion.div>
      )}
    </div>
  );
};

export default ModernNujmoozLayout;
