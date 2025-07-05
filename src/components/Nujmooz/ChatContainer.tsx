import React, { useState, useEffect, useRef } from 'react';
import { useSession } from '@/hooks/useSession';
import { useRefactoredEnhancedMessageHandler } from '@/hooks/useRefactoredEnhancedMessageHandler';
import { getResponse } from '@/lib/responses';
import { 
  createUserSession, 
  getUserSession, 
  getChatHistory, 
  updateSessionLanguage,
  saveChatMessage,
  type ChatMessage as ChatMessageType 
} from '@/utils/sessionManager';

interface ChatContainerProps {
  currentLanguage: 'en' | 'ar';
  setCurrentLanguage: (lang: 'en' | 'ar') => void;
  setShowWelcomeAnimation: (show: boolean) => void;
}

export const useChatContainer = ({ currentLanguage, setCurrentLanguage, setShowWelcomeAnimation }: ChatContainerProps) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sessionId } = useSession();

  // Use the refactored enhanced message handler
  const messageHandler = useRefactoredEnhancedMessageHandler(sessionId!, currentLanguage, messages, setMessages);

  // Auto-detect language from browser
  useEffect(() => {
    const browserLang = (navigator.language.startsWith('ar') ? 'ar' : 'en') as 'en' | 'ar';
    setCurrentLanguage(browserLang);
  }, [setCurrentLanguage]);

  // Update suggested replies when language changes
  useEffect(() => {
    if (messageHandler.updateSuggestedRepliesLanguage) {
      messageHandler.updateSuggestedRepliesLanguage(currentLanguage);
    }
  }, [currentLanguage, messageHandler]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize session and load chat history
  useEffect(() => {
    const initializeSession = async () => {
      if (!sessionId || isInitialized) return;

      try {
        let session = await getUserSession(sessionId);
        
        if (!session) {
          session = await createUserSession(sessionId, currentLanguage);
        }

        if (session) {
          const history = await getChatHistory(sessionId);
          setMessages(history);
          
          // Add welcome message if no history exists
          if (history.length === 0) {
            setTimeout(() => setShowWelcomeAnimation(false), 3000);
            
            const welcomeMessage = getResponse('welcome', currentLanguage) as string;
            
            const welcomeMsg: ChatMessageType = {
              id: '1',
              session_id: sessionId,
              message: welcomeMessage,
              sender: 'nujmooz',
              language: currentLanguage,
              created_at: new Date().toISOString()
            };
            
            setMessages([welcomeMsg]);
            await saveChatMessage(sessionId, welcomeMessage, 'nujmooz', currentLanguage);
            
            // Set initial smart suggestions based on context
            const serviceSuggestions = getResponse('service_suggestions', currentLanguage) as string[];
            messageHandler.setSuggestedReplies(serviceSuggestions);
          } else {
            setShowWelcomeAnimation(false);
          }
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing session:', error);
        setShowWelcomeAnimation(false);
      }
    };

    initializeSession();
  }, [sessionId, currentLanguage, isInitialized, setShowWelcomeAnimation, messageHandler]);

  // Update session language when language changes
  useEffect(() => {
    if (sessionId && isInitialized) {
      updateSessionLanguage(sessionId, currentLanguage);
    }
  }, [currentLanguage, sessionId, isInitialized]);

  // Enhanced send message handler with smart conversation steering
  const handleSendMessage = async (messageText?: string) => {
    const userMessage = messageText || inputMessage.trim();
    if (!userMessage || !sessionId || isLoading) return;

    setInputMessage('');
    setIsLoading(true);

    // Check if we should show confirmation dialog before brief generation
    if (messageHandler.conversationFlow.shouldShowConfirmation()) {
      setShowConfirmationDialog(true);
      setIsLoading(false);
      return;
    }

    await messageHandler.handleSendMessage(userMessage);
    setIsLoading(false);
  };

  const handleEditMessage = (messageIndex: number) => {
    const messageToEdit = messages[messageIndex];
    if (messageToEdit && messageToEdit.sender === 'user') {
      setInputMessage(messageToEdit.message);
      setEditingMessageIndex(messageIndex);
      
      // Remove messages after the edited one
      const newMessages = messages.slice(0, messageIndex);
      setMessages(newMessages);
      
      // Reset conversation flow to the appropriate step
      messageHandler.conversationFlow.resetToStep(Math.floor(messageIndex / 2));
    }
  };

  const handleConfirmationContinue = () => {
    setShowConfirmationDialog(false);
    messageHandler.conversationFlow.completeConversation();
  };

  const handleConfirmationEdit = () => {
    setShowConfirmationDialog(false);
    // Allow user to edit by not proceeding with brief generation
  };

  const handleConfirmationRequestHelp = () => {
    setShowConfirmationDialog(false);
    // This will be handled by the RequestHelpButton component
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputMessage(transcript);
  };

  const handleSuggestedReply = (suggestion: string) => {
    // Record suggestion usage for learning - check if methods exist
    if (messageHandler.smartSuggestions?.suggestionHistory && messageHandler.smartSuggestions?.recordAdvancedSuggestionUsage) {
      const suggestionObj = messageHandler.smartSuggestions.suggestionHistory.find(s => s.text === suggestion);
      if (suggestionObj) {
        messageHandler.smartSuggestions.recordAdvancedSuggestionUsage(suggestionObj);
      }
    }
    
    handleSendMessage(suggestion);
  };

  const handleCreativeSkill = (skillType: string) => {
    const skillMessages = {
      rewrite: currentLanguage === 'ar' ? 'أعد صياغة: ' : 'Rewrite: ',
      analyze: currentLanguage === 'ar' ? 'حلل هذه الفكرة: ' : 'Analyze this idea: ',
      plan: currentLanguage === 'ar' ? 'اقترح خطة تنفيذ لـ: ' : 'Suggest an execution plan for: ',
      naming: currentLanguage === 'ar' ? 'اقترح أسماء تجارية لـ: ' : 'Suggest brand names for: '
    };

    setInputMessage(skillMessages[skillType as keyof typeof skillMessages] || '');
  };

  return {
    messages,
    inputMessage,
    setInputMessage,
    isLoading,
    showConfirmationDialog,
    editingMessageIndex,
    messagesEndRef,
    sessionId,
    messageHandler,
    handleSendMessage,
    handleEditMessage,
    handleConfirmationContinue,
    handleConfirmationEdit,
    handleConfirmationRequestHelp,
    handleVoiceTranscript,
    handleSuggestedReply,
    handleCreativeSkill
  };
};
