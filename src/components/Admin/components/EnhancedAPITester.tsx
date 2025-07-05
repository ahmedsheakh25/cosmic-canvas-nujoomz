import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  Play, 
  Square, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText,
  AlertTriangle,
  Loader2,
  Copy,
  Trash2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TestResult {
  id: string;
  function: string;
  status: 'success' | 'error' | 'running';
  statusCode?: number;
  response?: any;
  error?: string;
  duration?: number;
  timestamp: Date;
}

interface EdgeFunction {
  name: string;
  description: string;
  samplePayload: any;
  requiredFields: string[];
  endpoint: string;
}

const EDGE_FUNCTIONS: EdgeFunction[] = [
  {
    name: 'openai-assistants',
    description: 'Manages OpenAI assistants with full CRUD operations and sync capabilities',
    endpoint: '/functions/v1/openai-assistants',
    requiredFields: ['action'],
    samplePayload: {
      action: 'test'
    }
  },
  {
    name: 'suggest-services',
    description: 'Analyzes conversation history and suggests appropriate services',
    endpoint: '/functions/v1/suggest-services',
    requiredFields: ['sessionId', 'conversationHistory'],
    samplePayload: {
      sessionId: crypto.randomUUID(),
      conversationHistory: [
        "مرحبا، أحتاج إلى مساعدة في تصميم موقع إلكتروني لشركتي",
        "Hello! I need help with website design for my company",
        "The website should be modern and professional",
        "We want to showcase our services and portfolio"
      ],
      userContext: {
        language: 'en',
        intent: 'website_design',
        industry: 'technology'
      }
    }
  },
  {
    name: 'nujmooz-workflow',
    description: 'Creates workflow and project brief based on user requirements',
    endpoint: '/functions/v1/nujmooz-workflow',
    requiredFields: ['sessionId', 'projectData', 'conversationHistory'],
    samplePayload: {
      sessionId: crypto.randomUUID(),
      projectData: {
        service: 'Website Design',
        description: 'Modern, responsive website for technology company',
        audience: 'Business professionals and potential clients',
        style: 'Modern and professional',
        budget: '$5,000 - $10,000',
        deadline: '4-6 weeks',
        language: 'en'
      },
      conversationHistory: [
        "I need a website for my tech company",
        "It should be modern and professional",
        "Target audience is business professionals",
        "Budget is around $5,000 to $10,000"
      ],
      clientName: 'John Doe',
      skipTrello: true
    }
  },
  {
    name: 'chat-with-nujmooz',
    description: 'Main chat interface with Nujmooz AI assistant',
    endpoint: '/functions/v1/chat-with-nujmooz',
    requiredFields: ['message', 'sessionId'],
    samplePayload: {
      message: 'Hello, I need help with a creative project',
      sessionId: crypto.randomUUID(),
      language: 'en',
      conversationHistory: []
    }
  },
  {
    name: 'enhanced-nujmooz-chat',
    description: 'Enhanced chat with advanced context processing',
    endpoint: '/functions/v1/enhanced-nujmooz-chat',
    requiredFields: ['message', 'sessionId'],
    samplePayload: {
      message: 'I want to create a brand identity for my startup',
      sessionId: crypto.randomUUID(),
      language: 'en',
      context: {
        conversationPhase: 'discovery',
        previousMessages: ['Hello!', 'How can I help you today?']
      }
    }
  }
];

