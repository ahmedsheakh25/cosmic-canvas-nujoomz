import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useServiceHealth } from '@/hooks/useServiceHealth';

const ServiceHealthMonitor: React.FC = () => {
  const {
    services,
    isLoading,
    lastUpdated,
    checkAllServices,
    getCriticalServices,
    getHealthyServices,
    getUnhealthyServices,
    hasAllCriticalServices
  } = useServiceHealth();

  const healthyServices = getHealthyServices();
  const unhealthyServices = getUnhealthyServices();
  const criticalServices = getCriticalServices();

  const healthPercentage = services.length > 0 
    ? Math.round((healthyServices.length / services.length) * 100)
    : 0;

  const getHealthColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const averageResponseTime = healthyServices.length > 0
    ? Math.round(
        healthyServices
          .filter(s => s.responseTime)
          .reduce((sum, s) => sum + (s.responseTime || 0), 0) / 
        healthyServices.filter(s => s.responseTime).length
      )
    : 0;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Health Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            System Health Overview
          </CardTitle>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Overall Health */}
            <div className="text-center">
              <div className="mb-2">
                <div className="text-3xl font-bold text-blue-600">{healthPercentage}%</div>
                <div className="text-sm text-gray-600">System Health</div>
              </div>
              <Progress 
                value={healthPercentage} 
                className="h-2"
              />
              <div className="mt-2">
                <Badge className={`${getHealthColor(healthPercentage)} text-white`}>
                  {healthPercentage >= 80 ? 'Excellent' : 
                   healthPercentage >= 60 ? 'Good' : 'Needs Attention'}
                </Badge>
              </div>
            </div>

            {/* Response Time */}
            <div className="text-center p-4 bg-white rounded-lg border">
              <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold text-gray-900">
                {averageResponseTime}ms
              </div>
              <div className="text-sm text-gray-600">Avg Response</div>
            </div>

            {/* Healthy Services */}
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-green-700">
                {healthyServices.length}
              </div>
              <div className="text-sm text-green-600">Healthy</div>
            </div>

            {/* Issues */}
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold text-red-700">
                {unhealthyServices.length}
              </div>
              <div className="text-sm text-red-600">Issues</div>
            </div>
          </div>

          {/* Critical Status Alert */}
          {!hasAllCriticalServices() && (
            <motion.div
              className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">Critical Service Issues Detected</span>
              </div>
              <p className="text-sm text-red-700 mt-1">
                Some critical services are not functioning properly. Immediate attention required.
              </p>
              <Button 
                variant="destructive" 
                size="sm" 
                className="mt-2"
                onClick={checkAllServices}
              >
                Recheck All Services
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Service Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Real-time Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <ServiceStatusCard 
                key={service.name} 
                service={service}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={checkAllServices}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Refresh All Services
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.open('/admin/services', '_blank')}
              className="flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              View Detailed Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface ServiceStatusCardProps {
  service: any;
}

const ServiceStatusCard: React.FC<ServiceStatusCardProps> = ({ service }) => {
  const getStatusIcon = () => {
    switch (service.status) {
      case 'healthy':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (service.status) {
      case 'healthy':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  return (
    <motion.div
      className={`p-4 rounded-lg border ${getStatusColor()}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium capitalize">{service.name}</h3>
        {getStatusIcon()}
      </div>
      
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Status:</span>
          <Badge variant={service.status === 'healthy' ? 'default' : 'destructive'}>
            {service.status}
          </Badge>
        </div>
        
        {service.responseTime && (
          <div className="flex justify-between">
            <span>Response:</span>
            <span className="font-mono">{service.responseTime}ms</span>
          </div>
        )}
        
        {service.lastCheck && (
          <div className="flex justify-between">
            <span>Last Check:</span>
            <span className="text-xs">{service.lastCheck.toLocaleTimeString()}</span>
          </div>
        )}
        
        {service.isCritical && (
          <Badge variant="outline" className="text-xs">
            Critical
          </Badge>
        )}
      </div>
      
      {service.lastError && (
        <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-700">
          {service.lastError}
        </div>
      )}
    </motion.div>
  );
};

export default ServiceHealthMonitor;