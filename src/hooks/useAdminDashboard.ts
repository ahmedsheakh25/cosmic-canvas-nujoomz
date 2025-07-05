import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

export const useAdminDashboard = (user: User | null) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBriefs: 0,
    newBriefs: 0,
    underReview: 0,
    completed: 0,
    inProgress: 0,
    needClarification: 0,
    totalUsers: 0,
    activeConversations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch project briefs with actual database statuses
      const { data: briefs, error: briefsError } = await supabase
        .from('project_briefs')
        .select('status');

      if (briefsError) {
        console.error('Error fetching briefs:', briefsError);
        throw new Error(`Failed to fetch project briefs: ${briefsError.message}`);
      }

      // Fetch users count
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id');

      if (usersError) {
        console.warn('Error fetching users count:', usersError);
      }

      // Fetch active conversations
      const { data: conversations, error: conversationsError } = await supabase
        .from('chat_conversations')
        .select('session_id')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (conversationsError) {
        console.warn('Error fetching conversations:', conversationsError);
      }

      const totalBriefs = briefs?.length || 0;
      const newBriefs = briefs?.filter(b => b.status === 'New').length || 0;
      const underReview = briefs?.filter(b => b.status === 'Under Review').length || 0;
      const completed = briefs?.filter(b => b.status === 'Completed').length || 0;
      const inProgress = briefs?.filter(b => b.status === 'In Progress').length || 0;
      const needClarification = briefs?.filter(b => b.status === 'Need Clarification').length || 0;
      
      const totalUsers = users?.length || 0;
      const activeConversations = new Set(conversations?.map(c => c.session_id)).size || 0;

      setStats({
        totalBriefs,
        newBriefs,
        underReview,
        completed,
        inProgress,
        needClarification,
        totalUsers,
        activeConversations
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load dashboard statistics';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      console.log('No user provided to dashboard hook');
      setLoading(false);
      return;
    }

    console.log('Initializing dashboard for user:', user.id);
    setError(null);
    setLoading(true);
    
    fetchDashboardStats();
  }, [user?.id]);

  return {
    stats,
    loading,
    fetchDashboardStats,
    error
  };
};
