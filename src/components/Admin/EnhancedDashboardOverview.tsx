
import React from 'react';
import { AnimatedPage } from './animations/AdminAnimations';
import DashboardWelcomeHeader from './DashboardWelcomeHeader';
import ProjectStatusMetrics from './ProjectStatusMetrics';
import ReviewStatusMetrics from './ReviewStatusMetrics';
import UserActivityMetrics from './UserActivityMetrics';
import QuickInsightsPanel from './QuickInsightsPanel';

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

interface EnhancedDashboardOverviewProps {
  stats: DashboardStats;
  loading: boolean;
  onRefresh: () => void;
}

const EnhancedDashboardOverview: React.FC<EnhancedDashboardOverviewProps> = ({ 
  stats, 
  loading, 
  onRefresh 
}) => {
  return (
    <AnimatedPage className="space-y-8">
      <DashboardWelcomeHeader 
        loading={loading}
        onRefresh={onRefresh}
      />

      <ProjectStatusMetrics
        totalBriefs={stats.totalBriefs}
        newBriefs={stats.newBriefs}
        inProgress={stats.inProgress}
        completed={stats.completed}
      />

      <ReviewStatusMetrics
        underReview={stats.underReview}
        needClarification={stats.needClarification}
      />

      <UserActivityMetrics
        totalUsers={stats.totalUsers}
        activeConversations={stats.activeConversations}
      />

      <QuickInsightsPanel
        totalBriefs={stats.totalBriefs}
        completed={stats.completed}
        newBriefs={stats.newBriefs}
        inProgress={stats.inProgress}
        needClarification={stats.needClarification}
        underReview={stats.underReview}
        activeConversations={stats.activeConversations}
        totalUsers={stats.totalUsers}
      />
    </AnimatedPage>
  );
};

export default EnhancedDashboardOverview;
