
-- Add PDF URL column to project_briefs table
ALTER TABLE project_briefs ADD COLUMN IF NOT EXISTS pdf_url TEXT;

-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public)
VALUES ('project_files', 'project_files', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow public access to project files
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'project_files' );

-- Create storage policy to allow uploads to project files bucket
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'project_files' );

-- Create storage policy to allow updates to project files
CREATE POLICY "Allow updates"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'project_files' );
