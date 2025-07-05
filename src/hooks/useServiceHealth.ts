import { useState, useEffect, useCallback } from 'react';
import { environment, type ServiceConfig } from '@/config/environment';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceHealthStatus extends ServiceConfig {
  responseTime?: number;
  lastError?: string;
  isChecking?: boolean;
}

export const useServiceHealth = () => {
  const [services, setServices] = useState<ServiceHealthStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const checkServiceHealth = useCallback(async (serviceName: string): Promise<Partial<ServiceHealthStatus>> => {
    const startTime = Date.now();
    
    try {
      switch (serviceName) {
        case 'supabase':
          await supabase.from('users').select('id').limit(1);
          return {
            status: 'healthy',
            responseTime: Date.now() - startTime,
            lastCheck: new Date()
          };

        case 'openai':
          const response = await fetch('/api/health-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ service: 'openai' })
          });
          
          if (!response.ok) throw new Error('OpenAI health check failed');
          
          return {
            status: 'healthy',
            responseTime: Date.now() - startTime,
            lastCheck: new Date()
          };

        case 'elevenLabs':
          if (!environment.isServiceConfigured('elevenLabs')) {
            return {
              status: 'not_configured',
              lastCheck: new Date()
            };
          }
          
          return {
            status: 'unknown',
            lastCheck: new Date()
          };

        default:
          return {
            status: 'unknown',
            lastCheck: new Date()
          };
      }
    } catch (error: any) {
      return {
        status: 'error',
        responseTime: Date.now() - startTime,
        lastError: error.message,
        lastCheck: new Date()
      };
    }
  }, []);

  const checkAllServices = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const serviceConfigs = environment.getServiceConfigs();
      const healthChecks = await Promise.all(
        serviceConfigs.map(async (service) => {
          const healthStatus = await checkServiceHealth(service.name);
          return {
            ...service,
            ...healthStatus,
            isChecking: false
          };
        })
      );
      
      setServices(healthChecks);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error checking service health:', error);
    } finally {
      setIsLoading(false);
    }
  }, [checkServiceHealth]);

  const checkSingleService = useCallback(async (serviceName: string) => {
    setServices(prev => prev.map(service => 
      service.name === serviceName 
        ? { ...service, isChecking: true }
        : service
    ));

    const healthStatus = await checkServiceHealth(serviceName);
    
    setServices(prev => prev.map(service => 
      service.name === serviceName 
        ? { ...service, ...healthStatus, isChecking: false }
        : service
    ));
  }, [checkServiceHealth]);

  const getCriticalServices = useCallback(() => {
    return services.filter(service => service.isCritical);
  }, [services]);

  const getOptionalServices = useCallback(() => {
    return services.filter(service => !service.isCritical);
  }, [services]);

  const getHealthyServices = useCallback(() => {
    return services.filter(service => service.status === 'healthy');
  }, [services]);

  const getUnhealthyServices = useCallback(() => {
    return services.filter(service => service.status === 'error');
  }, [services]);

  const hasAllCriticalServices = useCallback(() => {
    const critical = getCriticalServices();
    return critical.length > 0 && critical.every(service => service.status === 'healthy');
  }, [getCriticalServices]);

  useEffect(() => {
    checkAllServices();
    
    // Set up periodic health checks every 5 minutes
    const interval = setInterval(checkAllServices, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkAllServices]);

  return {
    services,
    isLoading,
    lastUpdated,
    checkAllServices,
    checkSingleService,
    getCriticalServices,
    getOptionalServices,
    getHealthyServices,
    getUnhealthyServices,
    hasAllCriticalServices
  };
};