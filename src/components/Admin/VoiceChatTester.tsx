import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Mic, 
  Phone, 
  Settings,
  RefreshCw,
  Play,
  Square,
  Volume2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import RealtimeVoiceInterface from '@/components/Nujmooz/RealtimeVoiceInterface';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
  timestamp?: string;
}

const VoiceChatTester: React.FC = () => {
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [showVoiceInterface, setShowVoiceInterface] = useState(false);
  const [testSessionId, setTestSessionId] = useState<string>('');
  const [apiTestResponse, setApiTestResponse] = useState<any>(null);
  const [wsTestLogs, setWsTestLogs] = useState<string[]>([]);

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [...prev, { ...result, timestamp: new Date().toISOString() }]);
  };

  const clearResults = () => {
    setTestResults([]);
    setApiTestResponse(null);
    setWsTestLogs([]);
  };

  // Test 1: Environment Variables Check
  const testEnvironmentVariables = async () => {
    addTestResult({
      name: 'Environment Variables',
      status: 'pending',
      message: 'Checking environment configuration...'
    });

    try {
      // Test if we can invoke a function (this will fail if keys are missing)
      const { data, error } = await supabase.functions.invoke('realtime-voice-chat', {
        body: { test: true }
      });

      if (error && error.message.includes('API key')) {
        addTestResult({
          name: 'Environment Variables',
          status: 'error',
          message: 'OpenAI API key is missing or invalid',
          details: error.message
        });
        return false;
      }

      addTestResult({
        name: 'Environment Variables',
        status: 'success',
        message: 'Environment variables appear to be configured'
      });
      return true;
    } catch (error) {
      addTestResult({
        name: 'Environment Variables',
        status: 'error',
        message: 'Failed to test environment variables',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      return false;
    }
  };

  // Test 2: Edge Function Accessibility
  const testEdgeFunction = async () => {
    addTestResult({
      name: 'Edge Function',
      status: 'pending',
      message: 'Testing realtime-voice-chat function...'
    });

    try {
      const response = await fetch(
        `https://mhlvzabsgyysciyjaaqo.supabase.co/functions/v1/realtime-voice-chat`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1obHZ6YWJzZ3lzY2l5amFhbXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMTQ0NjQsImV4cCI6MjA2Njc5MDQ2NH0.8aCUZlbFoby8LzUoDwPRYRehNQjy6tY7TcQY6uUHXwk`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1obHZ6YWJzZ3lzY2l5amFhbXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMTQ0NjQsImV4cCI6MjA2Njc5MDQ2NH0.8aCUZlbFoby8LzUoDwPRYRehNQjy6tY7TcQY6uUHXwk'
          }
        }
      );

      if (response.status === 400 && response.statusText.includes('WebSocket')) {
        addTestResult({
          name: 'Edge Function',
          status: 'success',
          message: 'Edge function is accessible and expects WebSocket upgrade',
          details: 'Function responded correctly to HTTP request'
        });
        return true;
      } else {
        addTestResult({
          name: 'Edge Function',
          status: 'warning',
          message: `Function responded with status: ${response.status}`,
          details: await response.text()
        });
        return true; // Function exists, might just need WebSocket
      }
    } catch (error) {
      addTestResult({
        name: 'Edge Function',
        status: 'error',
        message: 'Edge function is not accessible',
        details: error instanceof Error ? error.message : 'Network error'
      });
      return false;
    }
  };

  // Test 3: WebSocket Connection
  const testWebSocketConnection = async () => {
    addTestResult({
      name: 'WebSocket Connection',
      status: 'pending',
      message: 'Testing WebSocket connection...'
    });

    return new Promise<boolean>((resolve) => {
      try {
        const wsUrl = `wss://mhlvzabsgyysciyjaaqo.supabase.co/functions/v1/realtime-voice-chat`;
        const ws = new WebSocket(wsUrl);
        const logs: string[] = [];

        const timeout = setTimeout(() => {
          ws.close();
          addTestResult({
            name: 'WebSocket Connection',
            status: 'error',
            message: 'WebSocket connection timeout',
            details: logs.join('\n')
          });
          resolve(false);
        }, 10000);

        ws.onopen = () => {
          logs.push('WebSocket opened successfully');
          setWsTestLogs(prev => [...prev, ...logs]);
          clearTimeout(timeout);
          ws.close();
          addTestResult({
            name: 'WebSocket Connection',
            status: 'success',
            message: 'WebSocket connection established successfully',
            details: logs.join('\n')
          });
          resolve(true);
        };

        ws.onerror = (error) => {
          logs.push(`WebSocket error: ${error}`);
          setWsTestLogs(prev => [...prev, ...logs]);
          clearTimeout(timeout);
          addTestResult({
            name: 'WebSocket Connection',
            status: 'error',
            message: 'WebSocket connection failed',
            details: logs.join('\n')
          });
          resolve(false);
        };

        ws.onclose = (event) => {
          logs.push(`WebSocket closed: ${event.code} - ${event.reason}`);
          setWsTestLogs(prev => [...prev, ...logs]);
        };

        ws.onmessage = (event) => {
          logs.push(`WebSocket message: ${event.data}`);
          setWsTestLogs(prev => [...prev, ...logs]);
        };

      } catch (error) {
        addTestResult({
          name: 'WebSocket Connection',
          status: 'error',
          message: 'Failed to create WebSocket connection',
          details: error instanceof Error ? error.message : 'Unknown error'
        });
        resolve(false);
      }
    });
  };

  // Test 4: Browser Compatibility
  const testBrowserCompatibility = async () => {
    addTestResult({
      name: 'Browser Compatibility',
      status: 'pending',
      message: 'Checking browser capabilities...'
    });

    const issues: string[] = [];
    const features: string[] = [];

    // Check WebSocket support
    if (typeof WebSocket === 'undefined') {
      issues.push('WebSocket not supported');
    } else {
      features.push('WebSocket supported');
    }

    // Check Web Audio API
    if (typeof AudioContext === 'undefined' && typeof (window as any).webkitAudioContext === 'undefined') {
      issues.push('Web Audio API not supported');
    } else {
      features.push('Web Audio API supported');
    }

    // Check MediaDevices API
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      issues.push('MediaDevices API not supported');
    } else {
      features.push('MediaDevices API supported');
    }

    // Check for HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      issues.push('HTTPS required for audio features');
    } else {
      features.push('Secure context available');
    }

    if (issues.length === 0) {
      addTestResult({
        name: 'Browser Compatibility',
        status: 'success',
        message: 'Browser fully supports voice chat features',
        details: features.join('\n')
      });
      return true;
    } else {
      addTestResult({
        name: 'Browser Compatibility',
        status: issues.length > 2 ? 'error' : 'warning',
        message: `${issues.length} compatibility issue(s) found`,
        details: `Issues:\n${issues.join('\n')}\n\nSupported:\n${features.join('\n')}`
      });
      return issues.length <= 2;
    }
  };

  // Test 5: Microphone Access
  const testMicrophoneAccess = async () => {
    addTestResult({
      name: 'Microphone Access',
      status: 'pending',
      message: 'Requesting microphone access...'
    });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      // Test if we can create audio context
      const audioContext = new AudioContext({ sampleRate: 24000 });
      const source = audioContext.createMediaStreamSource(stream);
      
      // Clean up
      stream.getTracks().forEach(track => track.stop());
      await audioContext.close();

      addTestResult({
        name: 'Microphone Access',
        status: 'success',
        message: 'Microphone access granted and audio context created',
        details: 'Audio recording capabilities verified'
      });
      return true;
    } catch (error) {
      addTestResult({
        name: 'Microphone Access',
        status: 'error',
        message: 'Microphone access denied or failed',
        details: error instanceof Error ? error.message : 'Permission denied'
      });
      return false;
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunningTests(true);
    clearResults();

    try {
      await testBrowserCompatibility();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await testMicrophoneAccess();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await testEnvironmentVariables();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await testEdgeFunction();
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await testWebSocketConnection();
      
    } catch (error) {
      addTestResult({
        name: 'Test Suite',
        status: 'error',
        message: 'Test suite failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsRunningTests(false);
    }
  };

  // Generate test session ID
  useEffect(() => {
    setTestSessionId(`test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;
  const warningCount = testResults.filter(r => r.status === 'warning').length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-blue-600" />
            Nujmooz Voice Chat Testing Suite
          </CardTitle>
          <CardDescription>
            Comprehensive testing and debugging for the voice chat functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button 
                onClick={runAllTests}
                disabled={isRunningTests}
                className="flex items-center gap-2"
              >
                {isRunningTests ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run All Tests
                  </>
                )}
              </Button>
              
              <Button 
                onClick={clearResults}
                variant="outline"
                disabled={isRunningTests}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear Results
              </Button>

              <div className="flex items-center gap-2 ml-auto">
                <Badge variant="outline" className="bg-green-50">
                  ✓ {successCount}
                </Badge>
                <Badge variant="outline" className="bg-yellow-50">
                  ⚠ {warningCount}
                </Badge>
                <Badge variant="outline" className="bg-red-50">
                  ✗ {errorCount}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="font-semibold">Test Session ID:</h3>
              <Input value={testSessionId} readOnly className="font-mono text-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{result.name}</h4>
                        {result.timestamp && (
                          <span className="text-xs opacity-60">
                            {new Date(result.timestamp).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm mt-1">{result.message}</p>
                      {result.details && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer opacity-75">
                            Show details
                          </summary>
                          <pre className="text-xs mt-2 p-2 bg-black/5 rounded whitespace-pre-wrap">
                            {result.details}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* WebSocket Test Logs */}
      {wsTestLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>WebSocket Test Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-3 rounded text-sm max-h-40 overflow-y-auto">
              {wsTestLogs.map((log, index) => (
                <div key={index} className="font-mono text-xs py-1">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Test Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Testing Interface</CardTitle>
          <CardDescription>
            Test the voice chat interface manually after automated tests pass
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={() => setShowVoiceInterface(true)}
              disabled={errorCount > 0}
              className="flex items-center gap-2"
            >
              <Mic className="w-4 h-4" />
              Test Voice Interface
            </Button>
            
            {errorCount > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Fix the failing tests before attempting manual testing.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {errorCount > 0 && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Critical Issues Found:</strong> Voice chat will not work until these errors are resolved.
                  </AlertDescription>
                </Alert>
              )}
              
              {warningCount > 0 && errorCount === 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Warnings Found:</strong> Voice chat might work with limitations. Consider addressing these issues.
                  </AlertDescription>
                </Alert>
              )}
              
              {successCount === testResults.length && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>All Tests Passed:</strong> Voice chat should be fully functional. Test manually to confirm.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voice Interface Modal */}
      {showVoiceInterface && (
        <RealtimeVoiceInterface
          sessionId={testSessionId}
          currentLanguage="ar"
          onClose={() => setShowVoiceInterface(false)}
        />
      )}
    </div>
  );
};

export default VoiceChatTester;
