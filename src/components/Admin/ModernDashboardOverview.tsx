import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  RefreshCw, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  TrendingUp,
  Activity,
  Eye,
  Zap,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ModernStatsCard from './ModernStatsCard';

interface DashboardStats {
  totalBriefs: number;
  newBriefs: number;
  underReview: number;
  completed: number;
  inProgress: number;
  needClarification: number;
  totalUsers: number;
}

interface ModernDashboardOverviewProps {
  stats: DashboardStats;
  loading: boolean;
  error?: string | null;
  onRefresh: () => void;
}

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

const ModernStatsCard: React.FC<ModernStatsCardProps> = ({
  titleKey,
  value,
  icon: Icon,
  color = 'green',
  trend,
  description,
  loading = false
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
            <h3 className="text-sm font-medium text-gray-600">
              {t(titleKey)}
            </h3>
            <p className="text-xs text-gray-500">
              {description}
            </p>
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
    </div>
  );
};

const ModernDashboardOverview: React.FC<ModernDashboardOverviewProps> = ({
  stats,
  loading,
  error,
  onRefresh
}) => {
  const { t } = useLanguage();

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          onClick={onRefresh} 
          variant="outline"
          className="w-full"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard.welcome')}
          </h1>
          <p className="text-gray-600">
            {t('dashboard.overview')} - Professional management interface
          </p>
        </div>
        <Button 
          onClick={onRefresh} 
          disabled={loading}
          className={cn(
            'bg-green-600 hover:bg-green-700 text-white shadow-sm',
            { 'opacity-50 cursor-not-allowed': loading }
          )}
        >
          <RefreshCw className={cn(
            'w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0',
            { 'animate-spin': loading }
          )} />
          {t('actions.refresh')}
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernStatsCard
          titleKey="metrics.totalProjects"
          value={stats.totalBriefs}
          icon={FileText}
          color="purple"
          loading={loading}
          description={t('metrics.totalProjectsDesc')}
        />
        
        <ModernStatsCard
          titleKey="metrics.newRequests"
          value={stats.newBriefs}
          icon={AlertCircle}
          color="blue"
          loading={loading}
          trend={{ value: 8, direction: 'up' }}
          description={t('metrics.newRequestsDesc')}
        />
        
        <ModernStatsCard
          titleKey="metrics.inProgress"
          value={stats.inProgress}
          icon={Clock}
          color="orange"
          loading={loading}
          trend={{ value: 3, direction: 'down' }}
          description={t('metrics.inProgressDesc')}
        />
        
        <ModernStatsCard
          titleKey="metrics.completed"
          value={stats.completed}
          icon={CheckCircle}
          color="green"
          loading={loading}
          trend={{ value: 15, direction: 'up' }}
          description={t('metrics.completedDesc')}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ModernStatsCard
          titleKey="metrics.underReview"
          value={stats.underReview}
          icon={Eye}
          color="blue"
          loading={loading}
          description={t('metrics.underReviewDesc')}
        />
        
        <ModernStatsCard
          titleKey="metrics.needClarification"
          value={stats.needClarification}
          icon={AlertCircle}
          color="orange"
          loading={loading}
          description={t('metrics.needClarificationDesc')}
        />
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModernStatsCard
          titleKey="metrics.totalUsers"
          value={stats.totalUsers}
          icon={Users}
          color="green"
          loading={loading}
          description={t('metrics.totalUsersDesc')}
        />
        
        <ModernStatsCard
          titleKey="metrics.activeUsers"
          value={stats.totalUsers * 0.7}
          icon={Activity}
          color="purple"
          loading={loading}
          trend={{ value: 12, direction: 'up' }}
          description={t('metrics.activeUsersDesc')}
        />
        
        <ModernStatsCard
          titleKey="metrics.userGrowth"
          value={25}
          icon={TrendingUp}
          color="blue"
          loading={loading}
          trend={{ value: 25, direction: 'up' }}
          description={t('metrics.userGrowthDesc')}
        />
      </div>
    </div>
  );
};

export default ModernDashboardOverview;
