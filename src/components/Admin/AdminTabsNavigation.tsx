
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, FileText, Activity, Users, Settings, Zap, Terminal, Shield, BookOpen } from 'lucide-react';

interface AdminTabsNavigationProps {
  hasAdminAccess: boolean;
  hasModeratorAccess: boolean;
}

const AdminTabsNavigation: React.FC<AdminTabsNavigationProps> = ({ hasAdminAccess, hasModeratorAccess }) => {
  return (
    <TabsList className="grid w-full grid-cols-9">
      <TabsTrigger value="overview" className="flex items-center space-x-2" data-tour="overview">
        <BarChart3 className="w-4 h-4" />
        <span>Overview</span>
      </TabsTrigger>
      <TabsTrigger value="briefs" className="flex items-center space-x-2" data-tour="briefs">
        <FileText className="w-4 h-4" />
        <span>Briefs</span>
      </TabsTrigger>
      <TabsTrigger value="analytics" className="flex items-center space-x-2" data-tour="analytics">
        <Zap className="w-4 h-4" />
        <span>Analytics</span>
      </TabsTrigger>
      <TabsTrigger value="team" className="flex items-center space-x-2" data-tour="team">
        <Users className="w-4 h-4" />
        <span>Team</span>
      </TabsTrigger>
      {hasAdminAccess && (
        <TabsTrigger value="roles" className="flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>Roles</span>
        </TabsTrigger>
      )}
      <TabsTrigger value="features" className="flex items-center space-x-2" data-tour="settings">
        <Settings className="w-4 h-4" />
        <span>Features</span>
      </TabsTrigger>
      {hasModeratorAccess && (
        <TabsTrigger value="knowledge" className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4" />
          <span>Knowledge</span>
        </TabsTrigger>
      )}
      <TabsTrigger value="developer" className="flex items-center space-x-2" data-tour="developer">
        <Terminal className="w-4 h-4" />
        <span>Dev Tools</span>
      </TabsTrigger>
      <TabsTrigger value="activity" className="flex items-center space-x-2">
        <Activity className="w-4 h-4" />
        <span>Activity</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default AdminTabsNavigation;
