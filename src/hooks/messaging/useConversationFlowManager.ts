
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { generateBriefPDF } from '@/utils/pdfGenerator';
import { type ChatMessage } from '@/utils/sessionManager';
import { type IntentContext } from '../useIntentAnalysis';
import { type ConversationMemoryHook } from '@/types/conversationMemory';
import { useConversationFlow } from '../useConversationFlow';
import { useCreativeSkills } from '../useCreativeSkills';

export const useConversationFlowManager = (
  sessionId: string,
  currentLanguage: 'en' | 'ar',
  messages: ChatMessage[],
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const conversationFlow = useConversationFlow(currentLanguage);
  const creativeSkills = useCreativeSkills(sessionId, currentLanguage);

  const handleCreativeSkills = async (
    finalMessage: string
  ): Promise<{ skillResponse: string | null; suggestions: string[] }> => {
    const skillResponse = await creativeSkills.detectAndHandleCreativeSkills(
      finalMessage, 
      conversationFlow.currentService
    );
    
    if (skillResponse) {
      return {
        skillResponse,
        suggestions: creativeSkills.getSkillSuggestions()
      };
    }
    
    return { skillResponse: null, suggestions: [] };
  };

  const handleConversationFlow = (
    finalMessage: string,
    conversationMemory: ConversationMemoryHook,
    intentContext: IntentContext
  ) => {
    const flowResult = conversationFlow.processUserMessage(finalMessage);
    
    if (flowResult) {
      const personalizedResponse = conversationMemory.getPersonalizedResponse(
        flowResult.response, 
        intentContext
      );
      
      return {
        response: personalizedResponse,
        suggestions: flowResult.suggestions,
        briefData: flowResult.briefData,
        completeBrief: flowResult.completeBrief
      };
    }
    
    return null;
  };

  const processBriefCompletion = async (
    briefData: any,
    conversationMemory: ConversationMemoryHook,
    intentContext: IntentContext,
    advancedProcessor: any
  ) => {
    const workflowResult = await advancedProcessor.processEnhancedWorkflow(
      briefData,
      conversationMemory.memory,
      intentContext
    );

    if (workflowResult.success) {
      console.log('Enhanced workflow completed successfully:', workflowResult);
      conversationFlow.setSavedBriefId(workflowResult.briefId);
      
      // Generate PDF with enhanced data
      console.log('Generating enhanced PDF for brief...');
      const pdfUrl = await generateBriefPDF(workflowResult.enhancedData, sessionId);
      
      if (pdfUrl) {
        console.log('Enhanced PDF generated successfully:', pdfUrl);
        
        // Update the brief record with the PDF URL
        const { error: updateError } = await supabase
          .from('project_briefs')
          .update({ pdf_url: pdfUrl })
          .eq('id', workflowResult.briefId);
          
        if (updateError) {
          console.error('Error updating brief with PDF URL:', updateError);
        }
      }
      
      return { success: true, workflowResult };
    }
    
    return { success: false, error: workflowResult.error };
  };

  return {
    conversationFlow,
    creativeSkills,
    handleCreativeSkills,
    handleConversationFlow,
    processBriefCompletion
  };
};
