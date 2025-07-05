
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from './sessionManager';

export type ConversationPhase = 'initial' | 'service_detected' | 'collecting_details' | 'brief_complete' | 'reviewing_brief';

export interface ConversationContext {
  phase: ConversationPhase;
  lastKnownIntent?: string;
  briefProgress: number;
  isReturningUser: boolean;
  incompleteBrief?: Record<string, any>;
  lastInteractionTime?: string;
}

export interface MemoryAnalysis {
  context: ConversationContext;
  suggestedActions: string[];
  resumeMessage?: string;
}

// Detect restart intents
export const detectRestartIntent = (message: string, language: string): boolean => {
  const restartKeywords = language === 'ar' 
    ? ['بداية جديدة', 'خدمة جديدة', 'مشروع جديد', 'ابدأ من جديد', 'جديد', 'start new']
    : ['start new', 'new project', 'restart', 'begin again', 'fresh start'];
  
  const lowerMessage = message.toLowerCase();
  return restartKeywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
};

// Analyze conversation memory from recent messages
export const analyzeConversationMemory = async (
  sessionId: string, 
  language: string
): Promise<MemoryAnalysis> => {
  try {
    // Get last 10 messages from chat history
    const { data: recentMessages, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching conversation memory:', error);
      return getDefaultMemoryAnalysis(language);
    }

    const messages = (recentMessages || []).reverse(); // Chronological order
    
    // Check if user is returning (has previous messages)
    const isReturningUser = messages.length > 1;
    
    // Analyze last interaction time
    const lastMessage = messages[messages.length - 1];
    const lastInteractionTime = lastMessage?.created_at;
    const timeSinceLastMessage = lastInteractionTime 
      ? (Date.now() - new Date(lastInteractionTime).getTime()) / (1000 * 60 * 60) // hours
      : 0;

    // Check for brief completion patterns
    const briefCompleteKeywords = language === 'ar' 
      ? ['موجز مشروعك', 'أكملنا', 'ممتاز! لقد', 'تصدير كـ PDF']
      : ['project brief', 'completed', 'excellent!', 'export as PDF'];
    
    const hasBriefComplete = messages.some(msg => 
      msg.sender === 'nujmooz' && 
      briefCompleteKeywords.some(keyword => msg.message.includes(keyword))
    );

    // Check for service detection patterns
    const serviceDetectionKeywords = language === 'ar' 
      ? ['يبدو أنك تحتاج', 'هل هذا صحيح', 'خدمة']
      : ['looks like you need', 'is that correct', 'service'];
    
    const hasServiceDetected = messages.some(msg => 
      msg.sender === 'nujmooz' && 
      serviceDetectionKeywords.some(keyword => msg.message.includes(keyword))
    );

    // Check for collecting details patterns
    const collectingDetailsKeywords = language === 'ar' 
      ? ['السؤال التالي', 'ممتاز!', 'من', 'أخبرني']
      : ['next question', 'great!', 'tell me', 'of'];
    
    const isCollectingDetails = messages.some(msg => 
      msg.sender === 'nujmooz' && 
      collectingDetailsKeywords.some(keyword => msg.message.includes(keyword))
    );

    // Determine conversation phase
    let phase: ConversationPhase = 'initial';
    if (hasBriefComplete) {
      phase = 'brief_complete';
    } else if (isCollectingDetails) {
      phase = 'collecting_details';
    } else if (hasServiceDetected) {
      phase = 'service_detected';
    }

    // Calculate brief progress (rough estimation)
    const briefProgress = hasBriefComplete ? 100 : isCollectingDetails ? 50 : hasServiceDetected ? 25 : 0;

    // Generate suggested actions based on phase and context
    const suggestedActions = generateSuggestedActions(phase, language, isReturningUser, timeSinceLastMessage);

    // Generate resume message for returning users
    const resumeMessage = generateResumeMessage(
      phase, 
      language, 
      isReturningUser, 
      timeSinceLastMessage, 
      briefProgress
    );

    const context: ConversationContext = {
      phase,
      briefProgress,
      isReturningUser,
      lastInteractionTime,
    };

    return {
      context,
      suggestedActions,
      resumeMessage
    };

  } catch (error) {
    console.error('Error analyzing conversation memory:', error);
    return getDefaultMemoryAnalysis(language);
  }
};

