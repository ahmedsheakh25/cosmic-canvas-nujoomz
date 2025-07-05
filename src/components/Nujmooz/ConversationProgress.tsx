
import React from 'react';
import EnhancedProgressIndicator from './EnhancedProgressIndicator';
import PoweredBy from './PoweredBy';
import { type ConversationPhase } from '@/hooks/useConversationFlow';

interface ConversationProgressProps {
  conversationPhase: ConversationPhase;
  currentQuestionIndex: number;
  currentLanguage: 'en' | 'ar';
  showBriefPreview: boolean;
  currentService: any;
}

const ConversationProgress: React.FC<ConversationProgressProps> = ({
  conversationPhase,
  currentQuestionIndex,
  currentLanguage,
  showBriefPreview,
  currentService
}) => {
  return (
    <>
      {/* Enhanced Progress Indicator - Shows during detail collection */}
      {conversationPhase === 'collecting_details' && currentService && (
        <EnhancedProgressIndicator
          currentStep={currentQuestionIndex}
          totalSteps={6}
          currentLanguage={currentLanguage}
          showBriefPreview={showBriefPreview}
        />
      )}

      <PoweredBy currentLanguage={currentLanguage} />
    </>
  );
};

export default ConversationProgress;
