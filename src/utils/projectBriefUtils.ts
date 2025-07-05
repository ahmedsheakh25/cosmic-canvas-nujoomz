
import { supabase } from '@/integrations/supabase/client';

export interface BriefData {
  projectTitle?: string;
  projectDescription?: string;
  budget?: string;
  timeline?: string;
  services?: string[];
  requirements?: string;
  contactInfo?: string;
  [key: string]: any;
}

export const submitProjectBrief = async (sessionId: string, briefData: BriefData) => {
  try {
    // First, get or create user by session_id
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('session_id', sessionId)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      throw userError;
    }

    // If user doesn't exist, create one
    if (!user) {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({ session_id: sessionId })
        .select('id')
        .single();

      if (createError) {
        throw createError;
      }
      user = newUser;
    }

    // Insert the project brief
    const { data, error } = await supabase
      .from('project_briefs')
      .insert({
        user_id: user.id,
        brief_data: briefData
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error submitting project brief:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

export const getProjectBriefs = async (sessionId: string) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('session_id', sessionId)
      .single();

    if (!user) {
      return { success: true, data: [] };
    }

    const { data, error } = await supabase
      .from('project_briefs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching project briefs:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
