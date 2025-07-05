
import React, { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, BarChart3, FileText, Activity } from 'lucide-react';
import ProjectBriefsTable from './ProjectBriefsTable';
import DashboardOverview from './DashboardOverview';
import ActivityLog from './ActivityLog';

interface AdminDashboardProps {
  user: User;
  onSignOut: () => void;
}

interface DashboardStats {
  totalBriefs: number;
  newBriefs: number;
  underReview: number;
  completed: number;
  inProgress: number;
  needClarification: number;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onSignOut }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBriefs: 0,
    newBriefs: 0,
    underReview: 0,
    completed: 0,
    inProgress: 0,
    needClarification: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data: briefs, error } = await supabase
        .from('project_briefs')
        .select('status');

      if (error) throw error;

      const totalBriefs = briefs?.length || 0;
      const newBriefs = briefs?.filter(b => b.status === 'New').length || 0;
      const underReview = briefs?.filter(b => b.status === 'Under Review').length || 0;
      const completed = briefs?.filter(b => b.status === 'Completed').length || 0;
      const inProgress = briefs?.filter(b => b.status === 'In Progress').length || 0;
      const needClarification = briefs?.filter(b => b.status === 'Need Clarification').length || 0;

      setStats({
        totalBriefs,
        newBriefs,
        underReview,
        completed,
        inProgress,
        needClarification
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-lg">🛸</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">OfSpace Admin</h1>
                <p className="text-sm text-gray-500">Nujmooz Assistant Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={onSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="briefs" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Project Briefs</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Activity Log</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview stats={stats} loading={loading} onRefresh={fetchDashboardStats} />
          </TabsContent>

          <TabsContent value="briefs">
            <ProjectBriefsTable onStatsUpdate={fetchDashboardStats} />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityLog />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
