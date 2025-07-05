
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error' | 'reconnecting';

export interface RealtimeMessage {
  type: string;
  [key: string]: any;
  // Common message types
  delta?: string;
  message?: string;
  reason?: string;
  code?: number;
  session?: any;
  item?: any;
  response?: any;
}

export interface WebSocketConfig {
  maxReconnectAttempts: number;
  reconnectDelay: number;
  connectionTimeout?: number;
  heartbeatInterval?: number;
}

export interface AudioConfig {
  sampleRate: number;
  channels: number;
  bufferSize: number;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
}

export interface SessionConfig {
  voice: string;
  language: 'ar' | 'en';
  temperature: number;
  instructions: string;
}

export interface VoiceChatState {
  isConnected: boolean;
  isRecording: boolean;
  isAISpeaking: boolean;
  connectionStatus: ConnectionStatus;
  error: string | null;
  messages: RealtimeMessage[];
}

export interface VoiceChatActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  sendTextMessage: (text: string) => boolean;
}
