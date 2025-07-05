import { useSession } from '@/hooks/useSession';
import { useModernNujmoozState } from '@/hooks/files/useModernNujmoozState';
import { useConversationState } from '@/hooks/conversation/useConversationState';
import { useMessageProcessor } from '@/hooks/messaging/useMessageProcessor';
import { useInterfaceState } from '@/hooks/interface/useInterfaceState';
import { useFileActions } from './useFileActions';
import { useMessageHandler } from './useMessageHandler';
import type { NujmoozState, ConversationChatMessage } from './types';

export const useNujmoozInterface = (): NujmoozState => {
  const { sessionId } = useSession();
  
  const conversationState = useConversationState();
  const interfaceState = useInterfaceState();
  const fileState = useModernNujmoozState();
  
  const messageProcessor = useMessageProcessor({
    sessionId,
    onAddMessage: (message: ConversationChatMessage) => conversationState.addMessage(message),
    onSetLoading: conversationState.setIsLoading,
    detectLanguage: conversationState.detectLanguage
  });

  const fileActions = useFileActions({
    onOpenRightPanel: interfaceState.openRightPanel
  });

  const messageHandler = useMessageHandler({
    sessionId,
    inputMessage: conversationState.inputMessage,
    clearInput: conversationState.clearInput,
    isLoading: conversationState.isLoading,
    detectLanguage: conversationState.detectLanguage,
    processMessage: messageProcessor.processMessage,
    processMessageForFiles: fileState.processMessageForFiles
  });

  return {
    // Session
    sessionId,
    
    // Conversation State
    messages: conversationState.messages as ConversationChatMessage[],
    inputMessage: conversationState.inputMessage,
    isLoading: conversationState.isLoading,
    setInputMessage: conversationState.setInputMessage,
    clearInput: conversationState.clearInput,
    addMessage: conversationState.addMessage as (message: ConversationChatMessage) => void,
    detectLanguage: conversationState.detectLanguage,
    
    // Interface State
    isRightPanelOpen: interfaceState.rightPanelOpen,
    openRightPanel: interfaceState.openRightPanel,
    closeRightPanel: interfaceState.closeRightPanel,
    
    // File State
    generatedFiles: fileActions.generatedFiles,
    isProcessingFiles: fileState.isProcessingFiles,
    
    // Message Processing
    suggestedReplies: messageProcessor.suggestedReplies,
    
    // Actions
    handleSendMessage: messageHandler.handleSendMessage,
    handleFileAction: fileActions.handleFileAction
  };
}; 