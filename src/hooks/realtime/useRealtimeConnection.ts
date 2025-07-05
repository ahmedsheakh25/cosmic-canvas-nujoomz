import { useState, useRef, useCallback, useEffect } from 'react';
import type { RealtimeMessage, ConnectionStatus, WebSocketConfig } from './types';
import { getWebSocketUrl, REALTIME_CONFIG } from './config';

interface UseRealtimeConnectionProps {
  sessionId: string;
  onMessage: (data: any) => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Error) => void;
}

export const useRealtimeConnection = ({
  sessionId,
  onMessage,
  onConnected,
  onDisconnected,
  onError
}: UseRealtimeConnectionProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const [sessionReady, setSessionReady] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttempts = useRef(0);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout>();

  const handleError = useCallback((error: Error) => {
    console.error('WebSocket error:', error);
    setError(error.message);
    onError?.(error);
  }, [onError]);

  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'heartbeat' }));
      }
    }, REALTIME_CONFIG.WEBSOCKET.HEARTBEAT_INTERVAL);
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = undefined;
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    stopHeartbeat();
    setIsConnected(false);
    setIsConnecting(false);
    setConnectionStatus('disconnected');
    onDisconnected?.();
  }, [onDisconnected, stopHeartbeat]);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || isConnecting) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    setIsConnecting(true);
    const wsUrl = new URL(REALTIME_CONFIG.WEBSOCKET.URL);
    wsUrl.searchParams.set('session_id', sessionId);

    console.log('Attempting to connect to WebSocket at:', wsUrl.toString());

    try {
      wsRef.current = new WebSocket(wsUrl.toString());

      // Set up connection timeout
      const connectionTimeout = setTimeout(() => {
        if (wsRef.current?.readyState !== WebSocket.OPEN) {
          console.error('WebSocket connection timeout');
          wsRef.current?.close();
          handleError(new Error('Connection timeout - failed to establish WebSocket connection'));
        }
      }, REALTIME_CONFIG.WEBSOCKET.CONNECTION_TIMEOUT);

      wsRef.current.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket connection established successfully');
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttempts.current = 0;
        startHeartbeat();
        onConnected?.();
      };

      wsRef.current.onclose = (event) => {
        clearTimeout(connectionTimeout);
        console.log('WebSocket connection closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        handleDisconnect();
      };

      wsRef.current.onerror = (event) => {
        clearTimeout(connectionTimeout);
        console.error('WebSocket error:', event);
        handleError(new Error('WebSocket connection error'));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'heartbeat') {
            wsRef.current?.send(JSON.stringify({ type: 'heartbeat_ack' }));
          } else if (data.type === 'error') {
            console.error('Received error from WebSocket server:', data.message);
            handleError(new Error(data.message));
          } else {
            console.log('Received message type:', data.type);
            onMessage(data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          if (error instanceof Error) {
            handleError(error);
          }
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setIsConnecting(false);
      handleError(error instanceof Error ? error : new Error('Failed to create WebSocket connection'));
    }
  }, [sessionId, onMessage, onConnected, handleDisconnect, handleError, startHeartbeat]);

  const disconnect = useCallback(() => {
    stopHeartbeat();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    handleDisconnect();
  }, [stopHeartbeat, handleDisconnect]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    } else {
      console.warn('Cannot send message: WebSocket is not connected');
      return false;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    sessionReady,
    connectionStatus,
    error,
    messages,
    sendMessage,
    disconnect,
    connect
  };
};
