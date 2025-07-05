
-- Analytics Events Table
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature TEXT NOT NULL,
  action TEXT NOT NULL,
  user_id UUID,
  session_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Feature Toggles Table
CREATE TABLE public.feature_toggles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feature_name TEXT NOT NULL UNIQUE,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  category TEXT DEFAULT 'general',
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Personas Table
CREATE TABLE public.user_personas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  default_greeting TEXT,
  voice_settings JSONB DEFAULT '{}',
  ui_theme JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Activity History Table
CREATE TABLE public.user_activity_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id UUID,
  activity_type TEXT NOT NULL,
  activity_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admin Tour Completion Table
CREATE TABLE public.admin_tour_completion (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tour_type TEXT NOT NULL DEFAULT 'admin_onboarding',
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, tour_type)
);

-- Add persona reference to users table
ALTER TABLE public.users ADD COLUMN persona_id UUID REFERENCES public.user_personas(id);

-- Enable Row Level Security
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_toggles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_tour_completion ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated admin users
CREATE POLICY "Admin access to analytics events" ON public.analytics_events FOR ALL USING (true);
CREATE POLICY "Admin access to feature toggles" ON public.feature_toggles FOR ALL USING (true);
CREATE POLICY "Admin access to user personas" ON public.user_personas FOR ALL USING (true);
CREATE POLICY "Admin access to user activity history" ON public.user_activity_history FOR ALL USING (true);
CREATE POLICY "Admin access to tour completion" ON public.admin_tour_completion FOR ALL USING (true);

-- Insert default feature toggles
INSERT INTO public.feature_toggles (feature_name, description, category) VALUES
('voice_commands', 'Enable voice command functionality', 'interaction'),
('service_suggestions', 'Show AI-powered service suggestions', 'ai'),
('sentiment_analysis', 'Analyze user sentiment in conversations', 'ai'),
('file_generation', 'Enable file generation capabilities', 'workflow'),
('real_time_sync', 'Real-time synchronization features', 'system'),
('advanced_analytics', 'Advanced analytics and reporting', 'analytics');

-- Insert default personas
INSERT INTO public.user_personas (name, description, default_greeting, voice_settings, ui_theme) VALUES
('Entrepreneur', 'Business-focused users looking for professional services', 'مرحباً! أنا نجموز 👽 مساعدك الذكي لتطوير مشروعك. كيف يمكنني مساعدتك اليوم؟', '{"voice_id": "nova", "language": "ar"}', '{"primary": "#3B82F6", "accent": "#1E40AF"}'),
('Creative', 'Artists and designers seeking creative solutions', 'أهلاً وسهلاً! 🎨 أنا نجموز، رفيقك الإبداعي في رحلة التصميم. شو الفكرة الإبداعية اللي في بالك؟', '{"voice_id": "alloy", "language": "ar"}', '{"primary": "#8B5CF6", "accent": "#7C3AED"}'),
('Urgent', 'Users with time-sensitive projects', 'السلام عليكم! ⚡ أنا نجموز وأعرف إنك مستعجل. يلا نشتغل بسرعة على مشروعك!', '{"voice_id": "echo", "language": "ar"}', '{"primary": "#EF4444", "accent": "#DC2626"}');
