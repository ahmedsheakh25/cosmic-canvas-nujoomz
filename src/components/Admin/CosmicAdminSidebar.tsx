
import React from 'react';
import { User } from '@supabase/supabase-js';
import CosmicSidebarHeader from './CosmicSidebarHeader';
import CosmicSidebarNavigation from './CosmicSidebarNavigation';
import CosmicSidebarFooter from './CosmicSidebarFooter';

interface CosmicAdminSidebarProps {
  user: User;
  userRole: string | null;
  hasAdminAccess: boolean;
  hasModeratorAccess: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats: {
    totalBriefs: number;
    newBriefs: number;
    underReview: number;
    completed: number;
    inProgress: number;
    needClarification: number;
  };
}

const CosmicAdminSidebar: React.FC<CosmicAdminSidebarProps> = ({
  user,
  userRole,
  hasAdminAccess,
  hasModeratorAccess,
  activeTab,
  onTabChange,
  stats
}) => {
  return (
    <div className="admin-sidebar w-72 h-screen sticky top-0 flex flex-col">
      <CosmicSidebarHeader user={user} userRole={userRole} />
      
      <CosmicSidebarNavigation
        hasAdminAccess={hasAdminAccess}
        hasModeratorAccess={hasModeratorAccess}
        activeTab={activeTab}
        onTabChange={onTabChange}
        stats={stats}
      />
      
      <CosmicSidebarFooter />
    </div>
  );
};

export default CosmicAdminSidebar;
