export const REALTIME_CONFIG = {
  WEBSOCKET: {
    get URL() {
      if (typeof window === 'undefined') return '/api/realtime-voice-chat';
      return `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/realtime-voice-chat`;
    },
    MAX_RECONNECT_ATTEMPTS: 5,
    RECONNECT_DELAY: 2000,
    CONNECTION_TIMEOUT: 15000,
    HEARTBEAT_INTERVAL: 30000,
    HEADERS: {
      'OpenAI-Beta': 'realtime=v1',
      'OpenAI-Version': '2024-02'
    }
  },
  AUDIO: {
    DEFAULT_SAMPLE_RATE: 24000,
    MIN_SAMPLE_RATE: 16000,
    MAX_SAMPLE_RATE: 48000,
    CHANNELS: 1,
    MIN_BUFFER_SIZE: 2048,
    MAX_BUFFER_SIZE: 16384,
    PREFERRED_BUFFER_SIZE: 4096,
    AUDIO_WORKLET_PATH: '/audio-processor.js',
    CONSTRAINTS: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      channelCount: 1
    }
  },
  SESSION: {
    VOICE: 'nova',
    TEMPERATURE: 0.8,
    INSTRUCTIONS: {
      AR: `أنت نجموز 👽، المساعد الإبداعي الكوني من استوديو الفضاء - Of Space Studio. تتحدث بلهجة خليجية طبيعية ودافئة، وتساعد العملاء على تحويل أفكارهم إلى مشاريع واضحة ومنظمة في مجال التصميم والتسويق الرقمي. كن مفيداً وودوداً واستخدم الرموز التعبيرية المناسبة.`,
      EN: `You are Nujmooz 👽, the creative cosmic assistant from Of Space Studio. You speak in a warm, friendly tone and help clients transform their ideas into clear, organized projects in design and digital marketing. Be helpful and friendly, using appropriate emojis.`
    }
  }
};

export const getWebSocketUrl = (): string => {
  return REALTIME_CONFIG.WEBSOCKET.URL;
};

export const getSessionInstructions = (language: 'ar' | 'en'): string => {
  const baseInstructions = language === 'ar' 
    ? REALTIME_CONFIG.SESSION.INSTRUCTIONS.AR 
    : REALTIME_CONFIG.SESSION.INSTRUCTIONS.EN;
    
  return `${baseInstructions} Always respond in the same language the user speaks - if they speak Arabic, respond in Arabic; if they speak English, respond in English.`;
};
