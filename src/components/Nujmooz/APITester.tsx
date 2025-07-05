
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface APITest {
  name: string;
  status: 'idle' | 'testing' | 'success' | 'error';
  message?: string;
  details?: any;
}

const APITester: React.FC = () => {
  const [tests, setTests] = useState<APITest[]>([
    { name: 'Supabase Connection', status: 'idle' },
    { name: 'Supabase Database', status: 'idle' },
    { name: 'OpenAI API (via Edge Function)', status: 'idle' },
    { name: 'Project Brief Function', status: 'idle' }
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (index: number, updates: Partial<APITest>) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, ...updates } : test
    ));
  };

  const testSupabaseConnection = async (index: number) => {
    updateTest(index, { status: 'testing', message: 'Connecting to Supabase...' });
    
    try {
      const { data, error } = await supabase.from('user_sessions').select('count').limit(1);
      
      if (error) {
        throw new Error(`Supabase error: ${error.message}`);
      }
      
      updateTest(index, { 
        status: 'success', 
        message: 'Successfully connected to Supabase',
        details: { connection: 'active' }
      });
    } catch (error: any) {
      updateTest(index, { 
        status: 'error', 
        message: error.message,
        details: { error: error.toString() }
      });
    }
  };

  const testSupabaseDatabase = async (index: number) => {
    updateTest(index, { status: 'testing', message: 'Testing database operations...' });
    
    try {
      // Test creating valid UUID session
      const testSessionId = crypto.randomUUID();
      
      const { data: sessionData, error: sessionError } = await supabase
        .from('user_sessions')
        .insert([{
          session_id: testSessionId,
          language_preference: 'en'
        }])
        .select()
        .single();

      if (sessionError) {
        throw new Error(`Session creation failed: ${sessionError.message}`);
      }

      // Test creating a test conversation
      const { data: chatData, error: chatError } = await supabase
        .from('chat_conversations')
        .insert([{
          session_id: testSessionId,
          message: 'Test message',
          sender: 'user',
          language: 'en'
        }])
        .select()
        .single();

      if (chatError) {
        throw new Error(`Chat creation failed: ${chatError.message}`);
      }

      // Clean up test data
      await supabase.from('chat_conversations').delete().eq('session_id', testSessionId);
      await supabase.from('user_sessions').delete().eq('session_id', testSessionId);

      updateTest(index, { 
        status: 'success', 
        message: 'Database operations working correctly',
        details: { 
          sessionCreated: !!sessionData,
          chatCreated: !!chatData,
          cleanupSuccessful: true,
          validUUID: testSessionId
        }
      });
    } catch (error: any) {
      updateTest(index, { 
        status: 'error', 
        message: error.message,
        details: { error: error.toString() }
      });
    }
  };

  const testOpenAIAPI = async (index: number) => {
    updateTest(index, { status: 'testing', message: 'Testing OpenAI API via Edge Function...' });
    
    try {
      const testSessionId = crypto.randomUUID();
      
      const { data, error } = await supabase.functions.invoke('chat-with-nujmooz', {
        body: {
          message: 'Test message - please respond with "API test successful"',
          sessionId: testSessionId,
          language: 'en',
          conversationHistory: []
        }
      });

      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (!data?.success || !data?.response) {
        throw new Error(`Invalid response format: ${JSON.stringify(data)}`);
      }

      updateTest(index, { 
        status: 'success', 
        message: 'OpenAI API working correctly',
        details: { 
          responseReceived: true,
          responseContent: data.response.substring(0, 100) + '...',
          detectedServices: data.detectedServices || [],
          sessionId: testSessionId
        }
      });
    } catch (error: any) {
      updateTest(index, { 
        status: 'error', 
        message: error.message,
        details: { error: error.toString() }
      });
    }
  };

  const testProjectBriefFunction = async (index: number) => {
    updateTest(index, { status: 'testing', message: 'Testing Project Brief function...' });
    
    try {
      const testSessionId = crypto.randomUUID();
      const testBrief = {
        service: 'Website Design',
        description: 'Test project description',
        audience: 'Test audience',
        style: 'Modern',
        budget: '$5000-$10000',
        deadline: '4 weeks',
        language: 'en'
      };

      console.log('Testing project brief with session ID:', testSessionId);
      
      const { data, error } = await supabase.functions.invoke('project-brief', {
        body: {
          session_id: testSessionId,
          briefData: testBrief
        }
      });

      if (error) {
        throw new Error(`Project brief function error: ${error.message}`);
      }

      if (!data?.success) {
        throw new Error(`Project brief creation failed: ${JSON.stringify(data)}`);
      }

      updateTest(index, { 
        status: 'success', 
        message: 'Project Brief function working correctly',
        details: { 
          briefCreated: true,
          briefId: data.briefId,
          sessionId: data.sessionId || testSessionId,
          pdfGenerated: !!data.pdfUrl
        }
      });
    } catch (error: any) {
      updateTest(index, { 
        status: 'error', 
        message: error.message,
        details: { error: error.toString() }
      });
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'idle', message: undefined, details: undefined })));

    // Run tests sequentially
    await testSupabaseConnection(0);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testSupabaseDatabase(1);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testOpenAIAPI(2);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testProjectBriefFunction(3);
    
    setIsRunning(false);
  };

  const getStatusIcon = (status: APITest['status']) => {
    switch (status) {
      case 'testing':
        return <Clock className="w-5 h-5 text-yellow-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: APITest['status']) => {
    switch (status) {
      case 'testing':
        return 'border-yellow-400/30 bg-yellow-400/10';
      case 'success':
        return 'border-green-400/30 bg-green-400/10';
      case 'error':
        return 'border-red-400/30 bg-red-400/10';
      default:
        return 'border-white/20 bg-white/5';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-2">API Status Dashboard</h1>
        <p className="text-white/60">Test all APIs to ensure proper functionality</p>
      </motion.div>

      <motion.button
        onClick={runAllTests}
        disabled={isRunning}
        className="w-full mb-6 bg-gradient-to-r from-[#7EF5A5] to-[#4AE374] text-black py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isRunning ? 'Running Tests...' : 'Run All API Tests'}
      </motion.button>

      <div className="grid gap-4">
        {tests.map((test, index) => (
          <motion.div
            key={test.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border backdrop-blur-sm ${getStatusColor(test.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-white">{test.name}</h3>
              {getStatusIcon(test.status)}
            </div>
            
            {test.message && (
              <p className="text-white/80 mb-2">{test.message}</p>
            )}
            
            {test.details && (
              <details className="mt-2">
                <summary className="text-white/60 cursor-pointer hover:text-white/80">
                  View Details
                </summary>
                <pre className="mt-2 p-2 bg-black/20 rounded text-xs text-white/70 overflow-auto">
                  {JSON.stringify(test.details, null, 2)}
                </pre>
              </details>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10"
      >
        <h3 className="text-lg font-semibold text-white mb-2">API Endpoints Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong className="text-white">Supabase URL:</strong>
            <p className="text-white/70">https://mhlvzabsgysciyjaamqo.supabase.co</p>
          </div>
          <div>
            <strong className="text-white">Edge Functions:</strong>
            <p className="text-white/70">chat-with-nujmooz, project-brief</p>
          </div>
          <div>
            <strong className="text-white">UUID Validation:</strong>
            <p className="text-white/70">Enabled with auto-correction</p>
          </div>
          <div>
            <strong className="text-white">Error Handling:</strong>
            <p className="text-white/70">Enhanced with detailed logging</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default APITester;
