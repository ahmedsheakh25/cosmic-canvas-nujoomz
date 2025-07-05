
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, BookOpen, Terminal, Globe, Database, Mic, Activity } from 'lucide-react';

const KnowledgeBasePage: React.FC = () => {
  const functions = [
    {
      id: 'nujmooz-workflow',
      name: 'Nujmooz Workflow',
      nameAr: 'سير عمل نجموز',
      icon: <Globe className="w-5 h-5" />,
      description: 'Complete AI-powered project workflow with brief generation and Trello integration',
      descriptionAr: 'سير عمل متكامل بالذكاء الاصطناعي لإنشاء موجز المشروع والتكامل مع Trello',
      method: 'POST',
      url: '/functions/v1/nujmooz-workflow',
      headers: ['Authorization: Bearer <anon_key>', 'Content-Type: application/json'],
      envVars: ['OPENAI_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'TRELLO_API_KEY (optional)', 'TRELLO_TOKEN (optional)'],
      requestExample: {
        sessionId: 'uuid-string',
        projectData: {
          service: 'Web Development',
          description: 'E-commerce website for local business',
          audience: 'Small business owners',
          style: 'Modern and professional',
          budget: '$5000-10000',
          deadline: '3 months',
          language: 'en'
        },
        conversationHistory: ['Previous chat messages'],
        clientEmail: 'client@example.com',
        clientName: 'John Doe',
        skipTrello: false
      },
      successResponse: {
        success: true,
        workflowComplete: true,
        briefId: 'brief-uuid',
        suggestions: 'AI-generated project suggestions...',
        trelloCard: {
          id: 'card-id',
          name: 'Project Name',
          url: 'https://trello.com/c/card-url'
        },
        message: '🎉 Done! Your project brief has been created...',
        timestamp: '2024-01-01T00:00:00.000Z'
      },
      errorResponse: {
        success: false,
        error: 'Workflow execution failed: Missing required data',
        timestamp: '2024-01-01T00:00:00.000Z',
        executionTime: 1500
      },
      statusCodes: [200, 400, 401, 500]
    },
    {
      id: 'project-brief',
      name: 'Project Brief',
      nameAr: 'موجز المشروع',
      icon: <Database className="w-5 h-5" />,
      description: 'Store project briefs and create user sessions in the database',
      descriptionAr: 'حفظ موجز المشروع وإنشاء جلسات المستخدم في قاعدة البيانات',
      method: 'POST',
      url: '/functions/v1/project-brief',
      headers: ['Authorization: Bearer <anon_key>', 'Content-Type: application/json'],
      envVars: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
      requestExample: {
        session_id: 'uuid-string',
        briefData: {
          service: 'Brand Identity Design',
          answers: {
            businessType: 'Restaurant',
            targetAudience: 'Young professionals',
            preferredColors: 'Blue and white'
          },
          language: 'ar'
        }
      },
      successResponse: {
        success: true,
        briefId: 'brief-uuid',
        sessionId: 'session-uuid',
        status: 'created',
        briefData: {
          service: 'Brand Identity Design',
          created_at: '2024-01-01T00:00:00.000Z',
          processing_status: 'completed'
        }
      },
      errorResponse: {
        success: false,
        error: 'Missing briefData or service in request',
        timestamp: '2024-01-01T00:00:00.000Z',
        executionTime: 250
      },
      statusCodes: [200, 400, 500]
    },
    {
      id: 'suggest-services',
      name: 'Suggest Services',
      nameAr: 'اقتراح الخدمات',
      icon: <Globe className="w-5 h-5" />,
      description: 'AI-powered service suggestions based on conversation analysis',
      descriptionAr: 'اقتراحات الخدمات بالذكاء الاصطناعي بناءً على تحليل المحادثة',
      method: 'POST',
      url: '/functions/v1/suggest-services',
      headers: ['Authorization: Bearer <anon_key>', 'Content-Type: application/json'],
      envVars: ['OPENAI_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
      requestExample: {
        sessionId: 'uuid-string',
        conversationHistory: [
          'أريد تطوير موقع إلكتروني لمطعمي',
          'ما هي الخدمات التي تقدمونها؟'
        ],
        userContext: {
          language: 'ar',
          intent: 'business_inquiry'
        }
      },
      successResponse: {
        suggestions: [
          {
            id: 'suggestion-uuid',
            service_type: 'تطوير المواقع',
            suggestion_reason: 'يحتاج العميل لموقع إلكتروني احترافي',
            confidence_score: 0.9,
            status: 'pending'
          }
        ],
        sessionId: 'session-uuid',
        totalSuggestions: 1
      },
      errorResponse: {
        success: false,
        error: 'Session ID is required',
        timestamp: '2024-01-01T00:00:00.000Z',
        executionTime: 300
      },
      statusCodes: [200, 400, 500]
    },
    {
      id: 'distribute-tasks',
      name: 'Distribute Tasks',
      nameAr: 'توزيع المهام',
      icon: <Database className="w-5 h-5" />,
      description: 'AI-powered task distribution and assignment based on project briefs',
      descriptionAr: 'توزيع وتعيين المهام بالذكاء الاصطناعي بناءً على موجز المشروع',
      method: 'POST',
      url: '/functions/v1/distribute-tasks',
      headers: ['Authorization: Bearer <anon_key>', 'Content-Type: application/json'],
      envVars: ['OPENAI_API_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
      requestExample: {
        projectBriefId: 'brief-uuid',
        priority: 'high',
        assignTo: 'team-member-uuid'
      },
      successResponse: {
        success: true,
        tasks: [
          {
            id: 'task-uuid',
            title: 'تصميم واجهة المستخدم',
            description: 'إنشاء تصميم احترافي للموقع',
            service_type: 'UI/UX Design',
            assigned_to: 'designer-uuid',
            priority: 4,
            estimated_hours: 40,
            status: 'pending'
          }
        ],
        totalTasks: 5,
        projectBriefId: 'brief-uuid'
      },
      errorResponse: {
        success: false,
        error: 'Invalid project brief ID format',
        timestamp: '2024-01-01T00:00:00.000Z',
        executionTime: 800
      },
      statusCodes: [200, 400, 500]
    },
    {
      id: 'voice-to-text',
      name: 'Voice to Text',
      nameAr: 'الصوت إلى نص',
      icon: <Mic className="w-5 h-5" />,
      description: 'Convert audio recordings to text using OpenAI Whisper',
      descriptionAr: 'تحويل التسجيلات الصوتية إلى نص باستخدام OpenAI Whisper',
      method: 'POST',
      url: '/functions/v1/voice-to-text',
      headers: ['Authorization: Bearer <anon_key>', 'Content-Type: multipart/form-data OR application/json'],
      envVars: ['OPENAI_API_KEY'],
      requestExample: {
        file: 'base64-encoded-audio-data',
        language: 'ar'
      },
      successResponse: {
        success: true,
        data: {
          text: 'النص المحول من الصوت',
          language: 'ar',
          confidence: 0.95,
          duration: 15.2
        },
        timestamp: '2024-01-01T00:00:00.000Z',
        executionTime: 3500
      },
      errorResponse: {
        success: false,
        error: 'Audio file too large. Maximum size is 25MB',
        timestamp: '2024-01-01T00:00:00.000Z',
        executionTime: 100
      },
      statusCodes: [200, 400, 413, 500]
    },
    {
      id: 'health-check',
      name: 'Health Check',
      nameAr: 'فحص الحالة',
      icon: <Activity className="w-5 h-5" />,
      description: 'System health monitoring and service status validation',
      descriptionAr: 'مراقبة حالة النظام والتحقق من حالة الخدمات',
      method: 'GET',
      url: '/functions/v1/health-check',
      headers: ['Authorization: Bearer <anon_key>'],
      envVars: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'OPENAI_API_KEY', 'TRELLO_API_KEY (optional)', 'TRELLO_TOKEN (optional)'],
      requestExample: 'No body required for GET request',
      successResponse: {
        success: true,
        data: {
          status: 'healthy',
          timestamp: '2024-01-01T00:00:00.000Z',
          uptime: 12345,
          services: {
            database: {
              status: 'healthy',
              responseTime: 45,
              lastChecked: '2024-01-01T00:00:00.000Z'
            },
            openai: {
              status: 'healthy',
              responseTime: 120,
              lastChecked: '2024-01-01T00:00:00.000Z'
            }
          },
          environment: {
            region: 'us-east-1',
            version: '1.0.0',
            configuredSecrets: ['SUPABASE_URL', 'OPENAI_API_KEY']
          }
        }
      },
      errorResponse: {
        success: false,
        error: 'Health check failed: Database connection timeout',
        timestamp: '2024-01-01T00:00:00.000Z',
        executionTime: 5000
      },
      statusCodes: [200, 206, 503]
    }
  ];

  const generateCurlCommand = (func: any) => {
    const baseUrl = 'https://mhlvzabsgysciyjaamqo.supabase.co';
    const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1obHZ6YWJzZ3lzY2l5amFhbXFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyMTQ0NjQsImV4cCI6MjA2Njc5MDQ2NH0.8aCUZlbFoby8LzUoDwPRYRehNQjy6tY7TcQY6uUHXwk';
    
    if (func.method === 'GET') {
      return `curl -X GET "${baseUrl}${func.url}" \\
  -H "Authorization: Bearer ${anonKey}"`;
    }
    
    return `curl -X ${func.method} "${baseUrl}${func.url}" \\
  -H "Authorization: Bearer ${anonKey}" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(func.requestExample, null, 2)}'`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">
              📘 Knowledge Base
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-2">
            Comprehensive Technical Documentation
          </p>
          <p className="text-lg text-gray-400">
            وثائق تقنية شاملة لجميع Supabase Edge Functions
          </p>
        </div>

        {/* Functions Grid */}
        <div className="grid gap-8">
          {functions.map((func) => (
            <Card key={func.id} className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  {func.icon}
                  <CardTitle className="text-2xl text-white">
                    {func.name}
                  </CardTitle>
                  <Badge variant="outline" className="ml-auto">
                    {func.method}
                  </Badge>
                </div>
                <p className="text-gray-300">{func.description}</p>
                <p className="text-gray-400 text-sm">{func.descriptionAr}</p>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 mb-6">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="request">Request</TabsTrigger>
                    <TabsTrigger value="response">Response</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="env">Environment</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-white">Endpoint</h4>
                        <code className="block bg-black/50 p-3 rounded text-green-400 text-sm">
                          {func.method} {func.url}
                        </code>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-white">Status Codes</h4>
                        <div className="flex flex-wrap gap-2">
                          {func.statusCodes.map((code) => (
                            <Badge 
                              key={code} 
                              variant={code === 200 ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {code}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white">Required Headers</h4>
                      <div className="space-y-1">
                        {func.headers.map((header, index) => (
                          <code key={index} className="block bg-black/50 p-2 rounded text-blue-400 text-sm">
                            {header}
                          </code>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="request" className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white">Request Example</h4>
                      <pre className="bg-black/50 p-4 rounded overflow-x-auto text-sm">
                        <code className="text-green-400">
                          {typeof func.requestExample === 'string' 
                            ? func.requestExample 
                            : JSON.stringify(func.requestExample, null, 2)
                          }
                        </code>
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="response" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-green-400">✅ Success Response</h4>
                        <pre className="bg-black/50 p-4 rounded overflow-x-auto text-sm">
                          <code className="text-green-400">
                            {JSON.stringify(func.successResponse, null, 2)}
                          </code>
                        </pre>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-red-400">❌ Error Response</h4>
                        <pre className="bg-black/50 p-4 rounded overflow-x-auto text-sm">
                          <code className="text-red-400">
                            {JSON.stringify(func.errorResponse, null, 2)}
                          </code>
                        </pre>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="curl" className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white">cURL Command</h4>
                      <pre className="bg-black/50 p-4 rounded overflow-x-auto text-sm">
                        <code className="text-yellow-400">
                          {generateCurlCommand(func)}
                        </code>
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="env" className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-white">Environment Variables</h4>
                      <div className="space-y-2">
                        {func.envVars.map((envVar, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              {envVar}
                            </Badge>
                            {envVar.includes('optional') && (
                              <span className="text-gray-400 text-sm">(Optional)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-2">
              📝 Documentation Notes
            </h3>
            <p className="text-gray-300 mb-4">
              This documentation is automatically generated and maintained for the OfSpace Studio project.
            </p>
            <p className="text-gray-400 text-sm">
              For support or questions, contact the development team through the Admin panel.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBasePage;