// Generate suggested actions based on conversation context
const generateSuggestedActions = (
  phase: ConversationPhase, 
  language: string, 
  isReturningUser: boolean,
  timeSinceLastMessage: number
): string[] => {
  if (language === 'ar') {
    switch (phase) {
      case 'initial':
        return isReturningUser 
          ? ['مواصلة المشروع السابق', 'بدء مشروع جديد', 'أحتاج هوية تجارية', 'تصميم موقع إلكتروني']
          : ['أحتاج هوية تجارية', 'تصميم موقع إلكتروني', 'تطبيق جوال', 'خدمات تسويقية'];
      case 'service_detected':
        return ['نعم، هذا صحيح', 'أريد إضافة خدمة أخرى', 'لا، أحتاج شيئاً مختلفاً'];
      case 'collecting_details':
        return ['متابعة الأسئلة', 'تخطي هذا السؤال', 'العودة للخطوة السابقة'];
      case 'brief_complete':
        return ['تصدير كـ PDF', 'بدء مشروع جديد', 'تعديل الموجز', 'إضافة تفاصيل أخرى'];
      default:
        return ['مساعدة', 'خدمات متاحة'];
    }
  } else {
    switch (phase) {
      case 'initial':
        return isReturningUser 
          ? ['Continue previous project', 'Start new project', 'I need branding', 'Website design']
          : ['I need branding', 'Website design', 'Mobile app', 'Marketing services'];
      case 'service_detected':
        return ['Yes, that\'s correct', 'Add another service', 'No, I need something different'];
      case 'collecting_details':
        return ['Continue questions', 'Skip this question', 'Go back'];
      case 'brief_complete':
        return ['Export as PDF', 'Start new project', 'Edit brief', 'Add more details'];
      default:
        return ['Help', 'Available services'];
    }
  }
};

// Generate resume message for returning users
const generateResumeMessage = (
  phase: ConversationPhase,
  language: string,
  isReturningUser: boolean,
  timeSinceLastMessage: number,
  briefProgress: number
): string | undefined => {
  if (!isReturningUser || timeSinceLastMessage < 1) return undefined;

  if (language === 'ar') {
    if (phase === 'brief_complete') {
      return `مرحباً بعودتك! 👽 \n\nلقد أكملت موجز مشروعك مسبقاً. هل تريد:\n• مراجعة الموجز\n• بدء مشروع جديد\n• تصدير الموجز الحالي`;
    } else if (phase === 'collecting_details') {
      return `أهلاً بعودتك! 👽 \n\nكنا في منتصف جمع تفاصيل مشروعك (${briefProgress}% مكتمل). هل تريد مواصلة من حيث توقفنا؟`;
    } else if (phase === 'service_detected') {
      return `مرحباً مجدداً! 👽 \n\nكنا نناقش خدماتك المطلوبة. هل تريد إكمال المناقشة أم البدء من جديد؟`;
    }
    return `أهلاً وسهلاً بعودتك! 👽 \n\nهل تريد مواصلة مشروعك السابق أم بدء شيء جديد؟`;
  } else {
    if (phase === 'brief_complete') {
      return `Welcome back! 👽 \n\nYou've completed a project brief previously. Would you like to:\n• Review the brief\n• Start a new project\n• Export the current brief`;
    } else if (phase === 'collecting_details') {
      return `Hey there! 👽 \n\nWe were in the middle of gathering your project details (${briefProgress}% complete). Want to continue where we left off?`;
    } else if (phase === 'service_detected') {
      return `Hello again! 👽 \n\nWe were discussing your service needs. Would you like to continue that conversation or start fresh?`;
    }
    return `Welcome back! 👽 \n\nWould you like to continue your previous project or start something new?`;
  }
};

// Default memory analysis fallback
const getDefaultMemoryAnalysis = (language: string): MemoryAnalysis => {
  return {
    context: {
      phase: 'initial',
      briefProgress: 0,
      isReturningUser: false
    },
    suggestedActions: language === 'ar' 
      ? ['أحتاج هوية تجارية', 'تصميم موقع إلكتروني', 'تطبيق جوال', 'خدمات تسويقية']
      : ['I need branding', 'Website design', 'Mobile app', 'Marketing services']
  };
};
