import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Settings, 
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';
import { useServiceHealth, type ServiceHealthStatus } from '@/hooks/useServiceHealth';
import { environment } from '@/config/environment';

const ServiceConfigurationPanel: React.FC = () => {
  const {
    services,
    isLoading,
    lastUpdated,
    checkAllServices,
    checkSingleService,
    getCriticalServices,
    getOptionalServices,
    hasAllCriticalServices
  } = useServiceHealth();

  const getStatusIcon = (status: ServiceHealthStatus['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'not_configured':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: ServiceHealthStatus['status'], isCritical: boolean) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
        return isCritical 
          ? 'bg-red-100 text-red-800 border-red-200'
          : 'bg-orange-100 text-orange-800 border-orange-200';
      case 'not_configured':
        return isCritical
          ? 'bg-red-100 text-red-800 border-red-200'
          : 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getServiceDocLink = (serviceName: string) => {
    const links = {
      supabase: 'https://supabase.com/docs',
      openai: 'https://platform.openai.com/docs',
      elevenLabs: 'https://elevenlabs.io/docs',
      colorServices: 'https://huemint.com/docs',
      analytics: '#',
      surveysparrow: 'https://docs.surveysparrow.com'
    };
    return links[serviceName as keyof typeof links] || '#';
  };

  const criticalServices = getCriticalServices();
  const optionalServices = getOptionalServices();

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Overview Card */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Service Configuration Overview
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkAllServices}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh All
            </Button>
          </div>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{services.length}</div>
              <div className="text-sm text-blue-700">Total Services</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {services.filter(s => s.status === 'healthy').length}
              </div>
              <div className="text-sm text-green-700">Healthy</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {services.filter(s => s.status === 'error' || (s.isCritical && s.status === 'not_configured')).length}
              </div>
              <div className="text-sm text-red-700">Issues</div>
            </div>
          </div>

          {!hasAllCriticalServices() && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Configuration Required</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                Some critical services are not properly configured. Please check the critical services section below.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Critical Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-700">Critical Services</CardTitle>
          <p className="text-sm text-muted-foreground">
            These services are required for core functionality
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {criticalServices.map((service) => (
            <ServiceCard 
              key={service.name}
              service={service}
              onRefresh={() => checkSingleService(service.name)}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              getServiceDocLink={getServiceDocLink}
            />
          ))}
        </CardContent>
      </Card>

      {/* Optional Services */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700">Optional Services</CardTitle>
          <p className="text-sm text-muted-foreground">
            These services provide enhanced functionality
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {optionalServices.map((service) => (
            <ServiceCard 
              key={service.name}
              service={service}
              onRefresh={() => checkSingleService(service.name)}
              getStatusIcon={getStatusIcon}
              getStatusColor={getStatusColor}
              getServiceDocLink={getServiceDocLink}
            />
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface ServiceCardProps {
  service: ServiceHealthStatus;
  onRefresh: () => void;
  getStatusIcon: (status: ServiceHealthStatus['status']) => React.ReactNode;
  getStatusColor: (status: ServiceHealthStatus['status'], isCritical: boolean) => string;
  getServiceDocLink: (serviceName: string) => string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onRefresh,
  getStatusIcon,
  getStatusColor,
  getServiceDocLink
}) => {
  return (
    <motion.div
      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-4">
        {getStatusIcon(service.status)}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium capitalize">{service.name}</h3>
            <Badge className={getStatusColor(service.status, service.isCritical)}>
              {service.status === 'not_configured' ? 'Not Configured' : service.status}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {service.status === 'healthy' && service.responseTime && (
              <span>Response: {service.responseTime}ms</span>
            )}
            {service.lastError && (
              <span className="text-red-600">Error: {service.lastError}</span>
            )}
            {service.lastCheck && (
              <span className="ml-2">
                Last checked: {service.lastCheck.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={service.isChecking}
        >
          <RefreshCw className={`w-4 h-4 ${service.isChecking ? 'animate-spin' : ''}`} />
        </Button>
        
        {getServiceDocLink(service.name) !== '#' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(getServiceDocLink(service.name), '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        )}

        {service.status === 'not_configured' && (
          <Button
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            <Settings className="w-4 h-4 mr-1" />
            Configure
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default ServiceConfigurationPanel;