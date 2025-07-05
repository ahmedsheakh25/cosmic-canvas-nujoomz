
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BriefNotificationRequest {
  projectBrief: {
    id: string;
    brief_data: any;
    status: string;
    created_at: string;
    updated_at: string;
  };
  action: 'created' | 'updated';
  adminEmail: string;
}

const generateEmailHTML = (projectBrief: any, action: string) => {
  const projectTitle = projectBrief.brief_data?.projectTitle || 
                      projectBrief.brief_data?.title || 
                      projectBrief.brief_data?.service || 
                      'Untitled Project';
  
  const description = projectBrief.brief_data?.description || 
                     projectBrief.brief_data?.projectDescription || 
                     'No description provided';

  const actionText = action === 'created' ? 'New Project Brief Created' : 'Project Brief Updated';
  const actionColor = action === 'created' ? '#10B981' : '#F59E0B';

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${actionText}</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                margin: 0; 
                padding: 0; 
                background-color: #f8fafc; 
                line-height: 1.6;
            }
            .container { 
                max-width: 600px; 
                margin: 40px auto; 
                background: white; 
                border-radius: 12px; 
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header { 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                color: white; 
                padding: 32px 40px; 
                text-align: center;
            }
            .header h1 { 
                margin: 0; 
                font-size: 24px; 
                font-weight: 600;
            }
            .status-badge {
                display: inline-block;
                padding: 6px 12px;
                background-color: ${actionColor};
                color: white;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 500;
                margin-top: 12px;
            }
            .content { 
                padding: 40px; 
            }
            .project-info {
                background-color: #f8faff;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 24px;
                margin: 24px 0;
            }
            .info-row {
                display: flex;
                padding: 8px 0;
                border-bottom: 1px solid #e2e8f0;
            }
            .info-row:last-child {
                border-bottom: none;
            }
            .info-label {
                font-weight: 600;
                color: #374151;
                min-width: 120px;
            }
            .info-value {
                color: #6b7280;
                flex: 1;
                word-break: break-word;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                padding: 14px 28px;
                border-radius: 8px;
                font-weight: 600;
                margin: 24px 0;
                text-align: center;
            }
            .footer {
                background-color: #f1f5f9;
                padding: 24px 40px;
                text-align: center;
                color: #64748b;
                font-size: 14px;
                border-top: 1px solid #e2e8f0;
            }
            .footer .logo {
                font-size: 18px;
                margin-bottom: 8px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div style="font-size: 24px; margin-bottom: 8px;">🛸</div>
                <h1>OfSpace Studio</h1>
                <div class="status-badge">${actionText}</div>
            </div>
            
            <div class="content">
                <h2 style="color: #1f2937; margin-top: 0;">Project Brief ${action === 'created' ? 'Submitted' : 'Updated'}</h2>
                <p style="color: #6b7280; font-size: 16px;">
                    ${action === 'created' ? 'A new project brief has been submitted and is ready for review.' : 'A project brief has been updated and may require your attention.'}
                </p>

                <div class="project-info">
                    <div class="info-row">
                        <div class="info-label">Project Title:</div>
                        <div class="info-value">${projectTitle}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Description:</div>
                        <div class="info-value">${description}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Service:</div>
                        <div class="info-value">${projectBrief.brief_data?.service || 'Not specified'}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Budget:</div>
                        <div class="info-value">${projectBrief.brief_data?.budget || 'Not specified'}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Timeline:</div>
                        <div class="info-value">${projectBrief.brief_data?.deadline || projectBrief.brief_data?.timeline || 'Not specified'}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Status:</div>
                        <div class="info-value">${projectBrief.status}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Brief ID:</div>
                        <div class="info-value">${projectBrief.id}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Submitted:</div>
                        <div class="info-value">${new Date(projectBrief.created_at).toLocaleString()}</div>
                    </div>
                </div>

                <div style="text-align: center;">
                    <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '.lovableproject.com') || 'https://your-app.lovableproject.com'}/admin" class="cta-button">
                        View in Admin Dashboard
                    </a>
                </div>

                <p style="color: #6b7280; font-size: 14px; margin-top: 32px;">
                    Please review this project brief and update its status as needed. You can assign team members and add internal notes through the admin dashboard.
                </p>
            </div>

            <div class="footer">
                <div class="logo">🛸 OfSpace Studio</div>
                <div>AI-Powered Creative Solutions</div>
                <div style="margin-top: 8px; font-size: 12px;">
                    This email was sent automatically by the Nujmooz Assistant system.
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { projectBrief, action, adminEmail }: BriefNotificationRequest = await req.json()

    if (!projectBrief || !action || !adminEmail) {
      console.error('Missing required fields:', { projectBrief: !!projectBrief, action, adminEmail });
      return new Response(
        JSON.stringify({ error: 'Missing required fields: projectBrief, action, adminEmail' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail)) {
      console.error('Invalid email format:', adminEmail);
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const projectTitle = projectBrief.brief_data?.projectTitle || 
                        projectBrief.brief_data?.title || 
                        projectBrief.brief_data?.service || 
                        'New Project Brief';

    const subject = action === 'created' 
      ? `🚀 New Project Brief: ${projectTitle}` 
      : `📝 Updated Project Brief: ${projectTitle}`;

    const htmlContent = generateEmailHTML(projectBrief, action);

    // Use OfSpace Studio branded sender email
    const fromEmail = 'Nujmooz - OfSpace Studio <nujmooz@ofspace.studio>';

    console.log('Attempting to send email with configuration:', { 
      action, 
      projectTitle, 
      adminEmail, 
      fromEmail,
      subjectLength: subject.length,
      htmlLength: htmlContent.length
    });

    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: [adminEmail],
      subject: subject,
      html: htmlContent,
    });

    console.log('Resend API response:', emailResponse);

    if (emailResponse.error) {
      console.error('Resend API error:', emailResponse.error);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email via Resend',
          details: emailResponse.error,
          resendError: true
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const successResponse = {
      success: true,
      emailId: emailResponse.data?.id,
      message: 'Email notification sent successfully',
      recipient: adminEmail,
      subject: subject
    };

    console.log('Email sent successfully:', successResponse);

    return new Response(
      JSON.stringify(successResponse),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Unexpected error in send-brief-notification function:', error);
    
    // Provide more detailed error information
    const errorDetails = {
      message: error.message,
      name: error.name,
      stack: error.stack?.split('\n').slice(0, 5).join('\n') // First 5 lines of stack trace
    };

    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email notification',
        details: errorDetails,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
