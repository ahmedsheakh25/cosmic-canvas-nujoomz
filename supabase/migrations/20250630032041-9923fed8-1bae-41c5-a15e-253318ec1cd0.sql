
-- Add internal_notes column to project_briefs table
ALTER TABLE public.project_briefs 
ADD COLUMN IF NOT EXISTS internal_notes TEXT;

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add assigned_to column to project_briefs table
ALTER TABLE public.project_briefs 
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.team_members(id);

-- Create activity_logs table (separate from admin_activity_log for more detailed tracking)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brief_id UUID NOT NULL REFERENCES public.project_briefs(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  performed_by UUID,
  timestamp TIMESTAMPTZ DEFAULT now(),
  details JSONB
);

-- Enable RLS on new tables
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for team_members
CREATE POLICY "Admins can view team members"
ON public.team_members
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage team members"
ON public.team_members
FOR ALL
TO authenticated
USING (true);

-- RLS policies for activity_logs
CREATE POLICY "Admins can view activity logs"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can insert activity logs"
ON public.activity_logs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Insert some sample team members
INSERT INTO public.team_members (name, role) VALUES
('Ahmed Al-Rashid', 'Senior Designer'),
('Fatima Hassan', 'UI/UX Designer'),
('Omar Khalil', 'Brand Designer'),
('Noor Al-Zahra', 'Creative Director')
ON CONFLICT DO NOTHING;
