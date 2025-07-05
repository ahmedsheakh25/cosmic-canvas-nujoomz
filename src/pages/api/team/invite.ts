import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { z } from 'zod';

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['admin', 'manager', 'editor', 'viewer']),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createServerSupabaseClient({ req, res });

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user has permission to invite (must be manager or admin)
    const { data: userRoles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id);

    const hasPermission = userRoles?.some(
      (r) => r.role === 'admin' || r.role === 'manager'
    );

    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Validate request body
    const validatedData = inviteSchema.parse(req.body);

    // Generate invite token
    const token = crypto.randomUUID();
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7 days expiry

    // Create invite record
    const { data: invite, error: inviteError } = await supabase
      .from('team_invites')
      .insert({
        email: validatedData.email,
        role: validatedData.role,
        token,
        invited_by: session.user.id,
        expires_at: expires.toISOString(),
      })
      .select()
      .single();

    if (inviteError) {
      throw inviteError;
    }

    // Call edge function to send email
    const { error: emailError } = await supabase.functions.invoke(
      'team-invite',
      {
        body: {
          email: validatedData.email,
          role: validatedData.role,
        },
      }
    );

    if (emailError) {
      console.error('Failed to send invitation email:', emailError);
      // Don't fail the request if email fails, just log it
    }

    return res.status(200).json({ data: invite });
  } catch (error) {
    console.error('Team invite error:', error);
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to send invite',
    });
  }
} 