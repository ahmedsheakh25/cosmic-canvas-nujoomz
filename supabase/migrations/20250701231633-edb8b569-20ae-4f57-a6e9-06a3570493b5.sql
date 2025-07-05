
-- Create service_suggestions table for the suggest-services function
CREATE TABLE IF NOT EXISTS public.service_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.user_sessions(session_id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  description TEXT,
  reasoning TEXT,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on service_suggestions table
ALTER TABLE public.service_suggestions ENABLE ROW LEVEL SECURITY;

-- Create policy for service_suggestions
CREATE POLICY "Users can view their own service suggestions"
ON public.service_suggestions
FOR SELECT
USING (session_id IN (
  SELECT session_id FROM public.user_sessions
));

-- Update project_briefs table to add missing columns
ALTER TABLE public.project_briefs 
ADD COLUMN IF NOT EXISTS session_id UUID,
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS client_info JSONB DEFAULT '{}'::jsonb;

-- Add foreign key constraint to session_id
ALTER TABLE public.project_briefs
DROP CONSTRAINT IF EXISTS project_briefs_session_id_fkey;
ALTER TABLE public.project_briefs
ADD CONSTRAINT project_briefs_session_id_fkey
FOREIGN KEY (session_id) REFERENCES public.user_sessions(session_id) ON DELETE CASCADE;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_suggestions TO authenticated;
GRANT ALL ON public.service_suggestions TO service_role;
