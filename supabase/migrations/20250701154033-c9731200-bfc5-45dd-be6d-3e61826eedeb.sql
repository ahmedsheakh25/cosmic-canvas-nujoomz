
-- Create assistants table
CREATE TABLE public.assistants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'gpt-4.1-2025-04-14',
  temperature DECIMAL(3,2) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens INTEGER DEFAULT 1000 CHECK (max_tokens > 0),
  top_p DECIMAL(3,2) DEFAULT 1.0 CHECK (top_p >= 0 AND top_p <= 1),
  frequency_penalty DECIMAL(3,2) DEFAULT 0.0 CHECK (frequency_penalty >= -2 AND frequency_penalty <= 2),
  presence_penalty DECIMAL(3,2) DEFAULT 0.0 CHECK (presence_penalty >= -2 AND presence_penalty <= 2),
  tools JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prompts table
CREATE TABLE public.prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  variables JSONB DEFAULT '[]',
  is_template BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  is_public BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create assistant_prompt_history table for tracking prompt usage
CREATE TABLE public.assistant_prompt_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assistant_id UUID REFERENCES public.assistants(id) ON DELETE CASCADE,
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
  used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID REFERENCES auth.users(id)
);

-- Add RLS policies for assistants
ALTER TABLE public.assistants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage all assistants" 
  ON public.assistants 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view active assistants" 
  ON public.assistants 
  FOR SELECT 
  USING (is_active = true);

-- Add RLS policies for prompts
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can manage all prompts" 
  ON public.prompts 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view public prompts" 
  ON public.prompts 
  FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Users can manage their own prompts" 
  ON public.prompts 
  FOR ALL 
  USING (created_by = auth.uid());

-- Add RLS policies for assistant_prompt_history
ALTER TABLE public.assistant_prompt_history ENABLE ROW LEVEL SECURITY;

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

-- Create indexes for better performance
CREATE INDEX idx_assistants_active ON public.assistants(is_active);
CREATE INDEX idx_assistants_created_by ON public.assistants(created_by);
CREATE INDEX idx_prompts_public ON public.prompts(is_public);
CREATE INDEX idx_prompts_category ON public.prompts(category);
CREATE INDEX idx_prompts_created_by ON public.prompts(created_by);
CREATE INDEX idx_assistant_prompt_history_assistant_id ON public.assistant_prompt_history(assistant_id);
CREATE INDEX idx_assistant_prompt_history_prompt_id ON public.assistant_prompt_history(prompt_id);

-- Create function to update usage count when prompt is used
CREATE OR REPLACE FUNCTION public.increment_prompt_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.prompts 
  SET usage_count = usage_count + 1 
  WHERE id = NEW.prompt_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically increment usage count
CREATE TRIGGER trigger_increment_prompt_usage
  AFTER INSERT ON public.assistant_prompt_history
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_prompt_usage();

-- Insert some sample data for testing
INSERT INTO public.assistants (name, description, system_prompt, model, created_by) VALUES
('General Assistant', 'A helpful general-purpose AI assistant', 'You are a helpful, harmless, and honest AI assistant. Provide clear and accurate responses to user queries.', 'gpt-4.1-2025-04-14', NULL),
('Code Review Assistant', 'Specialized assistant for code review and programming help', 'You are an expert software engineer. Help users with code review, debugging, and programming best practices. Focus on clean, maintainable code.', 'gpt-4.1-2025-04-14', NULL),
('Creative Writing Assistant', 'Assistant for creative writing and storytelling', 'You are a creative writing expert. Help users with storytelling, character development, plot creation, and creative writing techniques.', 'gpt-4.1-2025-04-14', NULL);

INSERT INTO public.prompts (title, description, content, category, tags, is_public) VALUES
('Code Review Template', 'Template for conducting thorough code reviews', 'Please review the following code for:\n1. Code quality and readability\n2. Performance considerations\n3. Security vulnerabilities\n4. Best practices adherence\n\nCode to review:\n{code}', 'development', ARRAY['code-review', 'development'], true),
('Bug Report Analysis', 'Template for analyzing bug reports', 'Analyze this bug report and provide:\n1. Root cause analysis\n2. Potential solutions\n3. Prevention strategies\n\nBug Report:\n{bug_report}', 'development', ARRAY['debugging', 'analysis'], true),
('Meeting Summary', 'Template for summarizing meeting notes', 'Create a concise meeting summary with:\n1. Key decisions made\n2. Action items and owners\n3. Next steps\n\nMeeting Notes:\n{notes}', 'productivity', ARRAY['meetings', 'summary'], true);
