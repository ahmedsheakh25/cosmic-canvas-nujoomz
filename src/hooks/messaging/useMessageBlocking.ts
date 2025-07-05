
import { isMessageBlocked, getBlockedResponse } from '@/utils/messageFilter';
import { getResponse } from '@/lib/responses';
import { saveChatMessage, type ChatMessage } from '@/utils/sessionManager';

export const useMessageBlocking = (
  sessionId: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>,
  setSuggestedReplies: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const handleBlockedMessage = async (
    finalMessage: string, 
    effectiveLanguage: 'en' | 'ar'
  ): Promise<boolean> => {
    if (!isMessageBlocked(finalMessage)) {
      return false;
    }

    const blockResponse = getResponse('blocked', effectiveLanguage) as string;
    const blockedSuggestions = getResponse('service_suggestions', effectiveLanguage) as string[];

    // Add user message to UI
    const tempUserMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      session_id: sessionId,
      message: finalMessage,
      sender: 'user',
      language: effectiveLanguage,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, tempUserMessage]);
    await saveChatMessage(sessionId, finalMessage, 'user', effectiveLanguage);

    // Add block response
    const warningMessage: ChatMessage = {
      id: `blocked-${Date.now()}`,
      session_id: sessionId,
      message: blockResponse,
      sender: 'nujmooz',
      language: effectiveLanguage,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, warningMessage]);
    await saveChatMessage(sessionId, blockResponse, 'nujmooz', effectiveLanguage);
    setSuggestedReplies(blockedSuggestions);
    
    return true;
  };

  return {
    handleBlockedMessage
  };
};
