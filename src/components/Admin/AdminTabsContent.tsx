
import React from 'react';
import EnhancedProjectBriefsTable from './EnhancedProjectBriefsTable';
import DashboardOverview from './DashboardOverview';
import ActivityLog from './ActivityLog';
import TeamManagement from './TeamManagement';
import RealTimeAnalytics from './RealTimeAnalytics';
import FeatureManagement from './FeatureManagement';
import PersonaProfiles from './PersonaProfiles';
import DeveloperTools from './DeveloperTools';
import RoleManagement from './RoleManagement';
import KnowledgeBaseManagement from './KnowledgeBaseManagement';

interface DashboardStats {
  totalBriefs: number;
  newBriefs: number;
  underReview: number;
  completed: number;
  inProgress: number;
  needClarification: number;
}

interface AdminTabsContentProps {
  stats: DashboardStats;
  loading: boolean;
  hasAdminAccess: boolean;
  hasModeratorAccess: boolean;
  onRefresh: () => void;
  activeTab: string;
}

const AdminTabsContent: React.FC<AdminTabsContentProps> = ({ 
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
          <DashboardOverview 
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
        return <DeveloperTools />;

      case 'activity':
        return <ActivityLog />;

      default:
        return (
          <DashboardOverview 
            stats={stats} 
            loading={loading} 
            onRefresh={onRefresh} 
          />
        );
    }
  };

  return (
    <div className="fade-in-up">
      {renderTabContent()}
    </div>
  );
};

export default AdminTabsContent;
