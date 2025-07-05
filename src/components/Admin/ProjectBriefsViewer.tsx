
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, User, Search, Eye, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ProjectBrief {
  id: string;
  brief_data: any;
  client_info: any;
  status: string | null;
  language: string | null;
  pdf_url: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

const ProjectBriefsViewer: React.FC = () => {
  const [briefs, setBriefs] = useState<ProjectBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrief, setSelectedBrief] = useState<ProjectBrief | null>(null);

  useEffect(() => {
    fetchBriefs();
  }, []);

  const fetchBriefs = async () => {
    try {
      const { data, error } = await supabase
        .from('project_briefs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBriefs(data || []);
    } catch (error) {
      console.error('Error fetching project briefs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBriefs = briefs.filter(brief => {
    const searchFields = [
      brief.brief_data?.service || '',
      brief.brief_data?.description || '',
      brief.client_info?.name || '',
      brief.session_id || ''
    ].join(' ').toLowerCase();
    
    return searchFields.includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'completed': return 'مكتمل';
      case 'in_progress': return 'قيد التنفيذ';
      case 'pending': return 'في الانتظار';
      default: return 'جديد';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading project briefs...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            موجزات المشاريع
          </CardTitle>
          <CardDescription>
            متابعة وإدارة موجزات المشاريع المنشأة من قبل العملاء
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <Input
                placeholder="البحث في الموجزات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="text-sm text-gray-600">
              إجمالي الموجزات: {filteredBriefs.length}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredBriefs.map((brief) => (
          <Card key={brief.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">
                    {brief.brief_data?.service || 'خدمة غير محددة'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(brief.status)}>
                    {getStatusText(brief.status)}
                  </Badge>
                  {brief.language && (
                    <Badge variant="outline">
                      {brief.language === 'ar' ? 'عربي' : 'English'}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {new Date(brief.created_at).toLocaleDateString('ar')}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600" dir="auto">
                  {brief.brief_data?.description || 'لا يوجد وصف متاح'}
                </p>
                
                {brief.client_info?.name && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">العميل: {brief.client_info.name}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        عرض التفاصيل
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>تفاصيل الموجز</DialogTitle>
                        <DialogDescription>
                          معلومات تفصيلية عن المشروع
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">بيانات المشروع:</h4>
                          <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                            {JSON.stringify(brief.brief_data, null, 2)}
                          </pre>
                        </div>
                        {brief.client_info && (
                          <div>
                            <h4 className="font-semibold mb-2">معلومات العميل:</h4>
                            <pre className="bg-gray-50 p-3 rounded text-sm overflow-x-auto">
                              {JSON.stringify(brief.client_info, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {brief.pdf_url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={brief.pdf_url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        تحميل PDF
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBriefs.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد موجزات مشاريع متاحة</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectBriefsViewer;
