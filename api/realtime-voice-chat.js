// Vercel Serverless Function for OpenAI Realtime Voice Chat WebSocket Proxy
// This replaces the Supabase Edge Function to support custom headers

import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';

const OPENAI_REALTIME_URL = 'wss://api.openai.com/v1/realtime';
const MODEL = 'gpt-4o-realtime-preview-2024-12-17';

// CORS headers for WebSocket upgrade
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control',
  'Access-Control-Allow-Credentials': 'true'
};

export default async function handler(req, res) {
  console.log('🚀 Realtime Voice Chat Function Started');
  console.log('Request method:', req.method);
  console.log('Request headers:', req.headers);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }

  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY not found in environment variables');
    res.writeHead(500, { 'Content-Type': 'application/json', ...corsHeaders });
    res.end(JSON.stringify({ error: 'OpenAI API key not configured' }));
    return;
  }

  // Check for WebSocket upgrade
  const upgrade = req.headers.upgrade;
  if (!upgrade || upgrade.toLowerCase() !== 'websocket') {
    console.log('❌ Not a WebSocket upgrade request');
    res.writeHead(400, { 'Content-Type': 'application/json', ...corsHeaders });
    res.end(JSON.stringify({ error: 'Expected WebSocket connection' }));
    return;
  }

  console.log('✅ WebSocket upgrade requested from:', req.headers.origin);

  // Create WebSocket server for handling the upgrade
  const wss = new WebSocketServer({ 
    noServer: true,
    perMessageDeflate: false 
  });

  // Handle the WebSocket upgrade
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (clientSocket) => {
    console.log('🔌 Client WebSocket connected');
    
    let openAISocket = null;
    let sessionCreated = false;
    let sessionReady = false;
    let connectionAttempts = 0;
    const maxConnectionAttempts = 3;
    let reconnectTimeout = null;
    let heartbeatInterval = null;

    const connectToOpenAI = () => {
      connectionAttempts++;
      console.log(`🤖 Attempting to connect to OpenAI (attempt ${connectionAttempts}/${maxConnectionAttempts})`);
      
      try {
        // Create WebSocket connection to OpenAI with custom headers
        openAISocket = new WebSocket(`${OPENAI_REALTIME_URL}?model=${MODEL}`, {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'OpenAI-Beta': 'realtime=v1'
          }
        });

        openAISocket.on('open', () => {
          console.log('✅ Connected to OpenAI Realtime API');
          connectionAttempts = 0;

          // Start heartbeat to keep connection alive
          heartbeatInterval = setInterval(() => {
            if (openAISocket && openAISocket.readyState === WebSocket.OPEN) {
              openAISocket.send(JSON.stringify({ type: 'ping' }));
            }
          }, 30000);

          // Notify client of successful connection
          if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(JSON.stringify({
              type: 'connection_status',
              status: 'connected',
              message: 'Connected to OpenAI Realtime API'
            }));
          }
        });

        openAISocket.on('message', (data) => {
          try {
            const message = JSON.parse(data.toString());
            console.log('📨 Received from OpenAI:', message.type);

            // Handle session creation
            if (message.type === 'session.created') {
              console.log('🎯 OpenAI session created successfully');
              sessionCreated = true;
              
              // Send session update with bilingual instructions
              const sessionUpdate = {
                type: 'session.update',
                session: {
                  modalities: ['text', 'audio'],
                  instructions: `أنت نجموز 👽، المساعد الإبداعي الكوني من استوديو الفضاء - Of Space Studio. تتحدث بلهجة خليجية طبيعية ودافئة، وتساعد العملاء على تحويل أفكارهم إلى مشاريع واضحة ومنظمة في مجال التصميم والتسويق الرقمي. كن مفيداً وودوداً واستخدم الرموز التعبيرية المناسبة. تجيب بلغة المستخدم - إذا تحدث بالعربية أجب بالعربية، وإذا تحدث بالإنجليزية أجب بالإنجليزية.

You are Nujmooz 👽, the creative cosmic assistant from Of Space Studio. You speak in a warm, friendly tone and help clients transform their ideas into clear, organized projects in design and digital marketing. Be helpful and friendly, using appropriate emojis. Always respond in the same language the user speaks - if they speak Arabic, respond in Arabic; if they speak English, respond in English.`,
                  voice: 'nova',
                  input_audio_format: 'pcm16',
                  output_audio_format: 'pcm16',
                  input_audio_transcription: {
                    model: 'whisper-1'
                  },
                  turn_detection: {
                    type: 'server_vad',
                    threshold: 0.5,
                    prefix_padding_ms: 300,
                    silence_duration_ms: 1000
                  },
                  temperature: 0.8,
                  max_response_output_tokens: 'inf'
                }
              };
              
              console.log('📤 Sending session update to OpenAI...');
              openAISocket.send(JSON.stringify(sessionUpdate));
            }

            // Handle session update confirmation
            if (message.type === 'session.updated') {
              console.log('🎉 Session updated - ready for interaction!');
              sessionReady = true;
              
              // Notify client that session is ready
              if (clientSocket.readyState === WebSocket.OPEN) {
                clientSocket.send(JSON.stringify({
                  type: 'session_ready',
                  message: 'Voice chat is ready'
                }));
              }
            }

            // Forward all messages to client
            if (clientSocket.readyState === WebSocket.OPEN) {
              clientSocket.send(data.toString());
            }
          } catch (error) {
            console.error('❌ Error processing OpenAI message:', error);
            if (clientSocket.readyState === WebSocket.OPEN) {
              clientSocket.send(JSON.stringify({
                type: 'error',
                message: 'Error processing AI response'
              }));
            }
          }
        });

        openAISocket.on('error', (error) => {
          console.error('❌ OpenAI WebSocket error:', error);
          
          if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(JSON.stringify({
              type: 'error',
              message: 'Connection to AI service failed'
            }));
          }

          // Attempt reconnection if within retry limit
          if (connectionAttempts < maxConnectionAttempts) {
            console.log(`🔄 Retrying OpenAI connection in 2 seconds...`);
            reconnectTimeout = setTimeout(connectToOpenAI, 2000);
          } else {
            console.error('💥 Max connection attempts reached for OpenAI');
            if (clientSocket.readyState === WebSocket.OPEN) {
              clientSocket.send(JSON.stringify({
                type: 'error',
                message: 'Failed to establish AI connection after multiple attempts'
              }));
            }
          }
        });

        openAISocket.on('close', (code, reason) => {
          console.log('🔌 OpenAI connection closed:', code, reason?.toString());
          sessionCreated = false;
          sessionReady = false;

          // Clear heartbeat
          if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
          }

          if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(JSON.stringify({
              type: 'connection_closed',
              code,
              reason: reason?.toString() || 'Connection closed'
            }));
          }

          // Attempt reconnection for unexpected closures
          if (code !== 1000 && connectionAttempts < maxConnectionAttempts) {
            console.log('🔄 Unexpected closure, attempting reconnection...');
            reconnectTimeout = setTimeout(connectToOpenAI, 1000);
          }
        });

      } catch (error) {
        console.error('❌ Error creating OpenAI WebSocket:', error);
        if (clientSocket.readyState === WebSocket.OPEN) {
          clientSocket.send(JSON.stringify({
            type: 'error',
            message: 'Failed to initialize AI connection'
          }));
        }
      }
    };

    // Handle client messages
    clientSocket.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('📩 Received from client:', message.type);

        // Handle ping/pong for connection health
        if (message.type === 'ping') {
          clientSocket.send(JSON.stringify({ type: 'pong' }));
          return;
        }

        // Forward messages to OpenAI if session is ready
        if (sessionReady && openAISocket && openAISocket.readyState === WebSocket.OPEN) {
          openAISocket.send(data.toString());
          console.log(`✅ Forwarded ${message.type} to OpenAI`);
        } else {
          console.log(`⚠️ Session not ready (${sessionReady}) or OpenAI not connected`);
          if (clientSocket.readyState === WebSocket.OPEN) {
            clientSocket.send(JSON.stringify({
              type: 'error',
              message: sessionReady ? 'AI service not connected' : 'Session not ready - please wait for setup to complete'
            }));
          }
        }
      } catch (error) {
        console.error('❌ Error processing client message:', error);
        if (clientSocket.readyState === WebSocket.OPEN) {
          clientSocket.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
          }));
        }
      }
    });

    // Handle client disconnection
    clientSocket.on('close', (code, reason) => {
      console.log('🔌 Client disconnected:', code, reason?.toString());
      
      // Clean up OpenAI connection
      if (openAISocket) {
        openAISocket.close();
        openAISocket = null;
      }

      // Clear timeouts and intervals
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
      
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
      
      sessionCreated = false;
      sessionReady = false;
    });

    clientSocket.on('error', (error) => {
      console.error('❌ Client WebSocket error:', error);
    });

    // Initialize connection to OpenAI
    connectToOpenAI();
  });

  // The response is handled by the WebSocket upgrade
  // Vercel will maintain the connection
} 