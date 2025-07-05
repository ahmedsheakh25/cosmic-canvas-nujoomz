import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/utils.ts';

const TRELLO_API_KEY = Deno.env.get('TRELLO_API_KEY');
const TRELLO_TOKEN = Deno.env.get('TRELLO_TOKEN');
const TRELLO_BOARD_ID = Deno.env.get('TRELLO_BOARD_ID');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Handle Trello webhook callbacks
    if (req.method === 'POST' && req.headers.get('X-Trello-Webhook')) {
      const { action } = await req.json();
      
      if (action.type === 'updateCard') {
        const cardId = action.data.card.id;
        const newStatus = action.data.card.closed ? 'completed' : 'active';

        // Update project status
        const { error: updateError } = await supabaseClient
          .from('projects')
          .update({ status: newStatus })
          .eq('trello_card_id', cardId);

        if (updateError) {
          throw updateError;
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Handle project creation/update
    const { projectId } = await req.json();

    // Get project details
    const { data: project, error: projectError } = await supabaseClient
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError) {
      throw projectError;
    }

    // Create or update Trello card
    const cardData = {
      name: project.name,
      desc: project.description,
      idBoard: TRELLO_BOARD_ID,
      pos: 'bottom',
      due: project.deadline
    };

    let trelloCardId = project.trello_card_id;
    let response;

    if (trelloCardId) {
      // Update existing card
      response = await fetch(`https://api.trello.com/1/cards/${trelloCardId}?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData)
      });
    } else {
      // Create new card
      response = await fetch(`https://api.trello.com/1/cards?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardData)
      });

      if (response.ok) {
        const card = await response.json();
        trelloCardId = card.id;

        // Update project with Trello card ID
        const { error: updateError } = await supabaseClient
          .from('projects')
          .update({ trello_card_id: trelloCardId })
          .eq('id', projectId);

        if (updateError) {
          throw updateError;
        }

        // Create webhook for this card
        await fetch(`https://api.trello.com/1/webhooks?key=${TRELLO_API_KEY}&token=${TRELLO_TOKEN}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description: `Webhook for project ${projectId}`,
            callbackURL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/project-sync`,
            idModel: trelloCardId
          })
        });
      }
    }

    if (!response.ok) {
      throw new Error(`Trello API error: ${await response.text()}`);
    }

    return new Response(
      JSON.stringify({ data: { trelloCardId }, error: null }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}); 