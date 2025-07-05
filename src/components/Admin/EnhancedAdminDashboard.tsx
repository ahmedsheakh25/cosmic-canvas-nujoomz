import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import ModernAdminHeader from './ModernAdminHeader';
import ModernAdminSidebar from './ModernAdminSidebar';
import ModernDashboardOverview from './ModernDashboardOverview';
import EnhancedProjectBriefsTable from './EnhancedProjectBriefsTable';
import RealTimeAnalytics from './RealTimeAnalytics';
import TeamManagement from './TeamManagement';
import RoleManagement from './RoleManagement';
import FeatureManagement from './FeatureManagement';
import KnowledgeBaseManagement from './KnowledgeBaseManagement';
import IntegratedDeveloperTools from './IntegratedDeveloperTools';
import ActivityLog from './ActivityLog';

interface ModernEnhancedAdminDashboardProps {
  user: User;
  onSignOut: () => void;
}

const ModernEnhancedAdminDashboard: React.FC<ModernEnhancedAdminDashboardProps> = ({ 
  user, 
  onSignOut 
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const {
    userRole,
    hasAdminAccess,
    hasModeratorAccess,
    loading: authLoading
  } = useAdminAuth();

  const {
    stats,
    loading: statsLoading,
    fetchDashboardStats,
    error: statsError
  } = useAdminDashboard(user);

  const handleRefresh = async () => {
    toast.promise(fetchDashboardStats(), {
      loading: 'Refreshing dashboard data...',
      success: 'Dashboard updated successfully!',
      error: 'Failed to refresh data'
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ModernDashboardOverview 
            stats={stats}
            loading={statsLoading}
            onRefresh={handleRefresh}
          />
        );

      case 'briefs':
        return <EnhancedProjectBriefsTable onStatsUpdate={fetchDashboardStats} />;

      case 'analytics':
        return <RealTimeAnalytics />;

      case 'team':
        return <TeamManagement />;

      case 'users':
        return <TeamManagement />;

      case 'roles':
        return hasAdminAccess ? <RoleManagement /> : null;

      case 'features':
        return <FeatureManagement />;

      case 'knowledge':
        return hasModeratorAccess ? <KnowledgeBaseManagement /> : null;

      case 'developer':
        return <IntegratedDeveloperTools />;

      case 'activity':
        return <ActivityLog />;

      case 'monitoring':
        return <RealTimeAnalytics />;

      default:
        return (
          <ModernDashboardOverview 
            stats={stats}
            loading={statsLoading}
            onRefresh={handleRefresh}
          />
        );
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 flex w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Sidebar */}
      <ModernAdminSidebar
        hasAdminAccess={hasAdminAccess}
        hasModeratorAccess={hasModeratorAccess}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={stats}
        loading={statsLoading}
      />

      {/* Main Content with animations */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <ModernAdminHeader
          user={user}
          userRole={userRole}
          activeTab={activeTab}
          onRefresh={handleRefresh}
          onSignOut={onSignOut}
          loading={statsLoading}
          error={statsError}
        />
        <div className="p-6">
          {renderTabContent()}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModernEnhancedAdminDashboard;
