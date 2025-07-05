import { environment } from '@/config/environment';
import { supabase } from '@/integrations/supabase/client';

export interface ConnectionTestResult {
  service: string;
  status: 'success' | 'error' | 'not_configured';
  responseTime?: number;
  error?: string;
  details?: any;
  suggestions?: string[];
}

export interface TestConnectionsResult {
  overall: 'success' | 'partial' | 'failed';
  results: ConnectionTestResult[];
  criticalFailures: string[];
  recommendations: string[];
}

export class EnhancedConnectionTester {
  private async testSupabase(): Promise<ConnectionTestResult> {
    const startTime = Date.now();
    
    try {
      if (!environment.isServiceConfigured('supabase')) {
        return {
          service: 'supabase',
          status: 'not_configured',
          error: 'Supabase credentials not configured',
          suggestions: [
            'Check VITE_SUPABASE_URL environment variable',
            'Check VITE_SUPABASE_ANON_KEY environment variable'
          ]
        };
      }

      // Test basic connectivity
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      if (error) {
        throw new Error(`Database query failed: ${error.message}`);
      }

      const responseTime = Date.now() - startTime;

      return {
        service: 'supabase',
        status: 'success',
        responseTime,
        details: {
          connected: true,
          queryTest: 'passed'
        }
      };
    } catch (error: any) {
      return {
        service: 'supabase',
        status: 'error',
        responseTime: Date.now() - startTime,
        error: error.message,
        suggestions: [
          'Verify Supabase project URL is correct',
          'Check if anon key has proper permissions',
          'Ensure database is accessible'
        ]
      };
    }
  }

  private async testOpenAI(): Promise<ConnectionTestResult> {
    const startTime = Date.now();
    
    try {
      if (!environment.isServiceConfigured('openai')) {
        return {
          service: 'openai',
          status: 'not_configured',
          error: 'OpenAI API key not configured',
          suggestions: [
            'Get API key from https://platform.openai.com/api-keys',
            'Set VITE_OPENAI_API_KEY environment variable'
          ]
        };
      }

      // Test through edge function to avoid exposing API key
      const { data, error } = await supabase.functions.invoke('health-check', {
        body: { service: 'openai' }
      });

      if (error) {
        throw new Error(`Health check failed: ${error.message}`);
      }

      const responseTime = Date.now() - startTime;

      return {
        service: 'openai',
        status: data.services?.openai?.status === 'healthy' ? 'success' : 'error',
        responseTime,
        details: data.services?.openai,
        error: data.services?.openai?.error
      };
    } catch (error: any) {
      return {
        service: 'openai',
        status: 'error',
        responseTime: Date.now() - startTime,
        error: error.message,
        suggestions: [
          'Verify API key is valid and active',
          'Check if you have sufficient credits',
          'Ensure API key has correct permissions'
        ]
      };
    }
  }

