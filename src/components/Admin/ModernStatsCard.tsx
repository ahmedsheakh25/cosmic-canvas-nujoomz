
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ModernStatsCardProps {
  titleKey: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: 'green' | 'blue' | 'orange' | 'red' | 'purple';
  description?: string;
  className?: string;
}

const ModernStatsCard: React.FC<ModernStatsCardProps> = ({
  titleKey,
  value,
  icon: Icon,
  trend,
  color = 'green',
  description,
  className = ''
}) => {
  const { t } = useLanguage();

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

  const classes = colorClasses[color];

  return (
    <motion.div
      className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
      whileHover={{ y: -2, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${classes.bg} rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${classes.icon}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.direction === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {trend.value}%
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="text-2xl font-bold text-gray-900">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className="text-sm font-medium text-gray-600">
          {t(titleKey) || titleKey}
        </div>
        {description && (
          <div className="text-xs text-gray-500">
            {description}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ModernStatsCard;
