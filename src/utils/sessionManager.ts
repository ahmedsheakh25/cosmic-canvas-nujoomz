
import { supabase } from '@/integrations/supabase/client';

export interface UserSession {
  id: string;
  session_id: string;
  language_preference: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  message: string;
  sender: 'user' | 'nujmooz';
  language: string;
  created_at: string;
}

// Helper function to validate UUID format with improved regex
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Helper function to generate a valid UUID
const generateValidUUID = (): string => {
  return crypto.randomUUID();
};

// Helper function to ensure we have a valid UUID
const ensureValidSessionId = (sessionId: string): string => {
  if (!sessionId || sessionId.trim() === '') {
    console.warn('Empty session ID provided, generating new UUID');
    const newSessionId = generateValidUUID();
    localStorage.setItem('nujmooz_session_id', newSessionId);
    return newSessionId;
  }
  
  if (isValidUUID(sessionId)) {
    return sessionId;
  }
  
  // If not a valid UUID, generate a new one
  const newSessionId = generateValidUUID();
  console.log(`Invalid session ID "${sessionId}" replaced with valid UUID: ${newSessionId}`);
  
  // Update localStorage with the new valid session ID
  localStorage.setItem('nujmooz_session_id', newSessionId);
  
  return newSessionId;
};

export const createUserSession = async (sessionId: string, language: string = 'en'): Promise<UserSession | null> => {
  try {
    // Ensure we have a valid UUID
    const validSessionId = ensureValidSessionId(sessionId);
    
    console.log('Creating user session with ID:', validSessionId);
    
    // Check if session already exists
    const existingSession = await getUserSession(validSessionId);
    if (existingSession) {
      console.log('Session already exists, returning existing session');
      return existingSession;
    }
    
    // First create in user_sessions table
    const { data: sessionData, error: sessionError } = await supabase
      .from('user_sessions')
      .insert([{
        session_id: validSessionId,
        language_preference: language
      }])
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating user session:', sessionError);
      return null;
    }

    // Then create in users table for project_briefs reference
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{
        session_id: validSessionId,
        language_preference: language
      }])
      .select()
      .single();

    if (userError) {
      console.error('Error creating user:', userError);
      // Don't fail if user creation fails, session is more important
    }

    console.log('User session created successfully:', sessionData);
    return sessionData;
  } catch (error) {
    console.error('Error creating user session:', error);
    return null;
  }
};

