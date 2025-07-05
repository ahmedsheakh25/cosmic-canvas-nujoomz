
-- Add thread_id column to user_sessions table
ALTER TABLE public.user_sessions ADD COLUMN IF NOT EXISTS thread_id TEXT;
