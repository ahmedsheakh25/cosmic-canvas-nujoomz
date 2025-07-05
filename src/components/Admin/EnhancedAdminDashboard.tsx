
import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import EnhancedCosmicAdminSidebar from './EnhancedCosmicAdminSidebar';
import CosmicMainContent from './CosmicMainContent';
import EnhancedAdminTabsContent from './EnhancedAdminTabsContent';
import { adminAnimations } from './animations/AdminAnimations';

interface EnhancedAdminDashboardProps {
  user: User;
  onSignOut: () => void;
}

const EnhancedAdminDashboard: React.FC<EnhancedAdminDashboardProps> = ({ user, onSignOut }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    userRole,
    hasAdminAccess,
    hasModeratorAccess,
    error: authError
  } = useAdminAuth();

  const {
    stats,
    fetchDashboardStats,
    error: statsError
  } = useAdminDashboard(user);

  const handleRefresh = async () => {
    toast.promise(fetchDashboardStats(), {
      loading: 'Refreshing dashboard data...',
      success: 'Dashboard data updated successfully!',
      error: 'Failed to refresh dashboard data'
    });
  };

  // TEMPORARY: Skip error state check - all authenticated users have access
  return (
    <motion.div 
      className="min-h-screen bg-gray-50 flex w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Sidebar */}
      <EnhancedCosmicAdminSidebar
        user={user}
        userRole={userRole}
        hasAdminAccess={hasAdminAccess}
        hasModeratorAccess={hasModeratorAccess}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={stats}
      />

      {/* Main Content with animations */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <CosmicMainContent
          user={user}
          userRole={userRole}
          activeTab={activeTab}
          onRefresh={handleRefresh}
          onSignOut={onSignOut}
        >
          <EnhancedAdminTabsContent 
            stats={stats}
            loading={false}
            hasAdminAccess={hasAdminAccess}
            hasModeratorAccess={hasModeratorAccess}
            onRefresh={fetchDashboardStats}
            activeTab={activeTab}
          />
        </CosmicMainContent>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedAdminDashboard;
