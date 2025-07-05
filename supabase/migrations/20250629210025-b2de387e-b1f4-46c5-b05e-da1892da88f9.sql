
-- First, let's create the missing users table that project_briefs references
CREATE TABLE IF NOT EXISTS public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL UNIQUE,
  language_preference TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (since these are anonymous sessions)
CREATE POLICY "Allow public access to users" ON public.users FOR ALL USING (true);

-- Update the project_briefs foreign key to reference the correct table
-- First drop the existing constraint if it exists
ALTER TABLE public.project_briefs DROP CONSTRAINT IF EXISTS project_briefs_user_id_fkey;

-- Add the correct foreign key constraint
ALTER TABLE public.project_briefs ADD CONSTRAINT project_briefs_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_session_id ON public.users(session_id);
