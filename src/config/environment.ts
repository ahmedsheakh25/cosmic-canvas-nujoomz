export interface ServiceConfig {
  name: string;
  isConfigured: boolean;
  isCritical: boolean;
  status: 'healthy' | 'error' | 'unknown' | 'not_configured';
  lastCheck?: Date;
  error?: string;
}

interface Environment {
  supabase: {
    url: string;
    anonKey: string;
    serviceRole?: string;
  };
  openai: {
    apiKey: string;
    orgId?: string;
  };
  elevenLabs: {
    apiKey: string;
    voiceId: string;
  };
  colorServices: {
    huemint: {
      apiKey: string;
    };
    colormind: {
      endpoint: string;
    };
  };
  analytics: {
    enabled: boolean;
    endpoint?: string;
    apiKey?: string;
  };
  surveysparrow: {
    token: string;
    formId: string;
  };
}

export class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  private config: Environment;

  private constructor() {
    this.config = {
      supabase: {
        url: import.meta.env.VITE_SUPABASE_URL || '',
        anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        serviceRole: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY,
      },
      openai: {
        apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
        orgId: import.meta.env.VITE_OPENAI_ORG_ID,
      },
      elevenLabs: {
        apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
        voiceId: import.meta.env.VITE_ELEVENLABS_VOICE_ID || '',
      },
      colorServices: {
        huemint: {
          apiKey: import.meta.env.VITE_HUEMINT_API_KEY || '',
        },
        colormind: {
          endpoint: import.meta.env.VITE_COLORMIND_API_ENDPOINT || '',
        },
      },
      analytics: {
        enabled: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
        endpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT,
        apiKey: import.meta.env.VITE_ANALYTICS_API_KEY,
      },
      surveysparrow: {
        token: import.meta.env.VITE_SURVEYSPARROW_TOKEN || '',
        formId: import.meta.env.VITE_SURVEYSPARROW_FORM_ID || '',
      },
    };
  }

  public static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  public get<K extends keyof Environment>(key: K): Environment[K];
  public get<K extends keyof Environment, SK extends keyof Environment[K]>(
    key: K,
    subKey: SK
  ): Environment[K][SK];
  public get(key: string, subKey?: string): any {
    if (subKey) {
      const [mainKey, ...subKeys] = subKey.split('.');
      let value = this.config[key as keyof Environment][mainKey as any];
      for (const k of subKeys) {
        value = value[k];
      }
      return value;
    }
    return this.config[key as keyof Environment];
  }

  public validateConfig(): string[] {
    const missingVars: string[] = [];
    const requiredVars = {
      'VITE_SUPABASE_URL': this.config.supabase.url,
      'VITE_SUPABASE_ANON_KEY': this.config.supabase.anonKey,
      'VITE_OPENAI_API_KEY': this.config.openai.apiKey,
      'VITE_ELEVENLABS_API_KEY': this.config.elevenLabs.apiKey,
      'VITE_ELEVENLABS_VOICE_ID': this.config.elevenLabs.voiceId,
      'VITE_SURVEYSPARROW_TOKEN': this.config.surveysparrow.token,
      'VITE_SURVEYSPARROW_FORM_ID': this.config.surveysparrow.formId,
      'VITE_HUEMINT_API_KEY': this.config.colorServices.huemint.apiKey
    };

    const criticalVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_OPENAI_API_KEY'
    ];

    Object.entries(requiredVars).forEach(([key, value]) => {
      if (!value) {
        missingVars.push(key);
        const message = `Missing environment variable: ${key}`;
        if (criticalVars.includes(key)) {
          console.error(`🚨 CRITICAL: ${message}`);
          // Don't throw for missing critical services - just log the error
        } else {
          console.warn(`⚠️ WARNING: ${message}`);
        }
      }
    });

    return missingVars;
  }

  public getServiceConfigs(): ServiceConfig[] {
    return [
      {
        name: 'supabase',
        isConfigured: this.isServiceConfigured('supabase'),
        isCritical: true,
        status: this.isServiceConfigured('supabase') ? 'unknown' : 'not_configured'
      },
      {
        name: 'openai',
        isConfigured: this.isServiceConfigured('openai'),
        isCritical: true,
        status: this.isServiceConfigured('openai') ? 'unknown' : 'not_configured'
      },
      {
        name: 'elevenLabs',
        isConfigured: this.isServiceConfigured('elevenLabs'),
        isCritical: false,
        status: this.isServiceConfigured('elevenLabs') ? 'unknown' : 'not_configured'
      },
      {
        name: 'colorServices',
        isConfigured: this.isServiceConfigured('colorServices'),
        isCritical: false,
        status: this.isServiceConfigured('colorServices') ? 'unknown' : 'not_configured'
      },
      {
        name: 'analytics',
        isConfigured: this.isServiceConfigured('analytics'),
        isCritical: false,
        status: this.isServiceConfigured('analytics') ? 'unknown' : 'not_configured'
      },
      {
        name: 'surveysparrow',
        isConfigured: this.isServiceConfigured('surveysparrow'),
        isCritical: false,
        status: this.isServiceConfigured('surveysparrow') ? 'unknown' : 'not_configured'
      }
    ];
  }

  public getCriticalServices(): ServiceConfig[] {
    return this.getServiceConfigs().filter(service => service.isCritical);
  }

  public getOptionalServices(): ServiceConfig[] {
    return this.getServiceConfigs().filter(service => !service.isCritical);
  }

  public hasAllCriticalServices(): boolean {
    return this.getCriticalServices().every(service => service.isConfigured);
  }

  public isServiceConfigured(service: keyof Environment): boolean {
    switch (service) {
      case 'supabase':
        return !!(this.config.supabase.url && this.config.supabase.anonKey);
      case 'openai':
        return !!this.config.openai.apiKey;
      case 'elevenLabs':
        return !!(this.config.elevenLabs.apiKey && this.config.elevenLabs.voiceId);
      case 'colorServices':
        return !!(
          this.config.colorServices.huemint.apiKey ||
          this.config.colorServices.colormind.endpoint
        );
      case 'analytics':
        return !!(
          this.config.analytics.enabled &&
          this.config.analytics.apiKey
        );
      case 'surveysparrow':
        return !!(
          this.config.surveysparrow.token &&
          this.config.surveysparrow.formId
        );
      default:
        return false;
    }
  }
}

export const environment = EnvironmentConfig.getInstance(); 