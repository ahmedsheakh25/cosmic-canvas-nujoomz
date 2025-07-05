// Updated to handle OpenAI assistant IDs as strings
export interface Assistant {
  id: string; // Changed from UUID to string to support OpenAI assistant IDs like "asst_XXXX"
  name: string;
  description?: string;
  system_prompt: string;
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  tools: any[];
  metadata: Record<string, any>;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AssistantFormData {
  name: string;
  description: string;
  system_prompt: string;
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  is_active: boolean;
}

export interface OpenAIAssistant {
  id: string;
  object: string;
  created_at: number;
  name: string | null;
  description: string | null;
  model: string;
  instructions: string | null;
  tools: any[];
  file_ids: string[];
  metadata: Record<string, any>;
  top_p: number | null;
  temperature: number | null;
  response_format: any;
}

// Enhanced Prompt interface with OpenAI integration fields
export interface Prompt {
  id: string;
  title: string;
  description?: string;
  content: string;
  category: string;
  tags: string[];
  is_template: boolean;
  is_public: boolean;
  usage_count: number;
  rating: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // New OpenAI integration fields
  openai_assistant_id?: string;
  openai_prompt_type?: 'system' | 'user' | 'assistant' | 'custom';
  openai_synced_at?: string;
  openai_source?: 'local' | 'openai' | 'synced';
}

// New interface for sync operations
export interface OpenAISyncOperation {
  id: string;
  operation_type: 'sync_assistants' | 'sync_prompts' | 'full_sync';
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  items_processed: number;
  items_synced: number;
  error_count: number;
  error_details: any[];
  operation_details: Record<string, any>;
  performed_by?: string;
  created_at: string;
  updated_at: string;
}

// Add the missing AssistantsManagerState interface
export interface AssistantsManagerState {
  selectedAssistant: string | null;
  assistantsModalOpen: boolean;
  promptsModalOpen: boolean;
}

export interface PromptsFile {
  prompts: {
    title: string;
    description?: string;
    content: string;
    category?: string;
    tags?: string[];
    is_template?: boolean;
    is_public?: boolean;
  }[];
  metadata?: {
    version?: string;
    created_at?: string;
    description?: string;
  };
}
