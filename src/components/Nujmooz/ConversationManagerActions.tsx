
import React, { useState, useEffect } from 'react';
import { useConversationActions } from '@/hooks/useConversationActions';
import { type ChatMessage } from '@/utils/sessionManager';
import ConversationSaveSection from './ConversationSaveSection';
import ConversationListDialog from './ConversationListDialog';

interface ConversationManagerActionsProps {
  sessionId: string;
  currentLanguage: 'en' | 'ar';
  messages: ChatMessage[];
  onLoadConversation: (messages: ChatMessage[]) => void;
}

const ConversationManagerActions: React.FC<ConversationManagerActionsProps> = ({
  sessionId,
  currentLanguage,
  messages,
  onLoadConversation
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const conversationActions = useConversationActions(sessionId, currentLanguage);

  const handleLoadConversation = async (conversationId: string) => {
    const loadedMessages = await conversationActions.loadConversation(conversationId);
    if (loadedMessages && loadedMessages.length > 0) {
      onLoadConversation(loadedMessages);
    }
  };

  useEffect(() => {
    if (isDialogOpen && sessionId) {
      conversationActions.loadSavedConversations();
    }
  }, [isDialogOpen, sessionId, conversationActions]);

  return (
    <>
      <ConversationSaveSection
        currentLanguage={currentLanguage}
        messages={messages}
        sessionId={sessionId}
        isLoading={conversationActions.isLoading}
        onSave={conversationActions.saveConversation}
      />

      <ConversationListDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currentLanguage={currentLanguage}
        conversations={conversationActions.savedConversations}
        isLoading={conversationActions.isLoading}
        sessionId={sessionId}
        onLoadConversation={handleLoadConversation}
        onDeleteConversation={conversationActions.deleteConversation}
        onUpdateTitle={conversationActions.updateConversationTitle}
      />
    </>
  );
};

export default ConversationManagerActions;
