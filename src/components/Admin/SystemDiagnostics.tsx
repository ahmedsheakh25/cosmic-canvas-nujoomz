
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Database, 
  Globe, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Copy,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface DiagnosticCheck {
  name: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  value?: string;
  action?: string;
}

const SystemDiagnostics: React.FC = () => {
  const { toast } = useToast();
  const [diagnostics, setDiagnostics] = useState<DiagnosticCheck[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addDiagnostic = (check: DiagnosticCheck) => {
    setDiagnostics(prev => [...prev, check]);
  };

  const clearDiagnostics = () => {
    setDiagnostics([]);
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    clearDiagnostics();

    // Environment Checks
    addDiagnostic({
      name: 'Current URL',
      status: 'info',
      message: 'Application URL',
      value: window.location.origin
    });

    addDiagnostic({
      name: 'Protocol',
      status: window.location.protocol === 'https:' ? 'success' : 'warning',
      message: window.location.protocol === 'https:' 
        ? 'Secure HTTPS connection' 
        : 'Non-secure HTTP connection',
      value: window.location.protocol
    });

    // Supabase Connection
    try {
      const { data, error } = await supabase.from('user_sessions').select('count').limit(1);
      if (error) throw error;
      addDiagnostic({
        name: 'Supabase Database',
        status: 'success',
        message: 'Database connection successful',
        value: 'Connected'
      });
    } catch (error) {
      addDiagnostic({
        name: 'Supabase Database',
        status: 'error',
        message: 'Database connection failed',
        value: error instanceof Error ? error.message : 'Connection error'
      });
    }

    // Edge Functions Check
    try {
      const { data, error } = await supabase.functions.invoke('enhanced-nujmooz-chat', {
        body: { test: true }
      });
      addDiagnostic({
        name: 'Edge Functions',
        status: error ? 'error' : 'success',
        message: error ? 'Edge function invocation failed' : 'Edge functions accessible',
        value: error ? error.message : 'Functional'
      });
    } catch (error) {
      addDiagnostic({
        name: 'Edge Functions',
        status: 'error',
        message: 'Cannot invoke edge functions',
        value: error instanceof Error ? error.message : 'Network error'
      });
    }

    // Browser Capabilities
    addDiagnostic({
      name: 'WebSocket Support',
      status: typeof WebSocket !== 'undefined' ? 'success' : 'error',
      message: typeof WebSocket !== 'undefined' 
        ? 'WebSocket API available' 
        : 'WebSocket not supported',
      value: typeof WebSocket !== 'undefined' ? 'Supported' : 'Not supported'
    });

    addDiagnostic({
      name: 'Web Audio API',
      status: typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined' ? 'success' : 'error',
      message: typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined'
        ? 'Web Audio API available'
        : 'Web Audio API not supported',
      value: typeof AudioContext !== 'undefined' ? 'Native support' : 
             typeof (window as any).webkitAudioContext !== 'undefined' ? 'Webkit support' : 'Not supported'
    });

    addDiagnostic({
      name: 'MediaDevices API',
      status: navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? 'success' : 'error',
      message: navigator.mediaDevices && navigator.mediaDevices.getUserMedia
        ? 'Media devices accessible'
        : 'Cannot access media devices',
      value: navigator.mediaDevices ? 'Available' : 'Not available'
    });

    // Network Information
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      addDiagnostic({
        name: 'Network Type',
        status: 'info',
        message: 'Network connection information',
        value: `${connection.effectiveType || 'unknown'} (${connection.downlink || 'unknown'}Mbps)`
      });
    }

    // Memory Information
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      addDiagnostic({
        name: 'Memory Usage',
        status: 'info',
        message: 'JavaScript heap memory usage',
        value: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB / ${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`
      });
    }

    setIsRunning(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'Diagnostic information copied'
    });
  };

  const getStatusIcon = (status: DiagnosticCheck['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: DiagnosticCheck['status']) => {
    switch (status) {
      case 'success':
        return 'border-l-4 border-l-green-500 bg-green-50';
      case 'error':
        return 'border-l-4 border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-4 border-l-blue-500 bg-blue-50';
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const successCount = diagnostics.filter(d => d.status === 'success').length;
  const errorCount = diagnostics.filter(d => d.status === 'error').length;
  const warningCount = diagnostics.filter(d => d.status === 'warning').length;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            System Diagnostics
          </CardTitle>
          <CardDescription>
            System health and environment information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button 
              onClick={runDiagnostics}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Running...' : 'Refresh Diagnostics'}
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
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Health</span>
                      <Badge variant={errorCount === 0 ? "default" : "destructive"}>
                        {errorCount === 0 ? "Healthy" : "Issues Found"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Voice Chat Ready</span>
                      <Badge variant={errorCount === 0 && warningCount < 2 ? "default" : "secondary"}>
                        {errorCount === 0 && warningCount < 2 ? "Ready" : "Issues"}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Database</span>
                      <Badge variant={diagnostics.find(d => d.name === 'Supabase Database')?.status === 'success' ? "default" : "destructive"}>
                        {diagnostics.find(d => d.name === 'Supabase Database')?.status === 'success' ? "Connected" : "Error"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Edge Functions</span>
                      <Badge variant={diagnostics.find(d => d.name === 'Edge Functions')?.status === 'success' ? "default" : "destructive"}>
                        {diagnostics.find(d => d.name === 'Edge Functions')?.status === 'success' ? "Working" : "Error"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {errorCount > 0 && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{errorCount} critical issue(s) found.</strong> Voice chat functionality may not work properly.
                </AlertDescription>
              </Alert>
            )}

            {warningCount > 0 && errorCount === 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{warningCount} warning(s) found.</strong> System should work but consider addressing these issues.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>

        <TabsContent value="details">
          <div className="space-y-3">
            {diagnostics.map((diagnostic, index) => (
              <div key={index} className={`p-4 rounded-lg ${getStatusColor(diagnostic.status)}`}>
                <div className="flex items-start gap-3">
                  {getStatusIcon(diagnostic.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{diagnostic.name}</h4>
                      {diagnostic.value && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(diagnostic.value!)}
                          className="h-6 px-2"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{diagnostic.message}</p>
                    {diagnostic.value && (
                      <p className="text-xs font-mono bg-white/50 p-2 rounded mt-2">
                        {diagnostic.value}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Export Diagnostics</CardTitle>
              <CardDescription>
                Copy diagnostic information for support or debugging
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  onClick={() => copyToClipboard(JSON.stringify(diagnostics, null, 2))}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy JSON Report
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    const report = diagnostics.map(d => 
                      `${d.name}: ${d.status.toUpperCase()} - ${d.message}${d.value ? ` (${d.value})` : ''}`
                    ).join('\n');
                    copyToClipboard(report);
                  }}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Text Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemDiagnostics;
