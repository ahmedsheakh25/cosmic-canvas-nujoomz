
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, FileText, Clock, CheckCircle, AlertCircle, Users, TrendingUp } from 'lucide-react';
import CosmicStatsCard from './CosmicStatsCard';

interface DashboardStats {
  totalBriefs: number;
  newBriefs: number;
  underReview: number;
  completed: number;
  inProgress: number;
  needClarification: number;
}

interface DashboardOverviewProps {
  stats: DashboardStats;
  loading: boolean;
  onRefresh: () => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats, loading, onRefresh }) => {
  return (
    <div className="space-y-8 fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold cosmic-gradient bg-clip-text text-transparent mb-2">
            Dashboard Overview
          </h2>
          <p className="text-gray-600">
            Monitor your OfSpace Studio projects and team performance
          </p>
        </div>
        <Button 
          onClick={onRefresh} 
          className="cosmic-button text-white border-none hover:shadow-lg"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <CosmicStatsCard
          title="Total Projects"
          value={stats.totalBriefs}
          icon={FileText}
          color="purple"
          trend={{ value: 12, direction: 'up' }}
          description="All project briefs received"
        />
        
        <CosmicStatsCard
          title="New Requests"
          value={stats.newBriefs}
          icon={AlertCircle}
          color="blue"
          trend={{ value: 8, direction: 'up' }}
          description="Awaiting initial review"
        />
        
        <CosmicStatsCard
          title="In Progress"
          value={stats.inProgress}
          icon={Clock}
          color="orange"
          trend={{ value: 3, direction: 'down' }}
          description="Currently being worked on"
        />
        
        <CosmicStatsCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          color="green"
          trend={{ value: 15, direction: 'up' }}
          description="Successfully delivered"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CosmicStatsCard
          title="Under Review"
          value={stats.underReview}
          icon={Users}
          color="purple"
          description="Projects being evaluated by the team"
          className="col-span-1"
        />
        
        <CosmicStatsCard
          title="Need Clarification"
          value={stats.needClarification}
          icon={TrendingUp}
          color="red"
          description="Awaiting client feedback"
          className="col-span-1"
        />
      </div>

      {/* Quick Insights */}
      <div className="dashboard-card rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
            <div className="text-2xl font-bold cosmic-gradient bg-clip-text text-transparent">
              {stats.totalBriefs > 0 ? Math.round((stats.completed / stats.totalBriefs) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-cyan-50 rounded-lg">
            <div className="text-2xl font-bold cosmic-gradient bg-clip-text text-transparent">
              {stats.newBriefs + stats.inProgress}
            </div>
            <div className="text-sm text-gray-600">Active Projects</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
            <div className="text-2xl font-bold cosmic-gradient bg-clip-text text-transparent">
              {stats.needClarification}
            </div>
            <div className="text-sm text-gray-600">Need Attention</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
