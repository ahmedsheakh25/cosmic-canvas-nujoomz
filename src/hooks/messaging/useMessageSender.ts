
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { saveChatMessage, type ChatMessage } from '@/utils/sessionManager';
import { detectLanguageFromMessage } from '@/lib/nujmoozInstructions';
import { generateBriefPDF } from '@/utils/pdfGenerator';

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
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-nujmooz', {
        body: {
          message: finalMessage,
          sessionId: sessionId,
          language: effectiveLanguage,
          conversationHistory: messages.slice(-5)
        }
      });

      if (error) throw new Error(error.message);
      
      return data?.response || (effectiveLanguage === 'ar' 
        ? 'أهلًا وسهلًا! ما فهمت عليك تماماً 🤔 ممكن توضحلي أكثر عن الفكرة الإبداعية اللي في بالك؟ يلا نشوف! ✨'
        : 'Hello there! I didn\'t quite catch that 🤔 Could you tell me more about the amazing creative idea you have in mind? Let\'s explore it together! ✨');
    } catch (error) {
      console.error('API Error:', error);
      return effectiveLanguage === 'ar'
        ? "أهلًا! صار خلل بسيط في الاتصال 👨‍💻 يلا نجرب مرة ثانية خلال دقايق! أو أرسل لي فكرتك والفريق بيتواصل معك مباشرة! ما نشيل هم 🚀"
        : "Hello! Connection hiccup 👨‍💻 Let's try again in a few minutes! Or send me your idea and our team will reach out directly! No worries at all 🚀";
    }
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
