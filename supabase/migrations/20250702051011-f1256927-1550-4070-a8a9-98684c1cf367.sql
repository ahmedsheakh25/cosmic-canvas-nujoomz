-- Fix the check constraint to allow 'creative' type prompts
ALTER TABLE public.prompts 
DROP CONSTRAINT IF EXISTS check_openai_prompt_type;

-- Add updated constraint that includes 'creative'
ALTER TABLE public.prompts 
ADD CONSTRAINT check_openai_prompt_type 
CHECK (openai_prompt_type IN ('system', 'user', 'assistant', 'custom', 'creative'));