
import { useState } from 'react';
import { 
  detectServicesFromInput, 
  generateServiceConfirmationMessage, 
  getNextQuestion,
  getServiceDisplayName,
  hasMoreQuestions,
  getBriefProgress,
  generateCompletionMessage,
  type ServiceType
} from '@/lib/aiRouter';
import { getResponse } from '@/lib/responses';

export type ConversationPhase = 'initial' | 'service_detected' | 'collecting_details' | 'brief_complete';

type FlowResult = {
  response: string;
  suggestions: string[];
  answers?: Record<string, string>;
  completeBrief?: boolean;
  briefData?: any;
};

export const useConversationFlow = (currentLanguage: 'en' | 'ar') => {
  const [conversationPhase, setConversationPhase] = useState<ConversationPhase>('initial');
  const [detectedServices, setDetectedServices] = useState<ServiceType[]>([]);
  const [currentService, setCurrentService] = useState<ServiceType | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [briefAnswers, setBriefAnswers] = useState<Record<string, string>>({});
  const [showBriefPreview, setShowBriefPreview] = useState(false);
  const [savedBriefId, setSavedBriefId] = useState<string | null>(null);

  const handleInitialPhase = (userMessage: string): FlowResult | null => {
    const services = detectServicesFromInput(userMessage, currentLanguage);
    
    if (services.length > 0) {
      setDetectedServices(services);
      setConversationPhase('service_detected');
      
      const confirmationMessage = generateServiceConfirmationMessage(services, currentLanguage);
      const suggestions = currentLanguage === 'ar' 
        ? ['نعم، هذا صحيح', 'أريد إضافة خدمة أخرى', 'لا، أحتاج شيئاً مختلفاً']
        : ['Yes, that\'s correct', 'I want to add another service', 'No, I need something different'];
      
      return { response: confirmationMessage, suggestions };
    }
    
    return null;
  };

  const handleServiceDetectedPhase = (userMessage: string): FlowResult | null => {
    const userConfirmed = userMessage.toLowerCase().includes('yes') || 
                        userMessage.toLowerCase().includes('نعم') || 
                        userMessage.toLowerCase().includes('صحيح') ||
                        userMessage.toLowerCase().includes('correct');
    
    if (userConfirmed && detectedServices.length > 0) {
      const selectedService = detectedServices[0];
      setCurrentService(selectedService);
      setCurrentQuestionIndex(0);
      setConversationPhase('collecting_details');
      
      const firstQuestion = getNextQuestion(selectedService, 0, currentLanguage);
      const confirmText = getResponse('service_confirm', currentLanguage) as string;
      const response = `${confirmText}\n\n${firstQuestion}`;
      
      return { response, suggestions: [] };
    } else {
      setConversationPhase('initial');
      setDetectedServices([]);
      const response = getResponse('fallback', currentLanguage) as string;
      
      return { response, suggestions: [] };
    }
  };

  const handleCollectingDetailsPhase = (userMessage: string): FlowResult | null => {
    if (!currentService) return null;

    const answerKey = `question_${currentQuestionIndex}`;
    const newAnswers = { ...briefAnswers, [answerKey]: userMessage };
    setBriefAnswers(newAnswers);

    if (hasMoreQuestions(currentService, currentQuestionIndex)) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      const nextQuestion = getNextQuestion(currentService, nextIndex, currentLanguage);
      const progress = getBriefProgress(currentService, nextIndex, currentLanguage);
      const nextText = getResponse('next_question', currentLanguage) as string;
      
      const response = `${nextText} (${progress})\n\n${nextQuestion}`;
      
      return { response, suggestions: [], answers: newAnswers };
    } else {
      setConversationPhase('brief_complete');
      setShowBriefPreview(true);
      
      const response = getResponse('all_done', currentLanguage) as string;
      const suggestions = currentLanguage === 'ar' 
        ? ['تصدير كـ PDF', 'بدء مشروع جديد', 'تعديل الموجز']
        : ['Export as PDF', 'Start new project', 'Edit brief'];

      return { 
        response, 
        suggestions, 
        answers: newAnswers, 
        completeBrief: true,
        briefData: {
          service: getServiceDisplayName(currentService, currentLanguage),
          description: newAnswers['question_1'] || 'Project description',
          audience: newAnswers['question_2'] || 'General audience',
          style: newAnswers['question_3'] || 'Modern style',
          budget: newAnswers['question_4'] || 'To be discussed',
          deadline: newAnswers['question_5'] || 'Flexible timeline',
          language: currentLanguage
        }
      };
    }
  };

  const processUserMessage = (userMessage: string): FlowResult | null => {
    switch (conversationPhase) {
      case 'initial':
        return handleInitialPhase(userMessage);
      case 'service_detected':
        return handleServiceDetectedPhase(userMessage);
      case 'collecting_details':
        return handleCollectingDetailsPhase(userMessage);
      default:
        return null;
    }
  };

  const getBriefData = () => {
    if (showBriefPreview && currentService && conversationPhase === 'brief_complete') {
      return {
        service: getServiceDisplayName(currentService, currentLanguage),
        description: briefAnswers['question_1'] || 'Project description',
        audience: briefAnswers['question_2'] || 'General audience',
        style: briefAnswers['question_3'] || 'Modern style',
        budget: briefAnswers['question_4'] || 'To be discussed',
        deadline: briefAnswers['question_5'] || 'Flexible timeline',
        language: currentLanguage
      };
    }
    return null;
  };

  // New methods to fix TypeScript errors
  const shouldShowConfirmation = (): boolean => {
    return conversationPhase === 'collecting_details' && 
           currentService !== null && 
           !hasMoreQuestions(currentService, currentQuestionIndex);
  };

  const resetToStep = (stepIndex: number): void => {
    setCurrentQuestionIndex(stepIndex);
    const newAnswers = { ...briefAnswers };
    // Remove answers after the reset step
    Object.keys(newAnswers).forEach(key => {
      const questionNum = parseInt(key.replace('question_', ''));
      if (questionNum > stepIndex) {
        delete newAnswers[key];
      }
    });
    setBriefAnswers(newAnswers);
    setConversationPhase('collecting_details');
    setShowBriefPreview(false);
  };

  const completeConversation = (): void => {
    setConversationPhase('brief_complete');
    setShowBriefPreview(true);
  };

  return {
    conversationPhase,
    detectedServices,
    currentService,
    currentQuestionIndex,
    briefAnswers,
    showBriefPreview,
    savedBriefId,
    setSavedBriefId,
    processUserMessage,
    getBriefData,
    shouldShowConfirmation,
    resetToStep,
    completeConversation
  };
};
