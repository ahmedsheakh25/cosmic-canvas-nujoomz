import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Download, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Model {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

interface ModelService {
  modelId: string;
  service: string;
}

const Models = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [modelServices, setModelServices] = useState<ModelService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const services = [
    { value: 'visual-identity', label: 'تصميم هوية بصرية' },
    { value: 'web-design', label: 'تصميم موقع وتطبيق' },
    { value: 'marketing-content', label: 'إعداد محتوى تسويقي' },
    { value: 'project-naming', label: 'اختيار اسم مشروع' },
    { value: 'brand-strategy', label: 'إنشاء استراتيجية براند' },
  ];

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching models from Supabase Edge Function...');
      
      const { data, error: supabaseError } = await supabase.functions.invoke('get-openai-models');
      
      if (supabaseError) {
        console.error('Supabase function error:', supabaseError);
        throw new Error(`Supabase function error: ${supabaseError.message}`);
      }
      
      console.log('Edge function response:', data);
      setModels(data?.models || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching models:', err);
      toast.error('فشل في تحميل النماذج');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('تم نسخ معرف النموذج إلى الحافظة');
    } catch (err) {
      toast.error('فشل في نسخ النص');
    }
  };

  const handleServiceChange = (modelId: string, service: string) => {
    setModelServices(prev => {
      const filtered = prev.filter(ms => ms.modelId !== modelId);
      return [...filtered, { modelId, service }];
    });
    toast.success('تم ربط النموذج بالخدمة بنجاح');
  };

  const getServiceLabel = (value: string) => {
    const service = services.find(s => s.value === value);
    return service ? service.label : value;
  };

  const getLinkedService = (modelId: string) => {
    return modelServices.find(ms => ms.modelId === modelId);
  };

  const downloadResults = () => {
    const results = {
      models: models.map(model => ({
        id: model.id,
        linkedService: getLinkedService(model.id)?.service || null,
        serviceName: getLinkedService(model.id) ? getServiceLabel(getLinkedService(model.id)!.service) : null,
      })),
      timestamp: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `nujmooz-models-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('تم تحميل النتائج بصيغة JSON');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7EF5A5] mx-auto"></div>
            <p className="mt-4">جاري تحميل النماذج...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-red-900/20 border-red-500/30">
            <CardContent className="p-6">
              <p className="text-red-400 text-center">خطأ في تحميل النماذج: {error}</p>
              <Button 
                onClick={fetchModels}
                className="mt-4 mx-auto block bg-[#7EF5A5] text-black hover:bg-[#6BE395]"
              >
                إعادة المحاولة
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            معرفات النماذج المدربة 
            <span className="text-[#7EF5A5]">👽</span>
          </h1>
          <p className="text-gray-300 mb-6">
            إدارة وربط النماذج المدربة بالخدمات المختلفة
          </p>
          
          <div className="flex justify-center gap-4 mb-6">
            <Button
              onClick={downloadResults}
              className="bg-[#7EF5A5] text-black hover:bg-[#6BE395] flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              تحميل النتائج (JSON)
            </Button>
            <Button
              onClick={fetchModels}
              variant="outline"
              className="border-[#7EF5A5]/30 text-[#7EF5A5] hover:bg-[#7EF5A5]/10"
            >
              تحديث القائمة
            </Button>
          </div>
        </div>

        {/* Models List */}
        {models.length === 0 ? (
          <Card className="bg-black/40 border-[#7EF5A5]/20">
            <CardContent className="p-8 text-center">
              <p className="text-gray-300">لا توجد نماذج مدربة متاحة حالياً</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {models.map((model) => {
              const linkedService = getLinkedService(model.id);
              
              return (
                <Card key={model.id} className="bg-black/40 border-[#7EF5A5]/20 hover:border-[#7EF5A5]/40 transition-all">
                  <CardHeader>
                    <CardTitle className="text-[#7EF5A5] text-lg">
                      النموذج المدرب
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Model ID */}
                    <div className="flex items-center gap-3">
                      <code className="flex-1 bg-gray-900 p-3 rounded-lg border border-gray-700 text-[#7EF5A5] font-mono text-sm">
                        {model.id}
                      </code>
                      <Button
                        onClick={() => copyToClipboard(model.id)}
                        size="sm"
                        variant="outline"
                        className="border-[#7EF5A5]/30 text-[#7EF5A5] hover:bg-[#7EF5A5]/10"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Service Selection */}
                    <div className="space-y-3">
                      <label className="text-white font-medium block">
                        ربط بالخدمة:
                      </label>
                      <Select onValueChange={(value) => handleServiceChange(model.id, value)}>
                        <SelectTrigger className="bg-gray-900 border-gray-700 text-white">
                          <SelectValue placeholder="اختر خدمة للربط..." />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          {services.map((service) => (
                            <SelectItem 
                              key={service.value} 
                              value={service.value}
                              className="text-white hover:bg-gray-800"
                            >
                              {service.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Linked Service Status */}
                    {linkedService && (
                      <div className="flex items-center gap-2 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-medium">
                          مرتبط بـ: {getServiceLabel(linkedService.service)}
                        </span>
                      </div>
                    )}

                    {/* Model Info */}
                    <div className="text-sm text-gray-400 pt-2 border-t border-gray-700">
                      <p>المالك: {model.owned_by}</p>
                      <p>تاريخ الإنشاء: {new Date(model.created * 1000).toLocaleDateString('ar-SA')}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Models;
