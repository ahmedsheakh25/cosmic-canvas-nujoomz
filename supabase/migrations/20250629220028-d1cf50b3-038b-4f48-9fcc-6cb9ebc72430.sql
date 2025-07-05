
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own project briefs" ON project_briefs;
DROP POLICY IF EXISTS "Users can create their own project briefs" ON project_briefs;
DROP POLICY IF EXISTS "Users can update their own project briefs" ON project_briefs;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow authenticated uploads to project_files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own project files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own project files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own project files" ON storage.objects;

-- Step 1: Make the project_files bucket private (set public to false)
UPDATE storage.buckets 
SET public = false 
WHERE id = 'project_files';

-- Step 2: Enable RLS on the project_briefs table (if not already enabled)
ALTER TABLE project_briefs ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS policy for project_briefs table
-- Allow users to select their own project briefs based on user_id
CREATE POLICY "Users can view their own project briefs"
ON project_briefs
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = project_briefs.user_id 
    AND users.session_id::text = COALESCE(current_setting('request.jwt.claims', true)::json->>'session_id', '')
  )
);

-- Step 4: Allow users to insert their own project briefs
CREATE POLICY "Users can create their own project briefs"
ON project_briefs
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = user_id 
    AND users.session_id::text = COALESCE(current_setting('request.jwt.claims', true)::json->>'session_id', '')
  )
);

-- Step 5: Allow users to update their own project briefs
CREATE POLICY "Users can update their own project briefs"
ON project_briefs
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = project_briefs.user_id 
    AND users.session_id::text = COALESCE(current_setting('request.jwt.claims', true)::json->>'session_id', '')
  )
);

-- Step 6: Storage policies for the project_files bucket
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads to project_files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'project_files' 
  AND auth.role() = 'anon'
);

-- Allow users to view files they own (based on file path containing their session_id)
CREATE POLICY "Users can view their own project files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'project_files'
  AND (
    auth.role() = 'anon' 
    OR name LIKE 'briefs/' || COALESCE(current_setting('request.jwt.claims', true)::json->>'session_id', '') || '%'
  )
);

-- Allow users to update/delete their own files
CREATE POLICY "Users can update their own project files"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'project_files'
  AND (
    auth.role() = 'anon'
    OR name LIKE 'briefs/' || COALESCE(current_setting('request.jwt.claims', true)::json->>'session_id', '') || '%'
  )
);

CREATE POLICY "Users can delete their own project files"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'project_files'
  AND (
    auth.role() = 'anon'
    OR name LIKE 'briefs/' || COALESCE(current_setting('request.jwt.claims', true)::json->>'session_id', '') || '%'
  )
);
