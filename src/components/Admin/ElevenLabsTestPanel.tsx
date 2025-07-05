import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Volume2, Check, AlertCircle, Play, Pause } from 'lucide-react';
import { elevenLabsClient } from '@/integrations/elevenlabs/client';
import { useToast } from '@/components/ui/use-toast';

export const ElevenLabsTestPanel: React.FC = () => {
  const [testText, setTestText] = useState('مرحباً! أنا نجموز، المساعد الذكي من استوديو الفضاء.');
  const [isTestingTTS, setIsTestingTTS] = useState(false);
  const [isTestingVoices, setIsTestingVoices] = useState(false);
  const [voices, setVoices] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const testTextToSpeech = async () => {
    if (!testText.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some text to test',
        variant: 'destructive'
      });
      return;
    }

    setIsTestingTTS(true);

    try {
      const audioBlob = await elevenLabsClient.textToSpeech(testText);
      
      if (!audioBlob) {
        throw new Error('Failed to generate speech - check your ElevenLabs configuration');
      }

      // Play the generated audio
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setCurrentAudio(audio);
      setIsPlaying(true);
      setConnectionStatus('connected');

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: 'Playback Error',
          description: 'Failed to play generated audio',
          variant: 'destructive'
        });
      };

      await audio.play();

      toast({
        title: 'Success! 🎤',
        description: 'ElevenLabs text-to-speech is working correctly',
      });

    } catch (error) {
      console.error('TTS test error:', error);
      setConnectionStatus('error');
      
      toast({
        title: 'Text-to-Speech Test Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsTestingTTS(false);
    }
  };

  const testVoicesList = async () => {
    setIsTestingVoices(true);

    try {
      const voicesList = await elevenLabsClient.getVoices();
      
      if (!voicesList) {
        throw new Error('Failed to fetch voices - check your ElevenLabs API key');
      }

      setVoices(voicesList);
      setConnectionStatus('connected');

      toast({
        title: 'Success! 🎤',
        description: `Found ${voicesList.length} available voices`,
      });

    } catch (error) {
      console.error('Voices test error:', error);
      setConnectionStatus('error');
      
      toast({
        title: 'Voices Test Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsTestingVoices(false);
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Badge variant="default" className="bg-green-500"><Check className="w-3 h-3 mr-1" />Connected</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>🎤 ElevenLabs Integration Test</span>
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Text-to-Speech */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Text-to-Speech</label>
          <Textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Enter text to convert to speech..."
            className="min-h-20"
          />
          <div className="flex gap-2">
            <Button
              onClick={testTextToSpeech}
              disabled={isTestingTTS || !testText.trim()}
              className="flex-1"
            >
              {isTestingTTS ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Volume2 className="w-4 h-4 mr-2" />
              )}
              Generate & Play Speech
            </Button>
            
            {isPlaying && (
              <Button
                onClick={stopAudio}
                variant="outline"
                size="icon"
              >
                <Pause className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Test Voices List */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Voice Access</label>
          <Button
            onClick={testVoicesList}
            disabled={isTestingVoices}
            variant="outline"
            className="w-full"
          >
            {isTestingVoices ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Fetch Available Voices
          </Button>
          
          {voices.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-muted-foreground mb-2">Found {voices.length} voices:</p>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {voices.slice(0, 10).map((voice, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {voice.name}
                  </Badge>
                ))}
                {voices.length > 10 && (
                  <Badge variant="secondary" className="text-xs">
                    +{voices.length - 10} more...
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status Information */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• This test uses your configured ElevenLabs API credentials</p>
          <p>• Text-to-speech is processed through secure Edge Functions</p>
          <p>• Voice synthesis supports both Arabic and English text</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ElevenLabsTestPanel;