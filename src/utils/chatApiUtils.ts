import { supabase } from '@/integrations/supabase/client';
import { createUserSession, getUserSession } from '@/utils/sessionManager';

interface ChatApiParams {
  message: string;
  sessionId: string;
  language: 'en' | 'ar';
  persona?: string;
  context?: string;
  currentBrief?: any;
}

interface ChatApiResponse {
  success: boolean;
  response?: string;
  error?: string;
}

/**
 * Ensures a session exists in the database before making API calls
 */
export const ensureSessionExists = async (sessionId: string, language: 'en' | 'ar'): Promise<boolean> => {
  try {
    console.log('🔍 Checking if session exists:', sessionId);
    
    let session = await getUserSession(sessionId);
    
    if (!session) {
      console.log('📝 Creating new session:', sessionId);
      session = await createUserSession(sessionId, language);
      if (!session) {
        console.error('❌ Failed to create session');
        return false;
      }
    }
    
    console.log('✅ Session exists:', session.session_id);
    return true;
  } catch (error) {
    console.error('❌ Error ensuring session exists:', error);
    return false;
  }
};

/**
 * Calls the enhanced chat API with retry logic and proper error handling
 */
export const callChatApi = async (params: ChatApiParams, retries = 2): Promise<ChatApiResponse> => {
  try {
    // Ensure session exists first
    const sessionExists = await ensureSessionExists(params.sessionId, params.language);
    if (!sessionExists) {
      return {
        success: false,
        error: 'Failed to create or verify session',
        response: params.language === 'ar' 
          ? 'عذراً، حدث خطأ في إنشاء جلسة المحادثة. يرجى إعادة تحميل الصفحة.'
          : 'Sorry, there was an error creating the chat session. Please refresh the page.'
      };
    }

    console.log('🚀 Calling enhanced-nujmooz-chat API');
    
    const { data, error } = await supabase.functions.invoke('enhanced-nujmooz-chat', {
      body: {
        message: params.message,
        sessionId: params.sessionId,
        language: params.language,
        persona: params.persona || 'You are Nujmooz 👽, a creative cosmic assistant from OfSpace Studio.',
        context: params.context || '',
        currentBrief: params.currentBrief || null
      }
    });

    if (error) {
      console.error('❌ Edge function error:', error);
      throw new Error(error.message);
    }

    if (!data?.response) {
      throw new Error('No response received from API');
    }

    console.log('✅ Chat API response received');
    
    return {
      success: true,
      response: data.response
    };

  } catch (error) {
    console.error(`❌ Chat API error (${3 - retries} retries left):`, error);
    
    // Retry logic
    if (retries > 0 && shouldRetry(error)) {
      console.log(`♻️ Retrying API call in 1 second...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return callChatApi(params, retries - 1);
    }

    // Return fallback response
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      response: getFallbackResponse(params.language, error)
    };
  }
};

/**
 * Determines if an error should trigger a retry
 */
const shouldRetry = (error: any): boolean => {
  const retryableErrors = [
    'timeout',
    'network',
    'fetch failed',
    '5xx',
    'Internal Server Error'
  ];
  
  const errorString = error?.message?.toLowerCase() || '';
  return retryableErrors.some(retryable => errorString.includes(retryable));
};

/**
 * Provides intelligent fallback responses based on error type
 */
const getFallbackResponse = (language: 'en' | 'ar', error: any): string => {
  const errorMessage = error?.message?.toLowerCase() || '';
  
  if (errorMessage.includes('openai') || errorMessage.includes('api key')) {
    return language === 'ar'
      ? 'أهلًا! يبدو أن هناك مشكلة تقنية مؤقتة مع الذكاء الاصطناعي 🤖 لكن فريقنا متاح للمساعدة! أرسل لنا فكرتك وسنتواصل معك قريباً ✨'
      : 'Hello! There seems to be a temporary technical issue with our AI assistant 🤖 But our team is here to help! Send us your idea and we\'ll get back to you soon ✨';
  }
  
  if (errorMessage.includes('session') || errorMessage.includes('database')) {
    return language === 'ar'
      ? 'عذراً، حدث خطأ في حفظ المحادثة 💾 يرجى إعادة تحميل الصفحة والمحاولة مرة أخرى'
      : 'Sorry, there was an error saving the conversation 💾 Please refresh the page and try again';
  }
  
  // Generic fallback
  return language === 'ar'
    ? 'أهلًا! حدث خلل تقني بسيط 👨‍💻 يمكنك المحاولة مرة أخرى، أو أرسل لنا فكرتك والفريق سيتواصل معك مباشرة! 🚀'
    : 'Hello! Small technical hiccup 👨‍💻 You can try again, or send us your idea and our team will reach out directly! 🚀';
};
