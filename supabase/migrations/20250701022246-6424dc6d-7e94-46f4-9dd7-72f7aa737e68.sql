
-- إنشاء جدول المهام للتوزيع التلقائي
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_brief_id UUID REFERENCES public.project_briefs(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done')),
  assigned_to UUID REFERENCES public.team_members(id),
  priority INTEGER DEFAULT 1,
  estimated_hours INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إضافة عمود تحليل المشاعر لجدول الجلسات
ALTER TABLE public.user_sessions 
ADD COLUMN IF NOT EXISTS user_sentiment TEXT DEFAULT 'neutral',
ADD COLUMN IF NOT EXISTS sentiment_score DECIMAL(3,2) DEFAULT 0.5,
ADD COLUMN IF NOT EXISTS last_sentiment_update TIMESTAMP WITH TIME ZONE DEFAULT now();

-- إنشاء جدول الخدمات المقترحة
CREATE TABLE IF NOT EXISTS public.suggested_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.user_sessions(session_id) ON DELETE CASCADE,
  project_brief_id UUID REFERENCES public.project_briefs(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  suggestion_reason TEXT,
  confidence_score DECIMAL(3,2) DEFAULT 0.0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول الأوامر الصوتية
CREATE TABLE IF NOT EXISTS public.voice_commands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.user_sessions(session_id) ON DELETE CASCADE,
  command_text TEXT NOT NULL,
  command_type TEXT NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  execution_result JSONB
);

-- إنشاء جدول إعدادات الأصوات
CREATE TABLE IF NOT EXISTS public.voice_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES public.user_sessions(session_id) ON DELETE CASCADE,
  service_type TEXT,
  voice_provider TEXT DEFAULT 'openai',
  voice_id TEXT DEFAULT 'alloy',
  language TEXT DEFAULT 'ar',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول التقارير
CREATE TABLE IF NOT EXISTS public.project_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_brief_id UUID REFERENCES public.project_briefs(id) ON DELETE CASCADE,
  report_type TEXT DEFAULT 'completion',
  pdf_url TEXT,
  thumbnail_url TEXT,
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول النماذج
CREATE TABLE IF NOT EXISTS public.project_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  template_data JSONB,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_tasks_project_brief_id ON public.tasks(project_brief_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_suggested_services_session_id ON public.suggested_services(session_id);
CREATE INDEX IF NOT EXISTS idx_voice_commands_session_id ON public.voice_commands(session_id);
CREATE INDEX IF NOT EXISTS idx_project_templates_service_type ON public.project_templates(service_type);

-- تفعيل RLS لجميع الجداول الجديدة
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggested_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_templates ENABLE ROW LEVEL SECURITY;

-- إنشاء سياسات RLS للمهام
CREATE POLICY "Users can view their own tasks" 
  ON public.tasks FOR SELECT 
  USING (project_brief_id IN (SELECT id FROM public.project_briefs WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert their own tasks" 
  ON public.tasks FOR INSERT 
  WITH CHECK (project_brief_id IN (SELECT id FROM public.project_briefs WHERE user_id = auth.uid()));

-- إنشاء سياسات RLS للخدمات المقترحة
CREATE POLICY "Users can view their own suggested services" 
  ON public.suggested_services FOR SELECT 
  USING (session_id IN (SELECT session_id FROM public.user_sessions WHERE id = auth.uid()));

-- إنشاء سياسات RLS للأوامر الصوتية
CREATE POLICY "Users can view their own voice commands" 
  ON public.voice_commands FOR SELECT 
  USING (session_id IN (SELECT session_id FROM public.user_sessions WHERE id = auth.uid()));

-- إنشاء سياسات RLS لإعدادات الأصوات
CREATE POLICY "Users can manage their own voice settings" 
  ON public.voice_settings FOR ALL 
  USING (session_id IN (SELECT session_id FROM public.user_sessions WHERE id = auth.uid()));

-- إنشاء سياسات RLS للتقارير
CREATE POLICY "Users can view their own reports" 
  ON public.project_reports FOR SELECT 
  USING (project_brief_id IN (SELECT id FROM public.project_briefs WHERE user_id = auth.uid()));

-- النماذج متاحة للجميع للعرض
CREATE POLICY "Templates are viewable by everyone" 
  ON public.project_templates FOR SELECT 
  USING (true);
