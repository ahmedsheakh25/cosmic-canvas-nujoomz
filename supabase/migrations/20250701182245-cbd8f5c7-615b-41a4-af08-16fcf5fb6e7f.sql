
-- Migration to fix OpenAI Assistant ID compatibility
-- Change assistants.id from UUID to VARCHAR to support OpenAI assistant IDs

-- Step 1: Create a backup of existing data (if any)
CREATE TABLE IF NOT EXISTS assistants_backup AS 
SELECT * FROM assistants;

-- Step 2: Drop foreign key constraints and dependent objects
DROP TABLE IF EXISTS assistant_prompt_history CASCADE;

-- Step 3: Drop the existing assistants table
DROP TABLE IF EXISTS assistants CASCADE;

-- Step 4: Recreate assistants table with VARCHAR id
CREATE TABLE public.assistants (
  id VARCHAR(255) PRIMARY KEY, -- Changed from UUID to VARCHAR for OpenAI compatibility
  name TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'gpt-4.1-2025-04-14',
  temperature NUMERIC DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 1000,
  top_p NUMERIC DEFAULT 1.0,
  frequency_penalty NUMERIC DEFAULT 0.0,
  presence_penalty NUMERIC DEFAULT 0.0,
  tools JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 5: Recreate assistant_prompt_history table with VARCHAR foreign key
CREATE TABLE public.assistant_prompt_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assistant_id VARCHAR(255) REFERENCES public.assistants(id), -- Changed to VARCHAR
  prompt_id UUID,
  user_id UUID,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Step 6: Enable RLS on both tables
ALTER TABLE public.assistants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assistant_prompt_history ENABLE ROW LEVEL SECURITY;

-- Step 7: Recreate RLS policies for assistants table
CREATE POLICY "Admin can manage all assistants" 
ON public.assistants 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view active assistants" 
ON public.assistants 
FOR SELECT 
USING (is_active = true);

-- Step 8: Recreate RLS policies for assistant_prompt_history table
CREATE POLICY "Admin can view all assistant prompt history" 
ON public.assistant_prompt_history 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own assistant prompt history" 
ON public.assistant_prompt_history 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own assistant prompt history" 
ON public.assistant_prompt_history 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

-- Step 9: Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assistants TO authenticated;
GRANT ALL ON public.assistants TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assistant_prompt_history TO authenticated;
GRANT ALL ON public.assistant_prompt_history TO service_role;

-- Step 10: Clean up backup table (optional, keep for safety)
-- DROP TABLE IF EXISTS assistants_backup;
