
import { useSession } from '@/hooks/useSession';
import { useModernNujmoozState } from '@/hooks/useModernNujmoozState';
import { useConversationState } from '@/hooks/useConversationState';
import { useMessageProcessor } from '@/hooks/useMessageProcessor';
import { useInterfaceState } from '@/hooks/useInterfaceState';

export const useNujmoozInterface = () => {
  const { sessionId } = useSession();
  
  const conversationState = useConversationState();
  const interfaceState = useInterfaceState();
  const fileState = useModernNujmoozState();
  
  const messageProcessor = useMessageProcessor(
    sessionId,
    conversationState.addMessage,
    conversationState.setIsLoading,
    conversationState.detectLanguage
  );

  const handleSendMessage = async (content?: string) => {
    const messageToSend = content || conversationState.inputMessage.trim();
    if (!messageToSend || conversationState.isLoading) return;

    conversationState.clearInput();
    await messageProcessor.processMessage(messageToSend);

    // Process message for potential file generation with enhanced detection
    if (sessionId) {
      const aiMessage = {
        id: `ai-${Date.now()}`,
        session_id: sessionId,
        message: messageToSend,
        sender: 'user' as const,
        language: conversationState.detectLanguage(messageToSend),
        created_at: new Date().toISOString()
      };
      
      await fileState.processMessageForFiles(aiMessage);
    }
  };

  const handleFileAction = (fileId: string, action: 'view' | 'edit' | 'export' | 'copy' | 'duplicate' | 'delete' | 'favorite') => {
    const file = fileState.generatedFiles.find(f => f.id === fileId);
    if (!file) return;

    switch (action) {
      case 'view':
        interfaceState.openRightPanel();
        break;
      case 'edit':
        console.log('Edit file:', fileId);
        break;
      case 'export':
        console.log('Export file:', fileId);
        break;
      case 'copy':
        navigator.clipboard.writeText(file.content);
        break;
      case 'duplicate':
        const duplicatedFile = {
          ...file,
          id: `${file.id}-copy-${Date.now()}`,
          title: `${file.title} - نسخة`,
          createdAt: new Date()
        };
        fileState.setGeneratedFiles([...fileState.generatedFiles, duplicatedFile]);
        break;
      case 'delete':
        if (window.confirm(`هل أنت متأكد من حذف الملف: ${file.title}؟`)) {
          fileState.setGeneratedFiles(fileState.generatedFiles.filter(f => f.id !== fileId));
        }
        break;
      case 'favorite':
        fileState.setGeneratedFiles(
          fileState.generatedFiles.map(f => f.id === fileId ? { ...f, isFavorite: !f.isFavorite } : f)
        );
        break;
    }
  };

  return {
    // Session
    sessionId,
    
    // Conversation State
    ...conversationState,
    
    // Interface State
    ...interfaceState,
    
    // File State
    ...fileState,
    
    // Message Processing
    suggestedReplies: messageProcessor.suggestedReplies,
    
    // Actions
    handleSendMessage,
    handleFileAction
  };
};
