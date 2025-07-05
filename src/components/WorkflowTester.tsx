
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, Info } from 'lucide-react';

const WorkflowTester = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<any[]>([]);

  const testProjectData = {
    service: "تصميم هوية بصرية",
    description: "أبغى أشتغل على هوية بصرية متكاملة لمتجر إلكتروني جديد يبيع منتجات طبيعية للعناية بالنفس، زي الزيوت، والصوابين البلدية، وكريمات نباتية، وشموع معطّرة. نفسي الهوية تعكس إحساس بالنقاء، والهدوء، والثقة بالجودة.",
    audience: "اللي أستهدفهم هم السيدات من عمر ٢٥ إلى ٤٥ سنة، اللي يهتموا بالمنتجات العضوية والنظيفة، ويحبوا التصاميم الراقية والتفاصيل الحلوة، وغالبًا يتسوّقوا أونلاين.",
    style: "أنثوي وناعم، مستوحى من الطبيعة، بألوان هادية زي البيج، والوردي الترابي، والأخضر الزيتوني، مع خط عربي أنيق وسهل للقراءة.",
    values: "النقاء، الراحة، الجمال البسيط، الثقة، والاستدامة",
    objectives: "أحتاج الهوية تكون مميزة عن السوق، وتكون مرنة لو توسّعنا لاحقًا في منتجات أو حتى منصات تعليمية.",
    visual_preferences: "أحب الستايل البوهيمي الفرنسي، والزخارف الناعمة، بس ما أبغى تعقيد. ويفضّل يكون الشعار رمزي أكثر من كونه مباشر.",
    inspirations: "أعجبني شغل ماركات زي L:A Bruket وHerbivore Botanicals وRoutine Natural Beauty",
    applications_needed: [
      "شعار رئيسي وثانوي",
      "أيقونات مخصصة للمنتجات",
      "ستايل تصوير المنتجات",
      "تصميم العبوات والليبلات",
      "هوية لحساب الإنستقرام",
      "ستايل غايد متكامل"
    ],
    budget: "الميزانية مرتفعة شوية لأن الجودة تهمني كثير",
    deadline: "أفضل نسلم خلال ١٤ يوم من اليوم",
    additional_notes: "يهمني يكون التواصل واضح وسلس خلال الشغل، وأفضل أشوف نماذج مبدئية قبل ما نثبت التوجه النهائي. برضو حابة أقترحات لأسماء ممكنة للبراند مع شرح بسيط لمعنى كل اسم.",
    language: "ar" as const
  };

  const handleTestWorkflow = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setDiagnostics([]);

    try {
      // Generate a test session ID
      const testSessionId = crypto.randomUUID();
      
      console.log('Starting workflow test with session:', testSessionId);

      const requestBody = {
        sessionId: testSessionId,
        projectData: testProjectData,
        conversationHistory: [
          "user: مرحبًا، هل تتكلم عربي؟",
          "nujmooz: أهلًا وسهلاً! طبعًا أتكلم عربي 👽✨",
          "user: أحتاج هوية بصرية لمتجر منتجات طبيعية للعناية",
          "nujmooz: رائع! متجر للعناية الطبيعية موضوع جميل جداً ✨ حابب أسمع أكثر عن رؤيتك"
        ],
        clientEmail: "client@example.com",
        clientName: "عميلة مشروع العناية الطبيعية",
        skipTrello: false
      };

      console.log('Request body:', requestBody);

      const { data, error: workflowError } = await supabase.functions.invoke('nujmooz-workflow', {
        body: requestBody
      });

      console.log('Raw response:', { data, error: workflowError });

      if (workflowError) {
        throw new Error(`Workflow Error: ${workflowError.message}`);
      }

      // Handle the response structure properly
      if (data?.success === false) {
        throw new Error(data.message || 'Workflow failed without specific error message');
      }

      console.log('Workflow completed successfully:', data);
      setResult(data);
      
      // Extract diagnostics if available
      if (data?.diagnostics) {
        setDiagnostics(data.diagnostics);
      }

    } catch (err) {
      console.error('Test error:', err);
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setError(errorMessage);
      
      // Try to extract more error details
      if (err.message?.includes('diagnostics')) {
        try {
          const diagnosticsMatch = err.message.match(/diagnostics:\s*(\[.*\])/);
          if (diagnosticsMatch) {
            const extractedDiagnostics = JSON.parse(diagnosticsMatch[1]);
            setDiagnostics(extractedDiagnostics);
          }
        } catch (parseError) {
          console.error('Failed to parse diagnostics:', parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            👽 اختبار مساعد نجموز - مشروع الهوية البصرية
          </CardTitle>
          <CardDescription>
            تجربة كاملة لنظام نجموز مع مشروع متجر العناية الطبيعية
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">بيانات مشروع الهوية البصرية:</h3>
              <Textarea
                value={JSON.stringify(testProjectData, null, 2)}
                readOnly
                className="font-mono text-sm h-64 text-right"
                dir="rtl"
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border-r-4 border-blue-400">
              <h4 className="font-semibold text-blue-800 mb-2">ملخص المشروع:</h4>
              <ul className="text-sm text-blue-700 space-y-1" dir="rtl">
                <li>• هوية بصرية لمتجر منتجات عناية طبيعية</li>
                <li>• الجمهور المستهدف: سيدات 25-45 سنة</li>
                <li>• الأسلوب: بوهيمي فرنسي ناعم بألوان طبيعية</li>
                <li>• التطبيقات: شعار، أيقونات، عبوات، إنستقرام، ستايل غايد</li>
                <li>• المدة: 14 يوم - ميزانية مرتفعة</li>
                <li>• متطلبات إضافية: اقتراحات أسماء للبراند</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleTestWorkflow}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جاري اختبار مشروع الهوية البصرية...
                </>
              ) : (
                '🚀 تشغيل اختبار نجموز - مشروع العناية الطبيعية'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Diagnostics Panel */}
      {diagnostics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Info className="h-5 w-5" />
              معلومات التشخيص
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-3 rounded text-xs max-h-60 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{JSON.stringify(diagnostics, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>خطأ في الاختبار:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              ✅ نتيجة اختبار مشروع الهوية البصرية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {result.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold">رقم الموجز:</h4>
                  <p className="text-sm font-mono bg-gray-100 p-2 rounded">{result.briefId}</p>
                </div>

                {result.suggestions && (
                  <div>
                    <h4 className="font-semibold">اقتراحات نجموز للهوية البصرية:</h4>
                    <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                      <pre className="whitespace-pre-wrap text-sm text-right" dir="rtl">{result.suggestions}</pre>
                    </div>
                  </div>
                )}

                {result.trelloCard && (
                  <div>
                    <h4 className="font-semibold">بطاقة Trello لمتابعة المشروع:</h4>
                    <div className="bg-purple-50 p-3 rounded">
                      <p><strong>الاسم:</strong> {result.trelloCard.name}</p>
                      <p><strong>الرابط:</strong> <a href={result.trelloCard.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{result.trelloCard.shortUrl}</a></p>
                    </div>
                  </div>
                )}

                {result.completedSteps && (
                  <div>
                    <h4 className="font-semibold">الخطوات المكتملة:</h4>
                    <div className="bg-gray-50 p-3 rounded">
                      <ul className="space-y-1 text-sm">
                        <li className={`flex items-center gap-2 ${result.completedSteps.analysis ? 'text-green-600' : 'text-gray-500'}`}>
                          {result.completedSteps.analysis ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          تحليل المشروع
                        </li>
                        <li className={`flex items-center gap-2 ${result.completedSteps.briefCreation ? 'text-green-600' : 'text-gray-500'}`}>
                          {result.completedSteps.briefCreation ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          إنشاء الموجز
                        </li>
                        <li className={`flex items-center gap-2 ${result.completedSteps.taskDistribution ? 'text-green-600' : 'text-gray-500'}`}>
                          {result.completedSteps.taskDistribution ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          توزيع المهام
                        </li>
                        <li className={`flex items-center gap-2 ${result.completedSteps.trelloIntegration ? 'text-green-600' : 'text-gray-500'}`}>
                          {result.completedSteps.trelloIntegration ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          تكامل Trello
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold">وقت الإنشاء:</h4>
                  <p className="text-sm">{result.timestamp}</p>
                </div>

                {result.metadata && (
                  <div>
                    <h4 className="font-semibold">معلومات إضافية:</h4>
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <p><strong>وقت التنفيذ:</strong> {result.metadata.executionTime}ms</p>
                      <p><strong>اللغة:</strong> {result.metadata.language}</p>
                      {result.metadata.clientName && <p><strong>اسم العميل:</strong> {result.metadata.clientName}</p>}
                    </div>
                  </div>
                )}

                <details className="mt-4">
                  <summary className="cursor-pointer font-semibold">عرض النتيجة الكاملة</summary>
                  <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkflowTester;