  private async testElevenLabs(): Promise<ConnectionTestResult> {
    const startTime = Date.now();
    
    try {
      if (!environment.isServiceConfigured('elevenLabs')) {
        return {
          service: 'elevenLabs',
          status: 'not_configured',
          error: 'ElevenLabs credentials not configured',
          suggestions: [
            'Get API key from https://elevenlabs.io/app/settings',
            'Set VITE_ELEVENLABS_API_KEY environment variable',
            'Set VITE_ELEVENLABS_VOICE_ID environment variable'
          ]
        };
      }

      const config = environment.get('elevenLabs');
      
      // Test voices endpoint
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': config.apiKey,
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error (${response.status}): ${errorData}`);
      }

      const voices = await response.json();
      const responseTime = Date.now() - startTime;

      // Check if configured voice ID exists
      const voiceExists = voices.voices?.some((voice: any) => voice.voice_id === config.voiceId);

      return {
        service: 'elevenLabs',
        status: voiceExists ? 'success' : 'error',
        responseTime,
        details: {
          voicesCount: voices.voices?.length || 0,
          configuredVoiceExists: voiceExists
        },
        error: !voiceExists ? 'Configured voice ID not found' : undefined,
        suggestions: !voiceExists ? [
          'Check if VITE_ELEVENLABS_VOICE_ID is correct',
          'Browse available voices in ElevenLabs dashboard'
        ] : undefined
      };
    } catch (error: any) {
      return {
        service: 'elevenLabs',
        status: 'error',
        responseTime: Date.now() - startTime,
        error: error.message,
        suggestions: [
          'Verify API key is valid',
          'Check if you have available characters',
          'Ensure voice ID exists in your account'
        ]
      };
    }
  }

  private async testColorServices(): Promise<ConnectionTestResult> {
    const startTime = Date.now();
    
    try {
      if (!environment.isServiceConfigured('colorServices')) {
        return {
          service: 'colorServices',
          status: 'not_configured',
          error: 'Color services not configured',
          suggestions: [
            'Get Huemint API key from https://huemint.com',
            'Set VITE_HUEMINT_API_KEY environment variable'
          ]
        };
      }

      const config = environment.get('colorServices');
      
      // Test Huemint API
      const response = await fetch('https://api.huemint.com/color', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.huemint.apiKey}`,
        },
        body: JSON.stringify({
          mode: 'transformer',
          num_results: 1,
          temperature: 0.5,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error (${response.status}): ${errorData}`);
      }

      const responseTime = Date.now() - startTime;

      return {
        service: 'colorServices',
        status: 'success',
        responseTime,
        details: {
          huemint: 'connected'
        }
      };
    } catch (error: any) {
      return {
        service: 'colorServices',
        status: 'error',
        responseTime: Date.now() - startTime,
        error: error.message,
        suggestions: [
          'Verify Huemint API key is valid',
          'Check API usage limits'
        ]
      };
    }
  }

  public async testAllConnections(): Promise<TestConnectionsResult> {
    console.log('🚀 Starting Enhanced API Connection Tests...\n');
    
    const results: ConnectionTestResult[] = [];
    
    // Test all services in parallel
    const [supabaseResult, openaiResult, elevenLabsResult, colorServicesResult] = await Promise.all([
      this.testSupabase(),
      this.testOpenAI(),
      this.testElevenLabs(),
      this.testColorServices()
    ]);

    results.push(supabaseResult, openaiResult, elevenLabsResult, colorServicesResult);

    // Analyze results
    const criticalServices = ['supabase', 'openai'];
    const criticalFailures = results
      .filter(r => criticalServices.includes(r.service) && r.status === 'error')
      .map(r => r.service);

    const successCount = results.filter(r => r.status === 'success').length;
    const totalCount = results.length;

    let overall: 'success' | 'partial' | 'failed';
    if (criticalFailures.length > 0) {
      overall = 'failed';
    } else if (successCount === totalCount) {
      overall = 'success';
    } else {
      overall = 'partial';
    }

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (criticalFailures.length > 0) {
      recommendations.push('Critical services must be configured for the application to function properly');
    }
    
    const notConfigured = results.filter(r => r.status === 'not_configured');
    if (notConfigured.length > 0) {
      recommendations.push(`Configure ${notConfigured.map(r => r.service).join(', ')} to enable additional features`);
    }

    // Log results
    results.forEach(result => {
      const icon = result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : '⚠️';
      console.log(`${icon} ${result.service}: ${result.status}`);
      if (result.responseTime) {
        console.log(`   Response time: ${result.responseTime}ms`);
      }
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });

    console.log(`\n📊 Overall Status: ${overall.toUpperCase()}`);

    return {
      overall,
      results,
      criticalFailures,
      recommendations
    };
  }

  public async testSingleService(serviceName: string): Promise<ConnectionTestResult> {
    switch (serviceName) {
      case 'supabase':
        return this.testSupabase();
      case 'openai':
        return this.testOpenAI();
      case 'elevenLabs':
        return this.testElevenLabs();
      case 'colorServices':
        return this.testColorServices();
      default:
        return {
          service: serviceName,
          status: 'error',
          error: 'Unknown service'
        };
    }
  }
}

export const enhancedConnectionTester = new EnhancedConnectionTester();