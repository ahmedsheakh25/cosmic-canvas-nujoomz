
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import EnhancedProjectBriefsTable from './EnhancedProjectBriefsTable';
import EnhancedDashboardOverview from './EnhancedDashboardOverview';
import ActivityLog from './ActivityLog';
import TeamManagement from './TeamManagement';
import RealTimeAnalytics from './RealTimeAnalytics';
import FeatureManagement from './FeatureManagement';
import PersonaProfiles from './PersonaProfiles';
import IntegratedDeveloperTools from './IntegratedDeveloperTools';
import RoleManagement from './RoleManagement';
import KnowledgeBaseManagement from './KnowledgeBaseManagement';
import { AnimatedTabContent } from './animations/AdminAnimations';

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

interface EnhancedAdminTabsContentProps {
  stats: DashboardStats;
  loading: boolean;
  hasAdminAccess: boolean;
  hasModeratorAccess: boolean;
  onRefresh: () => void;
  activeTab: string;
}

const EnhancedAdminTabsContent: React.FC<EnhancedAdminTabsContentProps> = ({ 
  stats, 
  loading, 
  hasAdminAccess, 
  hasModeratorAccess, 
  onRefresh,
  activeTab
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <EnhancedDashboardOverview 
            stats={stats} 
            loading={loading} 
            onRefresh={onRefresh} 
          />
        );

      case 'briefs':
        return <EnhancedProjectBriefsTable onStatsUpdate={onRefresh} />;

      case 'analytics':
        return <RealTimeAnalytics />;

      case 'team':
        return (
          <div className="space-y-6">
            <TeamManagement />
            <PersonaProfiles />
          </div>
        );

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

      default:
        return (
          <EnhancedDashboardOverview 
            stats={stats} 
            loading={loading} 
            onRefresh={onRefresh} 
          />
        );
    }
  };

  return (
    <AnimatedTabContent key={activeTab}>
      {renderTabContent()}
    </AnimatedTabContent>
  );
};

export default EnhancedAdminTabsContent;
