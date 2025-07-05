
-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public)
VALUES ('project_files', 'project_files', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the storage bucket
CREATE POLICY "Admins can upload project files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project_files');

CREATE POLICY "Admins can view project files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'project_files');

CREATE POLICY "Admins can update project files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'project_files');

CREATE POLICY "Admins can delete project files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'project_files');

-- Add PDF URL column to project_briefs if not exists
ALTER TABLE public.project_briefs 
ADD COLUMN IF NOT EXISTS pdf_url TEXT;
