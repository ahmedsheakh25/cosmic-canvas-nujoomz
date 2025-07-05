
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated uploads to project_files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own project files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own project files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own project files" ON storage.objects;

-- Create storage bucket for project files if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('project_files', 'project_files', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for project files bucket
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads to project_files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'project_files' 
  AND auth.role() = 'anon'
);

-- Allow users to view their own files based on session_id in file path
CREATE POLICY "Users can view their own project files"
ON storage.objects  
FOR SELECT
USING (
  bucket_id = 'project_files'
  AND (
    auth.role() = 'anon'
    OR name LIKE 'briefs/%'
  )
);

-- Allow users to update their own files
CREATE POLICY "Users can update their own project files"
ON storage.objects
FOR UPDATE  
USING (
  bucket_id = 'project_files'
  AND (
    auth.role() = 'anon'
    OR name LIKE 'briefs/%'
  )
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own project files"  
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'project_files'
  AND (
    auth.role() = 'anon'
    OR name LIKE 'briefs/%'
  )
);
