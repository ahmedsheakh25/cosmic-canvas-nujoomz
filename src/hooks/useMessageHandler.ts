
import { useState } from 'react';
import { type ChatMessage } from '@/utils/sessionManager';
import { getResponse } from '@/lib/responses';
import { useConversationFlow } from './useConversationFlow';
import { useCreativeSkills } from './useCreativeSkills';
import { useMessageSender } from './messaging/useMessageSender';
import { useMessageBlocking } from './messaging/useMessageBlocking';
import { useWorkflowProcessor } from './messaging/useWorkflowProcessor';

export const useMessageHandler = (
  sessionId: string,
  currentLanguage: 'en' | 'ar',
  messages: ChatMessage[],
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  
  const conversationFlow = useConversationFlow(currentLanguage);
  const creativeSkills = useCreativeSkills(sessionId, currentLanguage);
  const messageSender = useMessageSender(sessionId, currentLanguage, messages, setMessages);
  const messageBlocking = useMessageBlocking(sessionId, setMessages, setSuggestedReplies);
  const workflowProcessor = useWorkflowProcessor();

  const handleSendMessage = async (messageText?: string, userMessage?: string) => {
    const finalMessage = messageText || userMessage;
    if (!finalMessage || !sessionId) return;

    setSuggestedReplies([]);
    messageSender.setIsProcessing(true);

    const effectiveLanguage = messageSender.detectEffectiveLanguage(finalMessage);

    // Check if message is blocked
    const isBlocked = await messageBlocking.handleBlockedMessage(finalMessage, effectiveLanguage);
    if (isBlocked) {
      messageSender.setIsProcessing(false);
      return;
    }

    // Add user message to UI
    await messageSender.addUserMessage(finalMessage, effectiveLanguage);

    try {
      let aiResponse = '';
      let nextSuggestions: string[] = [];

      // Check for creative skills first
      const skillResponse = await creativeSkills.detectAndHandleCreativeSkills(
        finalMessage, 
        conversationFlow.currentService
      );
      
      if (skillResponse) {
        aiResponse = skillResponse;
        nextSuggestions = creativeSkills.getSkillSuggestions();
      } 
      // Handle conversation flow
      else {
        const flowResult = conversationFlow.processUserMessage(finalMessage);
        
        if (flowResult) {
          aiResponse = flowResult.response;
          nextSuggestions = flowResult.suggestions;

          // Handle brief completion with workflow
          if (flowResult.completeBrief && flowResult.briefData) {
            const workflowResult = await messageSender.processWorkflow(flowResult.briefData, effectiveLanguage);
            
            if (workflowResult.success) {
              console.log('Workflow completed successfully:', workflowResult);
              conversationFlow.setSavedBriefId(workflowResult.briefId);
              
              const successMsg = workflowProcessor.generateSuccessMessage(effectiveLanguage, workflowResult);
              await messageSender.addAIMessage(successMsg, effectiveLanguage);
              messageSender.setIsProcessing(false);
              return;
            } else {
              console.error('Workflow error:', workflowResult.error);
              const fallbackMsg = workflowProcessor.generateFallbackMessage(effectiveLanguage);
              await messageSender.addAIMessage(fallbackMsg, effectiveLanguage);
              messageSender.setIsProcessing(false);
              return;
            }
          }
        } 
        // Fallback to general chat
        else {
          aiResponse = await messageSender.sendToAPI(finalMessage, effectiveLanguage);
        }
      }

      // Add AI response
      await messageSender.addAIMessage(aiResponse, effectiveLanguage);

      if (nextSuggestions.length > 0) {
        setSuggestedReplies(nextSuggestions);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      const finalFallbackMsg = workflowProcessor.generateFinalFallbackMessage(effectiveLanguage);
      await messageSender.addAIMessage(finalFallbackMsg, effectiveLanguage);
    } finally {
      messageSender.setIsProcessing(false);
    }
  };

  // Update suggested replies when language changes
  const updateSuggestedRepliesLanguage = (newLanguage: 'en' | 'ar') => {
    if (suggestedReplies.length > 0) {
      const freshSuggestions = getResponse('service_suggestions', newLanguage) as string[];
      setSuggestedReplies(freshSuggestions);
    }
  };

  return {
    handleSendMessage,
    suggestedReplies,
    setSuggestedReplies,
    updateSuggestedRepliesLanguage,
    conversationFlow,
    creativeSkills,
    isLoading: messageSender.isProcessing
  };
};
