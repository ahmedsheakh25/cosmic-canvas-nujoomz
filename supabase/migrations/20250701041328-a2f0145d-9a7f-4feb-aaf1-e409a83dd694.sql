
-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create knowledge base table
CREATE TABLE public.knowledge_base (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'general',
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on knowledge_base
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- RLS policies for knowledge_base
CREATE POLICY "Admins can manage knowledge base"
ON public.knowledge_base
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'moderator'));

CREATE POLICY "Published articles are readable by all authenticated users"
ON public.knowledge_base
FOR SELECT
TO authenticated
USING (is_published = true);

-- Update existing feature_toggles table to include role-based access
ALTER TABLE public.feature_toggles ADD COLUMN IF NOT EXISTS required_role app_role DEFAULT 'user';
ALTER TABLE public.feature_toggles ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Enable RLS on feature_toggles if not already enabled
ALTER TABLE public.feature_toggles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage feature toggles" ON public.feature_toggles;
DROP POLICY IF EXISTS "Users can view enabled features" ON public.feature_toggles;

-- RLS policies for feature_toggles
CREATE POLICY "Admins can manage feature toggles"
ON public.feature_toggles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view features they have access to"
ON public.feature_toggles
FOR SELECT
TO authenticated
USING (
    is_enabled = true AND 
    (required_role = 'user' OR public.has_role(auth.uid(), required_role))
);

-- Insert some default feature toggles
INSERT INTO public.feature_toggles (feature_name, description, category, is_enabled, required_role) VALUES
('chat_interface', 'Enable chat interface for users', 'interaction', true, 'user'),
('voice_input', 'Enable voice input functionality', 'interaction', true, 'user'),
('admin_dashboard', 'Access to admin dashboard', 'system', true, 'admin'),
('project_brief_generation', 'Generate project briefs', 'ai', true, 'user'),
('analytics_dashboard', 'View analytics dashboard', 'analytics', true, 'moderator'),
('team_management', 'Manage team members', 'system', true, 'admin')
ON CONFLICT (feature_name) DO NOTHING;

-- Insert some sample knowledge base articles
INSERT INTO public.knowledge_base (title, content, category, tags, is_published) VALUES
('Getting Started with Nujmooz', 'Welcome to Nujmooz! This guide will help you get started with our AI assistant...', 'getting-started', ARRAY['basics', 'introduction'], true),
('How to Create Project Briefs', 'Learn how to effectively communicate your project requirements to get the best results...', 'tutorials', ARRAY['projects', 'briefs'], true),
('Voice Commands Guide', 'Nujmooz supports various voice commands to make your interaction more natural...', 'features', ARRAY['voice', 'commands'], true),
('Troubleshooting Common Issues', 'Solutions to frequently encountered problems and how to resolve them...', 'support', ARRAY['help', 'troubleshooting'], true)
ON CONFLICT DO NOTHING;
