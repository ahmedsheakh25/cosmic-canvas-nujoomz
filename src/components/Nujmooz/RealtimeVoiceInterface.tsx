import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  X, 
  Loader2, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRealtimeVoiceChat } from '@/hooks/realtime/useRealtimeVoiceChat';
import VoiceConnectionStatus from './VoiceConnectionStatus';

interface RealtimeVoiceInterfaceProps {
  sessionId: string;
  currentLanguage: 'ar' | 'en';
  onClose: () => void;
}

const RealtimeVoiceInterface: React.FC<RealtimeVoiceInterfaceProps> = ({
  sessionId,
  currentLanguage,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const {
    isConnected,
    sessionReady,
    connectionStatus,
    error: connectionError,
    connect,
    disconnect,
    startRecording,
    stopRecording
  } = useRealtimeVoiceChat(sessionId);

  useEffect(() => {
    const initializeConnection = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await connect();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to voice chat');
        console.error('Voice chat connection error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeConnection();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  // Loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-background p-6 rounded-lg shadow-xl">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <p>{currentLanguage === 'ar' ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || connectionError) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-background p-6 rounded-lg shadow-xl max-w-md">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <p className="text-center text-destructive">
              {error || connectionError}
            </p>
            <div className="flex gap-3">
              <Button onClick={onClose} variant="outline">
                {currentLanguage === 'ar' ? 'إغلاق' : 'Close'}
              </Button>
              <Button onClick={() => window.location.reload()} variant="default">
                {currentLanguage === 'ar' ? 'إعادة المحاولة' : 'Retry'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleConnect = async () => {
    try {
      setPermissionError(null);
      await connect();
    } catch (error) {
      console.error('Failed to connect:', error);
      if (error instanceof Error && error.message.includes('microphone')) {
        setPermissionError('Please allow microphone access to use voice chat.');
      }
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onClose();
  };

  const handleToggleRecording = async () => {
    if (!sessionReady) {
      console.log("Session not ready yet, please wait");
      return;
    }

    if (isRecording) {
      stopRecording();
      setIsRecording(false);
    } else {
      try {
        await startRecording();
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to start recording:', error);
        if (error instanceof Error && error.message.includes('microphone')) {
          setPermissionError('Please allow microphone access to record audio.');
        }
      }
    }
  };

  const canRecord = isConnected && sessionReady && !permissionError;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md mx-auto"
          dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
        >
          <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 shadow-2xl border-2">
            <CardHeader className="text-center border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                    <span className="text-white text-sm">👽</span>
                  </div>
                  <CardTitle className="text-lg">
                    {currentLanguage === 'ar' ? 'نجموز الصوتي' : 'Nujmooz Voice'}
                  </CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Connection Status */}
              <div className="flex items-center justify-center mt-3">
                <VoiceConnectionStatus 
                  status={connectionStatus}
                  language={currentLanguage}
                  error={permissionError || error}
                />
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Permission Error Alert */}
              {permissionError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {permissionError}
                  </AlertDescription>
                </Alert>
              )}

              {/* Main Controls */}
              <div className="flex flex-col items-center gap-4">
                {!isConnected ? (
                  <Button
                    onClick={handleConnect}
                    disabled={connectionStatus === 'connecting'}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full"
                  >
                    {connectionStatus === 'connecting' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {currentLanguage === 'ar' ? 'جاري الاتصال...' : 'Connecting...'}
                      </>
                    ) : (
                      <>
                        <Phone className="w-4 h-4 mr-2" />
                        {currentLanguage === 'ar' ? 'بدء المحادثة' : 'Start Chat'}
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Button
                      onClick={handleToggleRecording}
                      disabled={!canRecord}
                      className={`px-6 py-3 rounded-full ${
                        isRecording 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white`}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-4 h-4 mr-2" />
                          {currentLanguage === 'ar' ? 'إيقاف التسجيل' : 'Stop Recording'}
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 mr-2" />
                          {currentLanguage === 'ar' ? 'بدء التسجيل' : 'Start Recording'}
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleDisconnect}
                      variant="outline"
                      className="px-6 py-3 rounded-full"
                    >
                      <PhoneOff className="w-4 h-4 mr-2" />
                      {currentLanguage === 'ar' ? 'إنهاء المحادثة' : 'End Chat'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RealtimeVoiceInterface;
