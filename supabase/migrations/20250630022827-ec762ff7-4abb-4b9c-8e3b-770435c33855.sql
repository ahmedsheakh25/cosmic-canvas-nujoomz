
-- Create the project_files storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('project_files', 'project_files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for public access to project files
CREATE POLICY "Public Access to Project Files"
ON storage.objects FOR SELECT
USING ( bucket_id = 'project_files' );

-- Allow authenticated uploads to project files bucket
CREATE POLICY "Allow uploads to project files"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'project_files' );

-- Allow updates to project files
CREATE POLICY "Allow updates to project files"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'project_files' );

-- Allow deletes for project files
CREATE POLICY "Allow deletes for project files"
ON storage.objects FOR DELETE
USING ( bucket_id = 'project_files' );
