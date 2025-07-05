
import { supabase } from '@/integrations/supabase/client';

interface ProjectBrief {
  id: string;
  brief_data: any;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface EmailNotificationOptions {
  projectBrief: ProjectBrief;
  action: 'created' | 'updated';
  adminEmail?: string;
}

interface EmailResponse {
  success: boolean;
  error?: string;
  emailId?: string;
  details?: any;
}

const DEFAULT_ADMIN_EMAIL = 'admin@ofspace.studio';

export const sendBriefNotification = async ({ 
  projectBrief, 
  action, 
  adminEmail = DEFAULT_ADMIN_EMAIL
}: EmailNotificationOptions): Promise<EmailResponse> => {
  try {
    console.log('Sending brief notification:', { 
      briefId: projectBrief.id, 
      action, 
      targetEmail: adminEmail
    });
    
    const { data, error } = await supabase.functions.invoke('send-brief-notification', {
      body: {
        projectBrief,
        action,
        adminEmail
      }
    });

    if (error) {
      console.error('Error invoking email function:', error);
      return { 
        success: false, 
        error: `Failed to invoke function: ${error.message}`,
        details: error
      };
    }

    // Check if the response indicates a Resend API error
    if (data?.resendError) {
      console.error('Resend API error returned:', data);
      return {
        success: false,
        error: `Email service error: ${data.details?.message || 'Unknown Resend error'}`,
        details: data.details
      };
    }

    console.log('Email notification sent successfully:', data);
    return { 
      success: true, 
      emailId: data?.emailId,
      details: data
    };
  } catch (error) {
    console.error('Error sending brief notification:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: error
    };
  }
};

// Helper function to send notification when a brief is created
export const sendNewBriefNotification = async (
  projectBrief: ProjectBrief, 
  adminEmail?: string
): Promise<EmailResponse> => {
  return sendBriefNotification({
    projectBrief,
    action: 'created',
    adminEmail
  });
};

// Helper function to send notification when a brief is updated
export const sendUpdatedBriefNotification = async (
  projectBrief: ProjectBrief, 
  adminEmail?: string
): Promise<EmailResponse> => {
  return sendBriefNotification({
    projectBrief,
    action: 'updated',
    adminEmail
  });
};

// Utility function to validate email addresses
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