const EnhancedAPITester: React.FC = () => {
  const [selectedFunction, setSelectedFunction] = useState<string>('suggest-services');
  const [customPayload, setCustomPayload] = useState<string>('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [useCustomPayload, setUseCustomPayload] = useState<boolean>(false);
  const [testMode, setTestMode] = useState<'single' | 'batch'>('single');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const selectedFunctionData = EDGE_FUNCTIONS.find(f => f.name === selectedFunction);

  const generateTestData = (functionName: string) => {
    const func = EDGE_FUNCTIONS.find(f => f.name === functionName);
    if (!func) return {};

    // Generate fresh UUIDs and timestamps for each test
    let payload = JSON.parse(JSON.stringify(func.samplePayload));
    
    if (payload.sessionId) {
      payload.sessionId = crypto.randomUUID();
    }
    
    if (payload.projectData?.language) {
      payload.projectData.language = Math.random() > 0.5 ? 'en' : 'ar';
    }

    return payload;
  };

  const runSingleTest = async (functionName: string, payload?: any) => {
    const testId = crypto.randomUUID();
    const testPayload = payload || generateTestData(functionName);
    
    // Add initial test result
    const initialResult: TestResult = {
      id: testId,
      function: functionName,
      status: 'running',
      timestamp: new Date()
    };
    
    setTestResults(prev => [initialResult, ...prev]);

    try {
      const startTime = Date.now();
      
      // Create abort controller for this test
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const response = await supabase.functions.invoke(functionName, {
        body: testPayload
      });

      const duration = Date.now() - startTime;
      
      // Update test result
      const updatedResult: TestResult = {
        ...initialResult,
        status: response.error ? 'error' : 'success',
        statusCode: response.error ? 500 : 200,
        response: response.data,
        error: response.error?.message,
        duration,
        timestamp: new Date()
      };

      setTestResults(prev => prev.map(r => r.id === testId ? updatedResult : r));
      
      return updatedResult;
    } catch (error: any) {
      const updatedResult: TestResult = {
        ...initialResult,
        status: 'error',
        error: error.message,
        duration: Date.now() - Date.now(),
        timestamp: new Date()
      };

      setTestResults(prev => prev.map(r => r.id === testId ? updatedResult : r));
      return updatedResult;
    }
  };

  const runBatchTest = async () => {
    setIsRunning(true);
    
    try {
      const promises = EDGE_FUNCTIONS.map(func => 
        runSingleTest(func.name)
      );
      
      const results = await Promise.allSettled(promises);
      
      const successCount = results.filter(r => 
        r.status === 'fulfilled' && r.value.status === 'success'
      ).length;
      
      toast.success(`Batch test completed: ${successCount}/${EDGE_FUNCTIONS.length} functions passed`);
    } catch (error) {
      toast.error('Batch test failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleRunTest = async () => {
    if (isRunning) {
      // Stop current test
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      setIsRunning(false);
      return;
    }

    setIsRunning(true);

    try {
      if (testMode === 'batch') {
        await runBatchTest();
      } else {
        let payload = undefined;
        
        if (useCustomPayload && customPayload.trim()) {
          try {
            payload = JSON.parse(customPayload);
          } catch (error) {
            toast.error('Invalid JSON in custom payload');
            setIsRunning(false);
            return;
          }
        }
        
        await runSingleTest(selectedFunction, payload);
      }
    } catch (error) {
      toast.error('Test execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const exportResults = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      results: testResults
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-test-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (result: TestResult) => {
    const variant = result.status === 'success' ? 'default' : 
                   result.status === 'error' ? 'destructive' : 'secondary';
    
    return (
      <Badge variant={variant} className="ml-2">
        {result.statusCode && `${result.statusCode} - `}
        {result.status.toUpperCase()}
        {result.duration && ` (${result.duration}ms)`}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Enhanced API Function Tester
          </CardTitle>
          <CardDescription>
            Test Edge Functions with proper validation and realistic data
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Test Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Test Mode</Label>
                <Select value={testMode} onValueChange={(value: 'single' | 'batch') => setTestMode(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Function</SelectItem>
                    <SelectItem value="batch">All Functions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {testMode === 'single' && (
                <div>
                  <Label>Function to Test</Label>
                  <Select value={selectedFunction} onValueChange={setSelectedFunction}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EDGE_FUNCTIONS.map(func => (
                        <SelectItem key={func.name} value={func.name}>
                          {func.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedFunctionData && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedFunctionData.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="custom-payload"
                  checked={useCustomPayload}
                  onCheckedChange={setUseCustomPayload}
                />
                <Label htmlFor="custom-payload">Use Custom Payload</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
                <Label htmlFor="auto-refresh">Auto Refresh Results</Label>
              </div>
            </div>
          </div>

          {/* Custom Payload Editor */}
          {useCustomPayload && testMode === 'single' && (
            <div>
              <Label>Custom Payload (JSON)</Label>
              <Textarea
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                placeholder={selectedFunctionData ? 
                  JSON.stringify(selectedFunctionData.samplePayload, null, 2) : 
                  'Enter custom JSON payload...'
                }
                className="font-mono text-sm min-h-[200px]"
              />
            </div>
          )}

          {/* Sample Payload Display */}
          {!useCustomPayload && testMode === 'single' && selectedFunctionData && (
            <div>
              <Label>Sample Payload (will be used for testing)</Label>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-auto">
                {JSON.stringify(selectedFunctionData.samplePayload, null, 2)}
              </pre>
            </div>
          )}

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                onClick={handleRunTest}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <Square className="w-4 h-4" />
                    Stop Test
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run {testMode === 'batch' ? 'Batch' : 'Single'} Test
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={clearResults}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear Results
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={exportResults}
                disabled={testResults.length === 0}
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Export Results
              </Button>
            </div>
          </div>

          {/* Test Results */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Test Results</h3>
              <Badge variant="outline">
                {testResults.length} test{testResults.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            <ScrollArea className="h-[600px] border rounded-md p-4">
              {testResults.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No test results yet. Run a test to see results here.
                </div>
              ) : (
                <div className="space-y-4">
                  {testResults.map((result) => (
                    <Card key={result.id} className="border">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(result.status)}
                            <CardTitle className="text-base">{result.function}</CardTitle>
                            {getStatusBadge(result)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {result.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <Tabs defaultValue="response" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="response">Response</TabsTrigger>
                            <TabsTrigger value="error">Error</TabsTrigger>
                            <TabsTrigger value="details">Details</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="response">
                            {result.response ? (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label>Response Data</Label>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => copyToClipboard(JSON.stringify(result.response, null, 2))}
                                  >
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </div>
                                <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-48">
                                  {JSON.stringify(result.response, null, 2)}
                                </pre>
                              </div>
                            ) : (
                              <p className="text-muted-foreground">No response data</p>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="error">
                            {result.error ? (
                              <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                  {result.error}
                                </AlertDescription>
                              </Alert>
                            ) : (
                              <p className="text-muted-foreground">No errors</p>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="details">
                            <div className="space-y-2">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <Label>Function</Label>
                                  <p className="font-mono">{result.function}</p>
                                </div>
                                <div>
                                  <Label>Status Code</Label>
                                  <p className="font-mono">{result.statusCode || 'N/A'}</p>
                                </div>
                                <div>
                                  <Label>Duration</Label>
                                  <p className="font-mono">{result.duration ? `${result.duration}ms` : 'N/A'}</p>
                                </div>
                                <div>
                                  <Label>Timestamp</Label>
                                  <p className="font-mono">{result.timestamp.toISOString()}</p>
                                </div>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAPITester;
