-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'editor', 'viewer');
CREATE TYPE project_status AS ENUM ('planned', 'active', 'completed');

-- Create users profile table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (user_id, role)
);

-- Create team invites table
CREATE TABLE IF NOT EXISTS public.team_invites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT NOT NULL,
    role user_role NOT NULL,
    token TEXT NOT NULL UNIQUE,
    invited_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create system logs table
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    old_value JSONB DEFAULT NULL,
    new_value JSONB DEFAULT NULL
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    status project_status DEFAULT 'planned',
    deadline TIMESTAMP WITH TIME ZONE,
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    client_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    linked_conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE SET NULL,
    team_members UUID[] DEFAULT ARRAY[]::UUID[],
    attachments JSONB DEFAULT '[]'::jsonb,
    trello_card_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_modified_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL
);

-- Create report schedules table
CREATE TABLE IF NOT EXISTS public.report_schedules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    report_type TEXT NOT NULL,
    frequency TEXT NOT NULL, -- daily, weekly, monthly
    recipients TEXT[] NOT NULL,
    format TEXT NOT NULL, -- pdf, csv, excel
    delivery_method TEXT NOT NULL, -- email, slack
    is_active BOOLEAN DEFAULT true,
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    configuration JSONB DEFAULT '{}'::jsonb
);

-- Create indexes
CREATE INDEX idx_user_profiles_language ON public.user_profiles(language);
CREATE INDEX idx_team_invites_email ON public.team_invites(email);
CREATE INDEX idx_team_invites_token ON public.team_invites(token);
CREATE INDEX idx_system_logs_timestamp ON public.system_logs(timestamp);
CREATE INDEX idx_system_logs_user_id ON public.system_logs(user_id);
CREATE INDEX idx_system_logs_entity ON public.system_logs(entity);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_deadline ON public.projects(deadline);
CREATE INDEX idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX idx_settings_category ON public.settings(category);
CREATE INDEX idx_report_schedules_next_run ON public.report_schedules(next_run_at) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_schedules ENABLE ROW LEVEL SECURITY;

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_schedules_updated_at
    BEFORE UPDATE ON public.report_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings
INSERT INTO public.settings (key, value, description, category, is_public) VALUES
('organization', '{"name":"OfSpace Studio","logo_url":"","default_language":"en"}', 'Organization settings', 'core', true),
('feature_flags', '{"enableVoice":true,"enableAnalytics":true,"enableColorGen":true}', 'Feature flags', 'features', false),
('notifications', '{"email":{"enabled":true},"slack":{"enabled":false,"webhook_url":""}}', 'Notification settings', 'notifications', false)
ON CONFLICT (key) DO NOTHING; 