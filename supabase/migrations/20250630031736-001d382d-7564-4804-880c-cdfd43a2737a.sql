
-- Enable RLS on project_briefs table if not already enabled
ALTER TABLE public.project_briefs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Admin can view all project briefs" ON public.project_briefs;
DROP POLICY IF EXISTS "Admin can insert project briefs" ON public.project_briefs;
DROP POLICY IF EXISTS "Admin can update all project briefs" ON public.project_briefs;
DROP POLICY IF EXISTS "Admin can delete project briefs" ON public.project_briefs;

-- Create admin policies for project_briefs table
-- Allow authenticated users (admin) to SELECT all project briefs
CREATE POLICY "Admin can view all project briefs"
ON public.project_briefs
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users (admin) to INSERT project briefs
CREATE POLICY "Admin can insert project briefs"
ON public.project_briefs
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users (admin) to UPDATE all project briefs
CREATE POLICY "Admin can update all project briefs"
ON public.project_briefs
FOR UPDATE
TO authenticated
USING (true);

-- Allow authenticated users (admin) to DELETE project briefs
CREATE POLICY "Admin can delete project briefs"
ON public.project_briefs
FOR DELETE
TO authenticated
USING (true);

-- Enable RLS on admin_activity_log table
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin can view all activity logs" ON public.admin_activity_log;
DROP POLICY IF EXISTS "Admin can insert activity logs" ON public.admin_activity_log;

-- Create admin policies for admin_activity_log table
CREATE POLICY "Admin can view all activity logs"
ON public.admin_activity_log
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin can insert activity logs"
ON public.admin_activity_log
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Enable RLS on brief_notes table
ALTER TABLE public.brief_notes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin can view all brief notes" ON public.brief_notes;
DROP POLICY IF EXISTS "Admin can insert brief notes" ON public.brief_notes;
DROP POLICY IF EXISTS "Admin can update brief notes" ON public.brief_notes;
DROP POLICY IF EXISTS "Admin can delete brief notes" ON public.brief_notes;

-- Create admin policies for brief_notes table
CREATE POLICY "Admin can view all brief notes"
ON public.brief_notes
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin can insert brief notes"
ON public.brief_notes
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admin can update brief notes"
ON public.brief_notes
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Admin can delete brief notes"
ON public.brief_notes
FOR DELETE
TO authenticated
USING (true);
