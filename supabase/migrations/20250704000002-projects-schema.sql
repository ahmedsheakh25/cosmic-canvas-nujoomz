-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('planned', 'active', 'completed')),
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create team_members junction table
CREATE TABLE IF NOT EXISTS public.team_members (
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'editor', 'viewer')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  PRIMARY KEY (project_id, user_id)
);

-- Create RLS policies
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "Users can view projects they are members of" ON public.projects
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.team_members WHERE project_id = id
      UNION
      SELECT owner_id
    )
  );

CREATE POLICY "Project owners can update their projects" ON public.projects
  FOR UPDATE USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners can delete their projects" ON public.projects
  FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Authenticated users can create projects" ON public.projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Team members policies
CREATE POLICY "Project owners can manage team members" ON public.team_members
  FOR ALL USING (
    auth.uid() IN (
      SELECT owner_id FROM public.projects WHERE id = project_id
    )
  );

CREATE POLICY "Users can view team members of their projects" ON public.team_members
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.team_members WHERE project_id = project_id
      UNION
      SELECT owner_id FROM public.projects WHERE id = project_id
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER projects_handle_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- Create indexes
CREATE INDEX IF NOT EXISTS projects_owner_id_idx ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON public.projects(status);
CREATE INDEX IF NOT EXISTS team_members_user_id_idx ON public.team_members(user_id);
CREATE INDEX IF NOT EXISTS team_members_project_id_idx ON public.team_members(project_id); 