
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Server, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const EdgeFunctionTester: React.FC = () => {
  const [isTestingNujmooz, setIsTestingNujmooz] = useState(false);
  const [isTestingWorkflow, setIsTestingWorkflow] = useState(false);
  const [nujmoozResult, setNujmoozResult] = useState<any>(null);
  const [workflowResult, setWorkflowResult] = useState<any>(null);
  const [testLogs, setTestLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setTestLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testNujmoozChat = async () => {
    setIsTestingNujmooz(true);
    setNujmoozResult(null);
    addLog('Testing enhanced-nujmooz-chat function...');

    try {
      const { data, error } = await supabase.functions.invoke('enhanced-nujmooz-chat', {
        body: {
          message: 'مرحباً نجموز، هل تعمل بشكل صحيح؟',
          sessionId: `test-${Date.now()}`,
          language: 'ar'
        }
      });

      if (error) {
        addLog(`Nujmooz chat test failed: ${error.message}`);
        setNujmoozResult({ success: false, error: error.message });
      } else {
        addLog('Nujmooz chat test completed successfully');
        setNujmoozResult({ success: true, data });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Nujmooz chat test error: ${errorMsg}`);
      setNujmoozResult({ success: false, error: errorMsg });
    } finally {
      setIsTestingNujmooz(false);
    }
  };

  const testWorkflowFunction = async () => {
    setIsTestingWorkflow(true);
    setWorkflowResult(null);
    addLog('Testing nujmooz-workflow function...');

    const testData = {
      sessionId: `workflow-test-${Date.now()}`,
      projectData: {
        service: 'تصميم موقع إلكتروني',
        description: 'موقع تجاري بسيط',
        audience: 'عملاء محليين',
        language: 'ar'
      },
      conversationHistory: ['user: مرحباً', 'nujmooz: أهلاً وسهلاً'],
      clientName: 'عميل تجريبي'
    };

    try {
      const { data, error } = await supabase.functions.invoke('nujmooz-workflow', {
        body: testData
      });

      if (error) {
        addLog(`Workflow test failed: ${error.message}`);
        setWorkflowResult({ success: false, error: error.message });
      } else {
        addLog('Workflow test completed successfully');
        setWorkflowResult({ success: true, data });
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Workflow test error: ${errorMsg}`);
      setWorkflowResult({ success: false, error: errorMsg });
    } finally {
      setIsTestingWorkflow(false);
    }
  };

  const clearLogs = () => {
    setTestLogs([]);
    setNujmoozResult(null);
    setWorkflowResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-purple-600" />
            Edge Function Testing
          </CardTitle>
          <CardDescription>
            Test Supabase Edge Functions for Nujmooz system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="font-semibold">Nujmooz Chat Function</h3>
              <Button 
                onClick={testNujmoozChat}
                disabled={isTestingNujmooz}
                className="w-full"
              >
                {isTestingNujmooz ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing Chat...
                  </>
                ) : (
                  'Test Nujmooz Chat'
                )}
              </Button>
              
              {nujmoozResult && (
                <Alert variant={nujmoozResult.success ? "default" : "destructive"}>
                  {nujmoozResult.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {nujmoozResult.success 
                      ? 'Chat function is working correctly'
                      : `Error: ${nujmoozResult.error}`
                    }
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Workflow Function</h3>
              <Button 
                onClick={testWorkflowFunction}
                disabled={isTestingWorkflow}
                className="w-full"
              >
                {isTestingWorkflow ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing Workflow...
                  </>
                ) : (
                  'Test Workflow'
                )}
              </Button>
              
              {workflowResult && (
                <Alert variant={workflowResult.success ? "default" : "destructive"}>
                  {workflowResult.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                  <AlertDescription>
                    {workflowResult.success 
                      ? 'Workflow function is working correctly'
                      : `Error: ${workflowResult.error}`
                    }
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Button onClick={clearLogs} variant="outline" size="sm">
              Clear Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {(nujmoozResult || workflowResult) && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nujmoozResult && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    Nujmooz Chat Result
                    <Badge variant={nujmoozResult.success ? "default" : "destructive"}>
                      {nujmoozResult.success ? "Success" : "Failed"}
                    </Badge>
                  </h4>
                  <Textarea
                    value={JSON.stringify(nujmoozResult, null, 2)}
                    readOnly
                    className="font-mono text-sm h-40"
                  />
                </div>
              )}

              {workflowResult && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    Workflow Result
                    <Badge variant={workflowResult.success ? "default" : "destructive"}>
                      {workflowResult.success ? "Success" : "Failed"}
                    </Badge>
                  </h4>
                  <Textarea
                    value={JSON.stringify(workflowResult, null, 2)}
                    readOnly
                    className="font-mono text-sm h-40"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Logs */}
      {testLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-3 rounded text-sm max-h-60 overflow-y-auto">
              {testLogs.map((log, index) => (
                <div key={index} className="font-mono text-xs py-1">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EdgeFunctionTester;
