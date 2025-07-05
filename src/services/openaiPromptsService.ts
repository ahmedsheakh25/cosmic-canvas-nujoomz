import { supabase } from '@/integrations/supabase/client';
import { openaiAssistantsService } from './openaiAssistantsService';
import { Prompt, OpenAISyncOperation } from '@/components/Admin/types/AssistantsTypes';

export class OpenAIPromptsService {
  private diagnosticLogs: any[] = [];

  constructor() {
    // Browser-safe constructor
  }

  // Diagnostic logging
  private log(step: string, data: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      step,
      data
    };
    this.diagnosticLogs.push(logEntry);
    console.log(`[OpenAI Prompts Service] ${step}:`, data);
  }

  // Get all diagnostic logs
  getDiagnosticLogs() {
    return this.diagnosticLogs;
  }

  // Clear diagnostic logs
  clearDiagnosticLogs() {
    this.diagnosticLogs = [];
  }

  // Enhanced prompt extraction with multiple sources
  async extractPromptsFromMultipleSources(): Promise<{
    prompts: Partial<Prompt>[];
    errors: any[];
    diagnostics: any[];
  }> {
    this.clearDiagnosticLogs();
    this.log('Starting comprehensive prompt extraction', {});

    try {
      // Call the new comprehensive sync edge function using Supabase client
      const { data: result, error } = await supabase.functions.invoke('openai-prompts-sync', {
        body: { action: 'sync' }
      });

      if (error) {
        throw new Error(`Edge function failed: ${error.message}`);
      }

      this.log('Comprehensive sync result', result);

      return {
        prompts: [], // Already synced to database
        errors: result?.errors || [],
        diagnostics: result?.diagnostics || []
      };
    } catch (error: any) {
      this.log('Failed to extract prompts from multiple sources', {
        error: error.message
      });

      return {
        prompts: [],
        errors: [{ operation: 'comprehensive_extraction', error: error.message }],
        diagnostics: this.getDiagnosticLogs()
      };
    }
  }

  // Legacy method for backward compatibility
  async extractPromptsFromOpenAIAssistants(): Promise<{
    prompts: Partial<Prompt>[];
    errors: any[];
    diagnostics: any[];
  }> {
    return this.extractPromptsFromMultipleSources();
  }

  // Sync prompts with database
  async syncPromptsWithDatabase(): Promise<{
    synced: number;
    errors: any[];
    diagnostics: any[];
    operation: OpenAISyncOperation;
  }> {
    this.log('Starting prompts sync with database', {});

    // Create sync operation record
    const { data: syncOp, error: syncOpError } = await supabase
      .from('openai_sync_operations')
      .insert({
        operation_type: 'sync_prompts',
        status: 'running',
        operation_details: { service: 'openai_prompts' }
      })
      .select()
      .single();

    if (syncOpError) {
      this.log('Failed to create sync operation record', { error: syncOpError.message });
      throw new Error(`Failed to create sync operation: ${syncOpError.message}`);
    }

    try {
      // Extract prompts from multiple OpenAI sources
      const { errors: extractErrors } = await this.extractPromptsFromMultipleSources();
      
      // Get the actual counts from the edge function response
      const synced = extractErrors.length === 0 ? 1 : 0;
      const syncErrors: any[] = [...extractErrors];

      // Update sync operation with accurate counts
      const finalStatus = syncErrors.length === 0 ? 'completed' : 'failed';
      await supabase
        .from('openai_sync_operations')
        .update({
          status: finalStatus,
          completed_at: new Date().toISOString(),
          items_processed: synced > 0 ? 1 : 0,  // At least one batch was processed
          items_synced: synced,
          error_count: syncErrors.length,
          error_details: syncErrors
        })
        .eq('id', syncOp.id);

      this.log('Prompts sync completed via comprehensive edge function', {
        synced,
        errors: syncErrors.length
      });

      return {
        synced,
        errors: syncErrors,
        diagnostics: this.getDiagnosticLogs(),
        operation: { ...syncOp, status: finalStatus } as OpenAISyncOperation
      };
    } catch (error: any) {
      // Update sync operation as failed
      await supabase
        .from('openai_sync_operations')
        .update({
          status: 'failed',
          error_details: [{ operation: 'sync_prompts', error: error.message }]
        })
        .eq('id', syncOp.id);

      this.log('Prompts sync failed', { error: error.message });

      return {
        synced: 0,
        errors: [{ operation: 'sync_prompts', error: error.message }],
        diagnostics: this.getDiagnosticLogs(),
        operation: { ...syncOp, status: 'failed' } as OpenAISyncOperation
      };
    }
  }

  // Get sync operations history
  async getSyncOperations(): Promise<OpenAISyncOperation[]> {
    const { data, error } = await supabase
      .from('openai_sync_operations')
      .select('*')
      .eq('operation_type', 'sync_prompts')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      this.log('Failed to fetch sync operations', { error: error.message });
      return [];
    }

    return data as OpenAISyncOperation[];
  }

  // Test connection to OpenAI via assistants service
  async testConnection(): Promise<{ success: boolean; error?: string; diagnostics: any[] }> {
    return await openaiAssistantsService.testConnection();
  }
}

// Export singleton instance
export const openaiPromptsService = new OpenAIPromptsService();
