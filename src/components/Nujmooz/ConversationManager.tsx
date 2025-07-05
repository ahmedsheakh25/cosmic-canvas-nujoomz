
import React from 'react';
import { type ChatMessage } from '@/utils/sessionManager';
import ConversationManagerHeader from './ConversationManagerHeader';
import ConversationManagerActions from './ConversationManagerActions';
import ConversationErrorDisplay from './ConversationErrorDisplay';
import { useConversationActions } from '@/hooks/useConversationActions';

interface ConversationManagerProps {
  sessionId: string;
  currentLanguage: 'en' | 'ar';
  messages: ChatMessage[];
  onLoadConversation: (messages: ChatMessage[]) => void;
}

const ConversationManager: React.FC<ConversationManagerProps> = ({
  sessionId,
  currentLanguage,
  messages,
  onLoadConversation
}) => {
  const conversationActions = useConversationActions(sessionId, currentLanguage);

  return (
    <>
      <ConversationManagerHeader
        sessionId={sessionId}
        currentLanguage={currentLanguage}
      />

      <ConversationErrorDisplay error={conversationActions.error} />

      {sessionId && (
        <ConversationManagerActions
          sessionId={sessionId}
          currentLanguage={currentLanguage}
          messages={messages}
          onLoadConversation={onLoadConversation}
        />
      )}
    </>
  );
};

export default ConversationManager;
