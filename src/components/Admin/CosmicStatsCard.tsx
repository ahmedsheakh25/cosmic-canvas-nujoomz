
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CosmicStatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  description?: string;
  color?: 'purple' | 'blue' | 'green' | 'orange' | 'red';
  className?: string;
}

const CosmicStatsCard: React.FC<CosmicStatsCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  description,
  color = 'purple',
  className = ''
}) => {
  const getColorClasses = (color: string) => {
    const colors = {
      purple: {
        bg: 'bg-gradient-to-br from-purple-500/10 to-purple-600/10',
        icon: 'bg-gradient-to-br from-purple-500 to-purple-600',
        border: 'border-purple-200',
        text: 'text-purple-600'
      },
      blue: {
        bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/10',
        icon: 'bg-gradient-to-br from-blue-500 to-blue-600',
        border: 'border-blue-200',
        text: 'text-blue-600'
      },
      green: {
        bg: 'bg-gradient-to-br from-green-500/10 to-green-600/10',
        icon: 'bg-gradient-to-br from-green-500 to-green-600',
        border: 'border-green-200',
        text: 'text-green-600'
      },
      orange: {
        bg: 'bg-gradient-to-br from-orange-500/10 to-orange-600/10',
        icon: 'bg-gradient-to-br from-orange-500 to-orange-600',
        border: 'border-orange-200',
        text: 'text-orange-600'
      },
      red: {
        bg: 'bg-gradient-to-br from-red-500/10 to-red-600/10',
        icon: 'bg-gradient-to-br from-red-500 to-red-600',
        border: 'border-red-200',
        text: 'text-red-600'
      }
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-3 h-3" />;
      case 'down':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up':
        return 'text-green-600 bg-green-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const colorClasses = getColorClasses(color);

  return (
    <Card className={`dashboard-card scale-in ${colorClasses.bg} ${colorClasses.border} ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl ${colorClasses.icon} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <Badge className={`flex items-center space-x-1 ${getTrendColor(trend.direction)}`}>
              {getTrendIcon(trend.direction)}
              <span className="text-xs font-medium">{Math.abs(trend.value)}%</span>
            </Badge>
          )}
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${colorClasses.text}`}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {description && (
            <p className="text-xs text-gray-500">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CosmicStatsCard;
