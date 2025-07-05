
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
    hasModeratorAccess
  } = useAdminAuth();

  const {
    stats,
    fetchDashboardStats
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
            loading={false}
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
            loading={false}
            onRefresh={handleRefresh}
          />
        );
    }
  };

  return (
    <LanguageProvider>
      <motion.div 
        className="min-h-screen bg-gray-50 flex w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Modern Sidebar */}
        <ModernAdminSidebar
          hasAdminAccess={hasAdminAccess}
          hasModeratorAccess={hasModeratorAccess}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          stats={stats}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Modern Header */}
          <ModernAdminHeader
            user={user}
            userRole={userRole}
            onSignOut={onSignOut}
            onRefresh={handleRefresh}
          />

          {/* Content Area */}
          <main className="flex-1 p-8 overflow-y-auto">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </main>
        </div>
      </motion.div>
    </LanguageProvider>
  );
};

export default ModernEnhancedAdminDashboard;
