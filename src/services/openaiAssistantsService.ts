
import { supabase } from '@/integrations/supabase/client';

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

export interface OpenAIPrompt {
  id: string;
  content: string;
  role: 'system' | 'user' | 'assistant';
  metadata?: Record<string, any>;
}

export class OpenAIAssistantsService {
  private diagnosticLogs: any[] = [];

  constructor() {
    // Browser-safe constructor - no OpenAI client initialization
  }

  // Diagnostic logging
  private log(step: string, data: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      step,
      data
    };
    this.diagnosticLogs.push(logEntry);
    console.log(`[OpenAI Service] ${step}:`, data);
  }

  // Get all diagnostic logs
  getDiagnosticLogs() {
    return this.diagnosticLogs;
  }

  // Clear diagnostic logs
  clearDiagnosticLogs() {
    this.diagnosticLogs = [];
  }

  // Call the Edge Function with improved error handling
  private async callEdgeFunction(action: string, data?: any): Promise<any> {
    try {
      this.log('Calling Edge Function', { action, hasData: !!data });

      const requestBody = { action, ...data };
      
      const { data: result, error } = await supabase.functions.invoke('openai-assistants', {
        body: requestBody,
        method: 'POST'
      });

      this.log('Edge Function response', { 
        hasResult: !!result, 
        hasError: !!error,
        success: result?.success 
      });

      if (error) {
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (!result) {
        throw new Error('No response from Edge Function');
      }

      if (!result.success) {
        throw new Error(result.error || 'Unknown edge function error');
      }

      // Merge diagnostics from edge function
      if (result.diagnostics) {
        this.diagnosticLogs.push(...result.diagnostics);
      }

      return result.data;
    } catch (error: any) {
      this.log('Edge function call failed', {
        action,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Test connection to Edge Function and OpenAI
  async testConnection(): Promise<{ success: boolean; error?: string; diagnostics: any[] }> {
    try {
      this.clearDiagnosticLogs();
      this.log('Testing connection', { action: 'test' });
      
      const result = await this.callEdgeFunction('test');
      
      this.log('Connection test successful', { result });
      
      return {
        success: true,
        diagnostics: this.getDiagnosticLogs()
      };
    } catch (error: any) {
      this.log('Connection test failed', { error: error.message });
      return {
        success: false,
        error: error.message,
        diagnostics: this.getDiagnosticLogs()
      };
    }
  }

  // Fetch all assistants from OpenAI via Edge Function
  async fetchAssistants(): Promise<OpenAIAssistant[]> {
    this.log('Fetching assistants via Edge Function', { action: 'list' });
    return await this.callEdgeFunction('list');
  }

  // Fetch a specific assistant by ID
  async fetchAssistant(assistantId: string): Promise<OpenAIAssistant> {
    this.log('Fetching single assistant via Edge Function', { assistantId });
    return await this.callEdgeFunction('get', { assistantId });
  }

  // Extract prompts from assistant's instructions
  extractPromptsFromAssistant(assistant: OpenAIAssistant): OpenAIPrompt[] {
    const prompts: OpenAIPrompt[] = [];

    if (assistant.instructions) {
      prompts.push({
        id: `${assistant.id}_system`,
        content: assistant.instructions,
        role: 'system',
        metadata: {
          assistant_id: assistant.id,
          assistant_name: assistant.name,
          type: 'system_instructions'
        }
      });
    }

    this.log('Extracted prompts from assistant', {
      assistantId: assistant.id,
      assistantName: assistant.name,
      promptCount: prompts.length
    });

    return prompts;
  }

  // Update assistant via Edge Function
  async updateAssistant(
    assistantId: string, 
    updates: {
      name?: string;
      description?: string;
      instructions?: string;
      model?: string;
      tools?: any[];
      temperature?: number;
      top_p?: number;
      metadata?: Record<string, any>;
    }
  ): Promise<OpenAIAssistant> {
    this.log('Updating assistant via Edge Function', { assistantId, updates });
    return await this.callEdgeFunction('update', { assistantId, updates });
  }

  // Create new assistant via Edge Function
  async createAssistant(assistantData: {
    name: string;
    description?: string;
    instructions: string;
    model: string;
    tools?: any[];
    temperature?: number;
    top_p?: number;
    metadata?: Record<string, any>;
  }): Promise<OpenAIAssistant> {
    this.log('Creating new assistant via Edge Function', { assistantData });
    return await this.callEdgeFunction('create', assistantData);
  }

  // Delete assistant via Edge Function
  async deleteAssistant(assistantId: string): Promise<void> {
    this.log('Deleting assistant via Edge Function', { assistantId });
    await this.callEdgeFunction('delete', { assistantId });
  }

  // Sync assistants between OpenAI and local database via Edge Function
  async syncAssistantsWithDatabase(supabaseClient: any): Promise<{
    synced: number;
    errors: any[];
    diagnostics: any[];
  }> {
    this.log('Starting sync via Edge Function', {});
    
    try {
      const result = await this.callEdgeFunction('sync');
      
      this.log('Sync operation completed via Edge Function', {
        synced: result.synced,
        errors: result.errors?.length || 0
      });

      return {
        synced: result.synced,
        errors: result.errors || [],
        diagnostics: this.getDiagnosticLogs()
      };
    } catch (error: any) {
      this.log('Sync operation failed', {
        error: error.message
      });
      
      return {
        synced: 0,
        errors: [{ operation: 'sync', error: error.message }],
        diagnostics: this.getDiagnosticLogs()
      };
    }
  }
}

// Export singleton instance
export const openaiAssistantsService = new OpenAIAssistantsService();
