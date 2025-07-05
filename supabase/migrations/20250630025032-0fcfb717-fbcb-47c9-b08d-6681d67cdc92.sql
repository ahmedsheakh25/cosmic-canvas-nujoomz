
-- First, let's add the status column to project_briefs table
ALTER TABLE public.project_briefs 
ADD COLUMN status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Under Review', 'Need Clarification', 'Completed', 'Client Contacted'));

-- Create brief_notes table for internal team notes
CREATE TABLE public.brief_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_brief_id UUID NOT NULL REFERENCES public.project_briefs(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for brief_notes
ALTER TABLE public.brief_notes ENABLE ROW LEVEL SECURITY;

-- Create policy for brief_notes (allow all operations for now since it's internal admin tool)
CREATE POLICY "Allow full access to brief_notes" ON public.brief_notes FOR ALL USING (true);

-- Create admin_activity_log table for tracking admin actions
CREATE TABLE public.admin_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  project_brief_id UUID REFERENCES public.project_briefs(id) ON DELETE CASCADE,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for admin_activity_log
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Create policy for admin_activity_log
CREATE POLICY "Allow full access to admin_activity_log" ON public.admin_activity_log FOR ALL USING (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_project_briefs_status ON public.project_briefs(status);
CREATE INDEX IF NOT EXISTS idx_project_briefs_created_at ON public.project_briefs(created_at);
CREATE INDEX IF NOT EXISTS idx_brief_notes_project_brief_id ON public.brief_notes(project_brief_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON public.admin_activity_log(created_at);
