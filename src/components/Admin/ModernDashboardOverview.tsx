
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import ModernStatsCard from './ModernStatsCard';
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

interface DashboardStats {
  totalBriefs: number;
  newBriefs: number;
  underReview: number;
  completed: number;
  inProgress: number;
  needClarification: number;
  totalUsers: number;
  activeConversations: number;
}

interface ModernDashboardOverviewProps {
  stats: DashboardStats;
  loading: boolean;
  onRefresh: () => void;
}

const ModernDashboardOverview: React.FC<ModernDashboardOverviewProps> = ({
  stats,
  loading,
  onRefresh
}) => {
  const { t } = useLanguage();

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
          className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 ${loading ? 'animate-spin' : ''}`} />
          {t('actions.refresh')}
        </Button>
      </motion.div>

      {/* Primary Metrics Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-green-600" />
          Project Analytics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ModernStatsCard
            titleKey="metrics.totalProjects"
            value={stats.totalBriefs}
            icon={FileText}
            color="green"
            trend={{ value: 12, direction: 'up' }}
            description="All project submissions"
          />
          
          <ModernStatsCard
            titleKey="metrics.activeProjects"
            value={stats.newBriefs}
            icon={AlertCircle}
            color="blue"
            trend={{ value: 8, direction: 'up' }}
            description="Awaiting review"
          />
          
          <ModernStatsCard
            titleKey="metrics.completedProjects"
            value={stats.inProgress}
            icon={Clock}
            color="orange"
            trend={{ value: 3, direction: 'down' }}
            description="Currently active"
          />
          
          <ModernStatsCard
            titleKey="metrics.completedProjects"
            value={stats.completed}
            icon={CheckCircle}
            color="green"
            trend={{ value: 15, direction: 'up' }}
            description="Successfully delivered"
          />
        </div>
      </div>

      {/* User Management Metrics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
          <Users className="w-6 h-6 text-green-600" />
          User Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ModernStatsCard
            titleKey="metrics.totalUsers"
            value={stats.totalUsers}
            icon={Users}
            color="blue"
            description="Registered platform users"
          />
          
          <ModernStatsCard
            titleKey="metrics.activeUsers"
            value={stats.activeConversations}
            icon={Activity}
            color="green"
            description="Active in last 24h"
          />
          
          <ModernStatsCard
            titleKey="metrics.pendingReview"
            value={stats.needClarification}
            icon={Eye}
            color="orange"
            description="Requiring attention"
          />
        </div>
      </div>

      {/* System Performance */}
      <motion.div 
        className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
          <Zap className="w-6 h-6 text-green-600" />
          System Performance Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div 
            className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-3xl font-bold text-green-700 mb-2">
              {stats.totalBriefs > 0 ? Math.round((stats.completed / stats.totalBriefs) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-3xl font-bold text-blue-700 mb-2">
              {stats.newBriefs + stats.inProgress}
            </div>
            <div className="text-sm text-gray-600">Active Pipeline</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-3xl font-bold text-orange-700 mb-2">
              {stats.needClarification + stats.underReview}
            </div>
            <div className="text-sm text-gray-600">Need Attention</div>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-3xl font-bold text-purple-700 mb-2">
              {stats.activeConversations > 0 ? Math.round((stats.activeConversations / Math.max(stats.totalUsers, 1)) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Engagement Rate</div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ModernDashboardOverview;
