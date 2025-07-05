
import { supabase } from '@/integrations/supabase/client';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to validate UUID format
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Helper function to ensure we have a valid UUID
const ensureValidSessionId = (sessionId: string): string => {
  if (isValidUUID(sessionId)) {
    return sessionId;
  }
  
  // If not a valid UUID, generate a new one
  const newSessionId = crypto.randomUUID();
  console.log(`Invalid session ID "${sessionId}" replaced with valid UUID: ${newSessionId}`);
  
  // Update localStorage with the new valid session ID
  localStorage.setItem('nujmooz_session_id', newSessionId);
  
  return newSessionId;
};

export async function getOrCreateThreadId(sessionId: string): Promise<string> {
  try {
    // Ensure we have a valid UUID
    const validSessionId = ensureValidSessionId(sessionId);
    
    // 1. Check if session already has thread_id
    const { data: existing, error } = await supabase
      .from('user_sessions')
      .select('thread_id')
      .eq('session_id', validSessionId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching thread_id:', error);
      throw error;
    }

    if (existing?.thread_id) {
      return existing.thread_id;
    }

    // 2. If not, create new thread
    const thread = await openai.beta.threads.create();

    // 3. Save it in Supabase
    const { error: insertError } = await supabase
      .from('user_sessions')
      .upsert({
        session_id: validSessionId,
        thread_id: thread.id,
      }, { onConflict: 'session_id' });

    if (insertError) {
      console.error('Error saving thread_id:', insertError);
      throw insertError;
    }

    return thread.id;
  } catch (error) {
    console.error('Error in getOrCreateThreadId:', error);
    throw error;
  }
}

export function getStoredThreadId(sessionId: string): string | undefined {
  // This function is kept for compatibility but will now return undefined
  // since we're using Supabase instead of in-memory storage
  return undefined;
}

export function clearThreadForSession(sessionId: string): boolean {
  // This function is kept for compatibility
  // In production, you might want to implement this to clear thread_id from Supabase
  return true;
}

export function getActiveSessions(): string[] {
  // This function is kept for compatibility
  // In production, you might want to implement this to query active sessions from Supabase
  return [];
}
