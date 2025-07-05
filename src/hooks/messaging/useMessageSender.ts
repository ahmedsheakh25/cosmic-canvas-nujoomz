
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { saveChatMessage, type ChatMessage } from '@/utils/sessionManager';
import { detectLanguageFromMessage } from '@/lib/nujmoozInstructions';
import { generateBriefPDF } from '@/utils/pdfGenerator';
import { callChatApi } from '@/utils/chatApiUtils';

export const useMessageSender = (
  sessionId: string,
  currentLanguage: 'en' | 'ar',
  messages: ChatMessage[],
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const addUserMessage = async (finalMessage: string, effectiveLanguage: 'en' | 'ar') => {
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
  };

  const addAIMessage = async (aiResponse: string, effectiveLanguage: 'en' | 'ar') => {
    const aiMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      session_id: sessionId,
      message: aiResponse,
      sender: 'nujmooz',
      language: effectiveLanguage,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, aiMessage]);
    await saveChatMessage(sessionId, aiResponse, 'nujmooz', effectiveLanguage);
  };

  const sendToAPI = async (finalMessage: string, effectiveLanguage: 'en' | 'ar') => {
    const result = await callChatApi({
      message: finalMessage,
      sessionId: sessionId,
      language: effectiveLanguage,
      context: messages.slice(-5).map(m => `${m.sender}: ${m.message}`).join('\n')
    });

    return result.response || '';
  };

  const processWorkflow = async (briefData: any, effectiveLanguage: 'en' | 'ar') => {
    try {
      console.log('Starting complete workflow process...');
      
      const { data: workflowResult, error: workflowError } = await supabase.functions.invoke('nujmooz-workflow', {
        body: {
          sessionId: sessionId,
          projectData: briefData,
          conversationHistory: messages.slice(-10).map(m => `${m.sender}: ${m.message}`),
          skipTrello: false
        }
      });

      if (!workflowError && workflowResult?.success) {
        console.log('Workflow completed successfully:', workflowResult);
        
        // Generate PDF
        console.log('Generating PDF for brief...');
        const pdfUrl = await generateBriefPDF(briefData, sessionId);
        
        if (pdfUrl) {
          console.log('PDF generated successfully:', pdfUrl);
          
          // Update the brief record with the PDF URL
          const { error: updateError } = await supabase
            .from('project_briefs')
            .update({ pdf_url: pdfUrl })
            .eq('id', workflowResult.briefId);
            
          if (updateError) {
            console.error('Error updating brief with PDF URL:', updateError);
          }
        }
        
        return {
          success: true,
          briefId: workflowResult.briefId,
          trelloCard: workflowResult.trelloCard
        };
      }
      
      return { success: false, error: workflowError };
    } catch (error) {
      console.error('Error in workflow:', error);
      return { success: false, error };
    }
  };

  const detectEffectiveLanguage = (finalMessage: string): 'en' | 'ar' => {
    const detectedLanguage = detectLanguageFromMessage(finalMessage);
    return currentLanguage || detectedLanguage;
  };

  return {
    isProcessing,
    setIsProcessing,
    addUserMessage,
    addAIMessage,
    sendToAPI,
    processWorkflow,
    detectEffectiveLanguage
  };
};
