
import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ConnectionStatus } from '@/hooks/realtime/types';

interface VoiceConnectionStatusProps {
  status: ConnectionStatus;
  language: 'ar' | 'en';
  error?: string | null;
  className?: string;
}

const VoiceConnectionStatus: React.FC<VoiceConnectionStatusProps> = ({
  status,
  language,
  error,
  className = ''
}) => {
  const getStatusConfig = () => {
    const configs = {
      connected: {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        text: language === 'ar' ? 'متصل' : 'Connected',
        variant: 'default' as const,
        shouldAnimate: false
      },
      connecting: {
        icon: Loader2,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        text: language === 'ar' ? 'جاري الاتصال...' : 'Connecting...',
        variant: 'secondary' as const,
        shouldAnimate: true
      },
      reconnecting: {
        icon: Loader2,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        text: language === 'ar' ? 'إعادة الاتصال...' : 'Reconnecting...',
        variant: 'secondary' as const,
        shouldAnimate: true
      },
      error: {
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        text: language === 'ar' ? 'خطأ في الاتصال' : 'Connection Error',
        variant: 'destructive' as const,
        shouldAnimate: false
      },
      disconnected: {
        icon: WifiOff,
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        text: language === 'ar' ? 'غير متصل' : 'Disconnected',
        variant: 'outline' as const,
        shouldAnimate: false
      }
    };

    return configs[status] || configs.disconnected;
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <motion.div
        animate={config.shouldAnimate ? { rotate: 360 } : {}}
        transition={config.shouldAnimate ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
        className={config.color}
      >
        <Icon className="w-4 h-4" />
      </motion.div>
      
      <Badge variant={config.variant} className={`${config.bgColor} ${config.color}`}>
        {config.text}
      </Badge>
      
      {error && status === 'error' && (
        <div className="text-xs text-red-500 max-w-xs truncate" title={error}>
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceConnectionStatus;
