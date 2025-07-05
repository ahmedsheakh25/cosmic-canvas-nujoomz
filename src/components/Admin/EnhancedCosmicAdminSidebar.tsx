
import React from 'react';
import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import EnhancedSidebarHeader from './components/EnhancedSidebarHeader';
import EnhancedNavigationMenu from './components/EnhancedNavigationMenu';
import EnhancedSidebarFooter from './components/EnhancedSidebarFooter';

interface EnhancedCosmicAdminSidebarProps {
  user: User;
  userRole: string | null;
  hasAdminAccess: boolean;
  hasModeratorAccess: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats: {
    newBriefs: number;
  };
}

const EnhancedCosmicAdminSidebar: React.FC<EnhancedCosmicAdminSidebarProps> = ({
  user,
  userRole,
  hasAdminAccess,
  hasModeratorAccess,
  activeTab,
  onTabChange,
  stats
}) => {
  return (
    <motion.div 
      className="admin-sidebar w-72 h-screen sticky top-0 flex flex-col"
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <EnhancedSidebarHeader user={user} userRole={userRole} />
      
      <EnhancedNavigationMenu
        hasAdminAccess={hasAdminAccess}
        hasModeratorAccess={hasModeratorAccess}
        activeTab={activeTab}
        onTabChange={onTabChange}
        stats={stats}
      />
      
      <EnhancedSidebarFooter />
    </motion.div>
  );
};

export default EnhancedCosmicAdminSidebar;
