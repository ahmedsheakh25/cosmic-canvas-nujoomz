
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { User } from '@supabase/supabase-js';

interface CosmicMainContentProps {
  user: User;
  userRole: string | null;
  activeTab: string;
  children: React.ReactNode;
  onRefresh: () => void;
  onSignOut: () => void;
}

const CosmicMainContent: React.FC<CosmicMainContentProps> = ({
  user,
  userRole,
  activeTab,
  children,
  onRefresh,
  onSignOut
}) => {
  const getPageTitle = (tab: string) => {
    const titles = {
      overview: 'Dashboard Overview',
      briefs: 'Project Briefs Management',
      analytics: 'Real-Time Analytics Hub',
      team: 'Team & Personnel Management',
      roles: 'Role & Access Control',
      features: 'Feature Toggle Center',
      knowledge: 'Knowledge Base Management',
      developer: 'Developer Tools & Diagnostics',
      activity: 'System Activity Logs'
    };
    return titles[tab as keyof typeof titles] || 'Admin Dashboard';
  };

  const getPageDescription = (tab: string) => {
    const descriptions = {
      overview: 'Monitor key metrics and system health at a glance',
      briefs: 'Review, manage, and track all project submissions',
      analytics: 'Live feature usage and user interaction monitoring',
      team: 'Manage team members and their assignments',
      roles: 'Control user permissions and access levels',
      features: 'Enable or disable platform features dynamically',
      knowledge: 'Maintain and organize the AI knowledge base',
      developer: 'Debug tools and system diagnostics',
      activity: 'Track all administrative actions and changes'
    };
    return descriptions[tab as keyof typeof descriptions] || 'Manage your OfSpace Studio platform';
  };

  return (
    <div className="admin-main-content flex-1">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Page Title & Breadcrumb */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                <span>OfSpace Admin</span>
                <span>/</span>
                <span className="text-gray-900 font-medium">{getPageTitle(activeTab)}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 cosmic-gradient bg-clip-text text-transparent">
                {getPageTitle(activeTab)}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {getPageDescription(activeTab)}
              </p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center space-x-3">
              {/* Quick Search */}
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Quick search..."
                  className="pl-10 w-64 bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  3
                </Badge>
              </Button>

              {/* Refresh Button */}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRefresh}
                className="cosmic-button text-white border-none hover:shadow-lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>

              {/* User Menu */}
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                    {user.email}
                  </div>
                  <Badge 
                    className={`text-xs ${
                      userRole === 'admin' 
                        ? 'cosmic-gradient text-white' 
                        : userRole === 'moderator'
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    {userRole || 'Loading...'}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={onSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        <div className="fade-in-up">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CosmicMainContent;
