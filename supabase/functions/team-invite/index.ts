import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/utils.ts';

const SITE_URL = Deno.env.get('SITE_URL') || 'http://localhost:3000';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, role } = await req.json();

    // Validate request
    if (!email || !role) {
      return new Response(
        JSON.stringify({ error: 'Email and role are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate invite token
    const token = crypto.randomUUID();
    const expires = new Date();
    expires.setDate(expires.getDate() + 7); // 7 days expiry

    // Get user making the request
    const authHeader = req.headers.get('Authorization');
    const jwt = authHeader?.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(jwt);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create invite record
    const { data: invite, error: inviteError } = await supabaseClient
      .from('team_invites')
      .insert({
        email,
        role,
        token,
        invited_by: user.id,
        expires_at: expires.toISOString()
      })
      .select()
      .single();

    if (inviteError) {
      throw inviteError;
    }

    // Send invitation email
    const inviteUrl = `${SITE_URL}/join?token=${token}`;
    const { error: emailError } = await supabaseClient.functions.invoke('send-email', {
      body: {
        to: email,
        subject: 'Invitation to join OfSpace Studio',
        template: 'team-invite',
        data: {
          inviteUrl,
          invitedBy: user.email,
          role: role,
          expiresAt: expires.toLocaleDateString()
        }
      }
    });

    if (emailError) {
      console.error('Failed to send invitation email:', emailError);
    }

    return new Response(
      JSON.stringify({ data: invite, error: null }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 