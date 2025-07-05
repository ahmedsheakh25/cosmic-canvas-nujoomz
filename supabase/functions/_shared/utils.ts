import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export interface ResponseData {
  success: boolean;
  data?: any;
  error?: string;
  diagnostics?: any[];
  executionTime?: number;
  timestamp?: string;
}

export const createResponse = (
  data: any, 
  error: string | null, 
  status: number = 200, 
  executionTime?: number,
  diagnostics?: any[]
): Response => {
  const responseData: ResponseData = {
    success: status < 400,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    responseData.data = data;
  }

  if (error) {
    responseData.error = error;
  }

  if (executionTime !== undefined) {
    responseData.executionTime = executionTime;
  }

  if (diagnostics && diagnostics.length > 0) {
    responseData.diagnostics = diagnostics;
  }

  return new Response(JSON.stringify(responseData), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
};

interface ErrorLogEntry {
  function_name: string;
  error_message: string;
  error_stack?: string;
  metadata: Record<string, any>;
  timestamp: string;
  severity: 'error' | 'warning' | 'info';
}

export async function logSystemError(
  functionName: string,
  error: Error,
  metadata: Record<string, any> = {},
  severity: ErrorLogEntry['severity'] = 'error'
): Promise<void> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const logEntry: ErrorLogEntry = {
    function_name: functionName,
    error_message: error.message,
    error_stack: error.stack,
    metadata,
    timestamp: new Date().toISOString(),
    severity
  };

  try {
    const { error: insertError } = await supabase
      .from('system_logs')
      .insert(logEntry);

    if (insertError) {
      console.error('Failed to log error:', insertError);
    }
  } catch (loggingError) {
    console.error('Critical: Failed to log error:', loggingError);
  }
}

export function errorResponse(message: string, status = 500) {
  return new Response(
    JSON.stringify({
      error: message
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

export const validateEnvironmentVars = (required: string[]) => {
  const missing: string[] = [];
  const present: string[] = [];
  
  for (const varName of required) {
    const value = Deno.env.get(varName);
    if (!value || value.trim() === '') {
      missing.push(varName);
    } else {
      present.push(varName);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing,
    present
  };
};

export const withTimeout = async <T>(
  promise: Promise<T>, 
  timeoutMs: number, 
  timeoutError: string = 'Operation timed out'
): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(timeoutError)), timeoutMs);
  });
  
  return Promise.race([promise, timeoutPromise]);
};
