import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import { EnvironmentConfig } from '@/config/environment';
import type { ReactElement } from 'react';

interface SurveySparrowConfig {
  token: string;
  formId: string;
}

class AnalyticsClient {
  private static instance: AnalyticsClient;
  private surveySparrowConfig: SurveySparrowConfig | null = null;
  private isVercelEnabled: boolean = true;

  private constructor() {
    const env = EnvironmentConfig.getInstance();
    
    // Initialize SurveySparrow if configured
    const token = env.get('surveysparrow', 'token');
    const formId = env.get('surveysparrow', 'formId');
    
    if (token && formId) {
      this.surveySparrowConfig = { token, formId };
      this.initializeSurveySparrow();
    }
  }

  public static getInstance(): AnalyticsClient {
    if (!AnalyticsClient.instance) {
      AnalyticsClient.instance = new AnalyticsClient();
    }
    return AnalyticsClient.instance;
  }

  private initializeSurveySparrow() {
    if (!this.surveySparrowConfig) return;

    // Load SurveySparrow script
    const script = document.createElement('script');
    script.src = 'https://surveysparrow.com/widget/ss-widget.js';
    script.async = true;
    document.head.appendChild(script);

    // Initialize once script loads
    script.onload = () => {
      (window as any).SS_WIDGET.init(this.surveySparrowConfig!.token, {
        formId: this.surveySparrowConfig!.formId,
        autoInit: false // We'll show forms manually
      });
    };
  }

  public showSurvey(options: {
    trigger?: 'emotion' | 'service' | 'completion';
    context?: Record<string, any>;
  } = {}) {
    if (!this.surveySparrowConfig) {
      console.warn('SurveySparrow not configured');
      return;
    }

    try {
      // Pass context data to survey
      const contextData = {
        trigger: options.trigger,
        timestamp: new Date().toISOString(),
        ...options.context
      };

      (window as any).SS_WIDGET.show({
        formId: this.surveySparrowConfig.formId,
        data: contextData
      });
    } catch (error) {
      console.error('Error showing SurveySparrow survey:', error);
    }
  }

  public async getSurveyResults(): Promise<any> {
    if (!this.surveySparrowConfig) {
      console.warn('SurveySparrow not configured');
      return null;
    }

    try {
      const response = await fetch(
        `https://api.surveysparrow.com/v3/form_responses/${this.surveySparrowConfig.formId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.surveySparrowConfig.token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`SurveySparrow API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching SurveySparrow results:', error);
      return null;
    }
  }

  public getVercelAnalyticsComponent(): ReactElement | null {
    return this.isVercelEnabled ? <Analytics /> : null;
  }
}

export const analyticsClient = AnalyticsClient.getInstance(); 