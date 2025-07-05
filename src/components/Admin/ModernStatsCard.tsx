import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ModernStatsCardProps {
  titleKey: string;
  value: number;
  icon: React.ElementType;
  color?: 'green' | 'blue' | 'orange' | 'red' | 'purple';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  description?: string;
  loading?: boolean;
}

const colorClasses = {
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    accent: 'border-green-200',
    trend: 'text-green-600'
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    accent: 'border-blue-200',
    trend: 'text-blue-600'
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'text-orange-600',
    accent: 'border-orange-200',
    trend: 'text-orange-600'
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    accent: 'border-red-200',
    trend: 'text-red-600'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    accent: 'border-purple-200',
    trend: 'text-purple-600'
  }
};

const ModernStatsCard: React.FC<ModernStatsCardProps> = React.memo(({
  titleKey,
  value,
  icon: Icon,
  color = 'green',
  trend,
  description,
  loading = false
}) => {
  const { t } = useLanguage();
  const classes = colorClasses[color];

  if (loading) {
    return (
      <div className={cn(
        'p-6 rounded-xl border shadow-sm',
        classes.bg,
        classes.accent
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              classes.bg
            )}>
              <Icon className={cn('w-6 h-6', classes.icon)} />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-6 w-16" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className={cn(
        'p-6 rounded-xl border shadow-sm',
        classes.bg,
        classes.accent
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            classes.bg
          )}>
            <Icon className={cn('w-6 h-6', classes.icon)} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600">
              {t(titleKey)}
            </h3>
            {description && (
              <p className="text-xs text-gray-500">
                {description}
              </p>
            )}
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900">
          {value}
          {trend && (
            <span className={cn(
              'text-sm ml-2',
              trend.direction === 'up' ? classes.trend : 'text-red-600'
            )}>
              {trend.direction === 'up' ? '+' : '-'}{trend.value}%
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memoization
  return (
    prevProps.value === nextProps.value &&
    prevProps.loading === nextProps.loading &&
    prevProps.titleKey === nextProps.titleKey &&
    prevProps.color === nextProps.color &&
    JSON.stringify(prevProps.trend) === JSON.stringify(nextProps.trend)
  );
});

ModernStatsCard.displayName = 'ModernStatsCard';

export default ModernStatsCard;
