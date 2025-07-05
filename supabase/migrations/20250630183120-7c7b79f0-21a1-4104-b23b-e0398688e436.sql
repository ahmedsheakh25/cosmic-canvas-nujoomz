
-- First, let's check if the user-uploads bucket already exists and create it if it doesn't
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-uploads', 'user-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Create specific policies for the user-uploads bucket with unique names
CREATE POLICY "Allow public access to user uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'user-uploads');

CREATE POLICY "Allow authenticated uploads to user uploads"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'user-uploads');

CREATE POLICY "Allow users to delete user uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'user-uploads');

CREATE POLICY "Allow users to update user uploads"
ON storage.objects FOR UPDATE
USING (bucket_id = 'user-uploads');
