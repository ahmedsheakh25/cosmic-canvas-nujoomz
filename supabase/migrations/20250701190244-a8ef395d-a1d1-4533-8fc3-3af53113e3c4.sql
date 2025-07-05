-- Add OpenAI-specific columns to the prompts table
ALTER TABLE public.prompts 
ADD COLUMN IF NOT EXISTS openai_assistant_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS openai_prompt_type TEXT DEFAULT 'custom',
ADD COLUMN IF NOT EXISTS openai_synced_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS openai_source TEXT DEFAULT 'local';

-- Add unique constraint on openai_assistant_id
ALTER TABLE public.prompts
ADD CONSTRAINT prompts_openai_assistant_id_unique UNIQUE (openai_assistant_id);

-- Add check constraint for openai_prompt_type
ALTER TABLE public.prompts 
ADD CONSTRAINT check_openai_prompt_type 
CHECK (openai_prompt_type IN ('system', 'user', 'assistant', 'custom'));

-- Add check constraint for openai_source
ALTER TABLE public.prompts 
ADD CONSTRAINT check_openai_source 
CHECK (openai_source IN ('local', 'openai', 'synced'));

-- Create index for better performance on OpenAI queries
CREATE INDEX IF NOT EXISTS idx_prompts_openai_assistant_id ON public.prompts(openai_assistant_id);
CREATE INDEX IF NOT EXISTS idx_prompts_openai_source ON public.prompts(openai_source);

-- Create table for tracking OpenAI sync operations
CREATE TABLE IF NOT EXISTS public.openai_sync_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation_type TEXT NOT NULL CHECK (operation_type IN ('sync_assistants', 'sync_prompts', 'full_sync')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  items_processed INTEGER DEFAULT 0,
  items_synced INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  error_details JSONB DEFAULT '[]'::jsonb,
  operation_details JSONB DEFAULT '{}'::jsonb,
  performed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sync operations table
ALTER TABLE public.openai_sync_operations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for sync operations
CREATE POLICY "Admin can manage sync operations" 
ON public.openai_sync_operations 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.openai_sync_operations TO authenticated;
GRANT ALL ON public.openai_sync_operations TO service_role;

-- Create function to update sync operation status
CREATE OR REPLACE FUNCTION public.update_sync_operation_status()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  IF NEW.status IN ('completed', 'failed') AND OLD.status NOT IN ('completed', 'failed') THEN
    NEW.completed_at = now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for sync operations
DROP TRIGGER IF EXISTS trigger_update_sync_operation_status ON public.openai_sync_operations;
CREATE TRIGGER trigger_update_sync_operation_status
  BEFORE UPDATE ON public.openai_sync_operations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_sync_operation_status();

-- Add missing columns to project_briefs table
ALTER TABLE public.project_briefs 
ADD COLUMN IF NOT EXISTS session_id UUID,
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS client_info JSONB DEFAULT '{}'::jsonb;

-- Add foreign key constraint to session_id
ALTER TABLE public.project_briefs
ADD CONSTRAINT project_briefs_session_id_fkey
FOREIGN KEY (session_id) REFERENCES public.user_sessions(session_id) ON DELETE CASCADE;

-- Create service_suggestions table
CREATE TABLE IF NOT EXISTS public.service_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.user_sessions(session_id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  description TEXT,
  reasoning TEXT,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on service_suggestions table
ALTER TABLE public.service_suggestions ENABLE ROW LEVEL SECURITY;

-- Create policy for service_suggestions
CREATE POLICY "Users can view their own service suggestions"
ON public.service_suggestions
FOR SELECT
USING (session_id IN (
  SELECT session_id FROM public.user_sessions
));

-- Update the status check constraint to include completed_with_errors
ALTER TABLE public.openai_sync_operations 
DROP CONSTRAINT IF EXISTS openai_sync_operations_status_check;

ALTER TABLE public.openai_sync_operations 
ADD CONSTRAINT openai_sync_operations_status_check 
CHECK (status IN ('pending', 'running', 'completed', 'completed_with_errors', 'failed'));
