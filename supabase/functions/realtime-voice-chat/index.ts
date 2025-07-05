// DISABLED SUPABASE REALTIME VOICE CHAT FUNCTION
// This function has been migrated to Vercel Serverless Function at /api/realtime-voice-chat.js
// to support OpenAI Realtime API custom headers which are not supported in Deno/Supabase Edge Functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("⚠️ NOTICE: Supabase realtime-voice-chat function is DISABLED");
console.log("🔄 WebSocket functionality moved to Vercel API route: /api/realtime-voice-chat");
console.log("📝 Reason: OpenAI Realtime API requires custom headers not supported in Deno WebSocket");

serve(async (req) => {
  console.log("❌ Attempt to use disabled Supabase realtime-voice-chat function");
  
  return new Response(
    JSON.stringify({ 
      error: "This Supabase function is disabled",
      message: "WebSocket functionality has been migrated to Vercel Serverless Function",
      newEndpoint: "/api/realtime-voice-chat",
      reason: "OpenAI Realtime API requires custom headers not supported in Deno WebSocket",
      status: "disabled",
      timestamp: new Date().toISOString()
    }), 
    { 
      status: 410, // Gone - indicates that the resource is no longer available
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Migration-Notice': 'Function moved to Vercel',
        'X-New-Endpoint': '/api/realtime-voice-chat'
      } 
    }
  );
});
