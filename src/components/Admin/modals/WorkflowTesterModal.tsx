
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  TestTube, 
  Play, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  MessageSquare,
  FileText,
  Zap,
  ArrowRight,
  User,
  Bot
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface WorkflowTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  response?: any;
  duration?: number;
}

interface TestMessage {
  id: string;
  type: 'user' | 'nujmooz';
  content: string;
  timestamp: Date;
  metadata?: any;
}

const WorkflowTesterModal: React.FC<WorkflowTesterModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('أريد تطوير موقع إلكتروني لشركتي');
  const [sessionId] = useState(`workflow-test-${Date.now()}`);
  const [messages, setMessages] = useState<TestMessage[]>([]);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    {
      id: 'init',
      name: 'Initialize Session',
      description: 'Create new conversation session',
      status: 'pending'
    },
    {
      id: 'chat',
      name: 'Enhanced Chat',
      description: 'Process user input with Nujmooz',
      status: 'pending'
    },
    {
      id: 'analysis',
      name: 'Intent Analysis',
      description: 'Analyze user intent and requirements',
      status: 'pending'
    },
    {
      id: 'suggestions',
      name: 'Service Suggestions',
      description: 'Generate relevant service suggestions',
      status: 'pending'
    },
    {
      id: 'brief',
      name: 'Brief Generation',
      description: 'Create project brief if applicable',
      status: 'pending'
    },
    {
      id: 'sentiment',
      name: 'Sentiment Analysis',
      description: 'Analyze conversation sentiment',
      status: 'pending'
    }
  ]);

  const addMessage = (type: 'user' | 'nujmooz', content: string, metadata?: any) => {
    const message: TestMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      type,
      content,
      timestamp: new Date(),
      metadata
    };
    setMessages(prev => [...prev, message]);
  };

  const updateStepStatus = (stepId: string, status: WorkflowStep['status'], response?: any, duration?: number) => {
    setWorkflowSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, response, duration }
        : step
    ));
  };

  const runStep = async (step: WorkflowStep, index: number): Promise<boolean> => {
    setCurrentStep(index);
    updateStepStatus(step.id, 'running');
    
    const startTime = Date.now();
    
    try {
      let result: any;
      
      switch (step.id) {
        case 'init':
          addMessage('user', userInput);
          result = { sessionId, initialized: true };
          await new Promise(resolve => setTimeout(resolve, 500));
          break;

        case 'chat':
          const chatResponse = await supabase.functions.invoke('enhanced-nujmooz-chat', {
            body: {
              message: userInput,
              language: 'ar',
              persona: 'أنا نجموز 👽، مساعدك الذكي في OfSpace Studio',
              context: 'New conversation',
              sessionId
            }
          });
          
          if (chatResponse.error) throw new Error(chatResponse.error.message);
          result = chatResponse.data;
          addMessage('nujmooz', result.response || 'تم معالجة الرسالة بنجاح');
          break;

        case 'analysis':
          // Simulate intent analysis
          result = {
            intent: 'website_development',
            confidence: 0.92,
            entities: ['شركة', 'موقع إلكتروني'],
            category: 'business_website'
          };
          await new Promise(resolve => setTimeout(resolve, 800));
          break;

        case 'suggestions':
          const suggestionsResponse = await supabase.functions.invoke('suggest-services', {
            body: {
              sessionId,
              conversationHistory: [userInput],
              userContext: { language: 'ar', intent: 'website_development' }
            }
          });
          
          result = suggestionsResponse.data || { suggestions: [] };
          break;

        case 'brief':
          if (result?.intent === 'website_development' || step.id === 'brief') {
            const briefResponse = await supabase.functions.invoke('project-brief', {
              body: {
                service: 'تطوير المواقع الإلكترونية',
                answers: {
                  company_type: 'شركة تجارية',
                  website_purpose: 'عرض الخدمات والمنتجات',
                  target_audience: 'العملاء المحتملين'
                },
                sessionId
              }
            });
            
            result = briefResponse.data || { status: 'brief_initiated' };
          } else {
            result = { status: 'not_applicable' };
          }
          break;

        case 'sentiment':
          const sentimentResponse = await supabase.functions.invoke('analyze-sentiment', {
            body: {
              text: userInput,
              sessionId
            }
          });
          
          result = sentimentResponse.data || { sentiment: 'neutral', score: 0.5 };
          break;

        default:
          result = { message: 'Step completed' };
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      updateStepStatus(step.id, 'completed', result, duration);
      return true;
      
    } catch (error: any) {
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.error(`Step ${step.id} failed:`, error);
      updateStepStatus(step.id, 'error', { error: error.message }, duration);
      return false;
    }
  };

  const runWorkflow = async () => {
    if (!userInput.trim()) {
      toast.error('يرجى إدخال نص للاختبار');
      return;
    }

    setIsRunning(true);
    setMessages([]);
    
    // Reset all steps
    setWorkflowSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const })));
    
    toast.info('بدء اختبار سير العمل...');
    
    for (let i = 0; i < workflowSteps.length; i++) {
      const step = workflowSteps[i];
      const success = await runStep(step, i);
      
      if (!success) {
        toast.error(`فشل في الخطوة: ${step.name}`);
        break;
      }
    }
    
    setIsRunning(false);
    setCurrentStep(-1);
    toast.success('تم إكمال اختبار سير العمل');
  };

  const resetWorkflow = () => {
    setWorkflowSteps(prev => prev.map(step => ({ ...step, status: 'pending' as const, response: undefined, duration: undefined })));
    setMessages([]);
    setCurrentStep(-1);
  };

  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'running': return <Clock className="w-4 h-4 animate-spin" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getProgressValue = () => {
    const completedSteps = workflowSteps.filter(step => step.status === 'completed').length;
    return (completedSteps / workflowSteps.length) * 100;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="cosmic-modal max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="cosmic-modal-content">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <TestTube className="w-6 h-6 text-purple-400" />
              Nujmooz Workflow Tester
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Control Panel */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    Test Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">User Input (Arabic)</label>
                    <Textarea
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="أدخل رسالة المستخدم للاختبار..."
                      className="h-20 text-right"
                      dir="rtl"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Session ID</label>
                    <Input value={sessionId} readOnly className="font-mono text-sm" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={runWorkflow}
                      disabled={isRunning || !userInput.trim()}
                      className="flex-1 cosmic-button text-white border-none"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isRunning ? 'Running...' : 'Start Test'}
                    </Button>
                    
                    <Button 
                      onClick={resetWorkflow}
                      disabled={isRunning}
                      variant="outline"
                      className="text-white border-white/20 hover:bg-white/10"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Workflow Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={getProgressValue()} className="mb-2" />
                  <p className="text-xs text-gray-600">
                    {workflowSteps.filter(s => s.status === 'completed').length} of {workflowSteps.length} steps completed
                  </p>
                </CardContent>
              </Card>

              {/* Conversation */}
              {messages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Conversation Flow
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            message.type === 'user' 
                              ? 'bg-purple-100 text-purple-900' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              {message.type === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                              <span className="text-xs font-medium">
                                {message.type === 'user' ? 'User' : 'Nujmooz'}
                              </span>
                            </div>
                            <p className="text-sm" dir={message.type === 'user' ? 'rtl' : 'ltr'}>
                              {message.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Workflow Steps */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Workflow Steps</h3>
              
              <div className="space-y-3">
                {workflowSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`transition-all ${
                      currentStep === index ? 'ring-2 ring-purple-400 bg-purple-50' : ''
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          {getStepIcon(step.status)}
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{step.name}</h4>
                            <p className="text-xs text-gray-600">{step.description}</p>
                            {step.duration && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                {step.duration}ms
                              </Badge>
                            )}
                          </div>
                          {index < workflowSteps.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        
                        {step.response && step.status === 'completed' && (
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 p-2 bg-gray-50 rounded text-xs overflow-auto"
                            >
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(step.response, null, 2)}
                              </pre>
                            </motion.div>
                          </AnimatePresence>
                        )}
                        
                        {step.status === 'error' && step.response && (
                          <div className="mt-3 p-2 bg-red-50 rounded">
                            <p className="text-xs text-red-600">
                              Error: {step.response.error}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowTesterModal;