export const getUserSession = async (sessionId: string): Promise<UserSession | null> => {
  try {
    // Ensure we have a valid UUID
    const validSessionId = ensureValidSessionId(sessionId);
    
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .eq('session_id', validSessionId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user session:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user session:', error);
    return null;
  }
};

export const saveChatMessage = async (
  sessionId: string,
  message: string,
  sender: 'user' | 'nujmooz',
  language: string = 'en'
): Promise<ChatMessage | null> => {
  try {
    // Ensure we have a valid UUID
    const validSessionId = ensureValidSessionId(sessionId);
    
    // Validate message content
    if (!message || message.trim() === '') {
      console.error('Cannot save empty message');
      return null;
    }
    
    // Validate sender
    if (!['user', 'nujmooz'].includes(sender)) {
      console.error('Invalid sender type:', sender);
      return null;
    }
    
    // Ensure session exists
    let session = await getUserSession(validSessionId);
    if (!session) {
      console.log('Session not found, creating new session');
      session = await createUserSession(validSessionId, language);
      if (!session) {
        console.error('Failed to create session for message saving');
        return null;
      }
    }
    
    const { data, error } = await supabase
      .from('chat_conversations')
      .insert([{
        session_id: validSessionId,
        message: message.trim(),
        sender,
        language
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving chat message:', error);
      return null;
    }

    return {
      ...data,
      sender: data.sender as 'user' | 'nujmooz'
    };
  } catch (error) {
    console.error('Error saving chat message:', error);
    return null;
  }
};

export const getChatHistory = async (sessionId: string): Promise<ChatMessage[]> => {
  try {
    // Ensure we have a valid UUID
    const validSessionId = ensureValidSessionId(sessionId);
    
    const { data, error } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('session_id', validSessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }

    return (data || []).map(msg => ({
      ...msg,
      sender: msg.sender as 'user' | 'nujmooz'
    }));
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return [];
  }
};

export const updateSessionLanguage = async (sessionId: string, language: string): Promise<boolean> => {
  try {
    // Ensure we have a valid UUID
    const validSessionId = ensureValidSessionId(sessionId);
    
    // Validate language parameter
    if (!language || !['en', 'ar'].includes(language)) {
      console.error('Invalid language parameter:', language);
      return false;
    }
    
    const currentTime = new Date().toISOString();
    
    // Update both tables
    const { error: sessionError } = await supabase
      .from('user_sessions')
      .update({ 
        language_preference: language, 
        updated_at: currentTime 
      })
      .eq('session_id', validSessionId);

    const { error: userError } = await supabase
      .from('users')
      .update({ 
        language_preference: language, 
        updated_at: currentTime 
      })
      .eq('session_id', validSessionId);

    if (sessionError) {
      console.error('Error updating session language:', sessionError);
      return false;
    }
    
    if (userError) {
      console.warn('Error updating user language (non-critical):', userError);
      // Don't fail the operation if user update fails
    }

    return true;
  } catch (error) {
    console.error('Error updating session language:', error);
    return false;
  }
};

export const saveProjectBrief = async (sessionId: string, briefData: any): Promise<boolean> => {
  try {
    // Ensure we have a valid UUID
    const validSessionId = ensureValidSessionId(sessionId);
    
    // Validate brief data
    if (!briefData || typeof briefData !== 'object') {
      console.error('Invalid brief data provided');
      return false;
    }
    
    // Ensure required fields are present
    const requiredFields = ['service', 'description'];
    for (const field of requiredFields) {
      if (!briefData[field] || briefData[field].trim() === '') {
        console.error(`Missing required field: ${field}`);
        return false;
      }
    }
    
    const { data, error } = await supabase.functions.invoke('project-brief', {
      body: {
        session_id: validSessionId,
        briefData
      }
    });

    if (error) {
      console.error('Error calling project-brief function:', error);
      return false;
    }

    if (!data?.success) {
      console.error('Project brief function returned error:', data);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving project brief:', error);
    return false;
  }
};

// Additional helper functions for better session management
export const getOrCreateSession = async (sessionId?: string, language: string = 'en'): Promise<UserSession | null> => {
  try {
    let validSessionId: string;
    
    if (sessionId) {
      validSessionId = ensureValidSessionId(sessionId);
    } else {
      // Generate new session ID
      validSessionId = generateValidUUID();
      localStorage.setItem('nujmooz_session_id', validSessionId);
    }
    
    // Try to get existing session
    let session = await getUserSession(validSessionId);
    
    // Create if it doesn't exist
    if (!session) {
      session = await createUserSession(validSessionId, language);
    }
    
    return session;
  } catch (error) {
    console.error('Error getting or creating session:', error);
    return null;
  }
};

export const validateSessionId = (sessionId: string): { valid: boolean; message?: string } => {
  if (!sessionId || sessionId.trim() === '') {
    return { valid: false, message: 'Session ID is required' };
  }
  
  if (!isValidUUID(sessionId)) {
    return { valid: false, message: 'Session ID must be a valid UUID' };
  }
  
  return { valid: true };
};

export const cleanupExpiredSessions = async (): Promise<boolean> => {
  try {
    // This would typically be handled by a database trigger or cron job
    // For now, we'll just log that cleanup is needed
    console.log('Session cleanup requested - should be handled by database maintenance');
    return true;
  } catch (error) {
    console.error('Error during session cleanup:', error);
    return false;
  }
};
