import React from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut,
  Plus,
  Upload,
  User as UserIcon,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ModernAdminHeaderProps {
  user: User;
  userRole: string | null;
  onSignOut: () => void;
  onRefresh: () => void;
  loading?: boolean;
  error?: string | null;
  activeTab?: string;
}

const ModernAdminHeader: React.FC<ModernAdminHeaderProps> = ({
  user,
  userRole,
  onSignOut,
  onRefresh,
  loading = false,
  error = null,
  activeTab = 'overview'
}) => {
  const { t, direction } = useLanguage();

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
      activity: 'System Activity Logs',
      monitoring: 'System Monitor'
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
      activity: 'Track all administrative actions and changes',
      monitoring: 'Real-time system performance monitoring'
    };
    return descriptions[tab as keyof typeof descriptions] || 'Manage your OfSpace Studio platform';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-6 py-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          {/* Left Section - Title and Search */}
          <div className="flex items-center flex-1 gap-8">
            {/* Page Title */}
            <div>
              {loading ? (
                <>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {getPageTitle(activeTab)}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {getPageDescription(activeTab)}
                  </p>
                </>
              )}
            </div>

            {/* Search Bar */}
            <div className="max-w-md flex-1 hidden lg:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="search"
                  placeholder={t('search.placeholder')}
                  className="pl-10 pr-4 py-2 w-full bg-gray-50 border-gray-200 focus:bg-white"
                  aria-label={t('search.placeholder')}
                />
              </div>
            </div>
          </div>

          {/* Right Section - Actions and Profile */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Quick Actions */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'text-green-600 border-green-200 hover:bg-green-50',
                  loading && 'opacity-50 cursor-not-allowed'
                )}
                onClick={onRefresh}
                disabled={loading}
                aria-label={t('actions.refresh')}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                )}
                {t('actions.refresh')}
              </Button>
              
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                aria-label={t('actions.add')}
              >
                <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {t('actions.add')}
              </Button>
            </div>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              aria-label={t('notifications.title')}
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <Badge 
                className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full"
                aria-label={t('notifications.unread', { count: 3 })}
              >
                3
              </Badge>
            </Button>

            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  aria-label={t('settings.title')}
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('settings.title')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {t('settings.profile')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {t('settings.preferences')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {t('settings.security')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2"
                  aria-label={t('profile.title')}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="hidden lg:block text-left rtl:text-right">
                    <div className="text-sm font-medium text-gray-700">
                      {user.email}
                    </div>
                    <div className="text-xs text-gray-500">
                      {userRole || t('role.default')}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t('profile.title')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {t('profile.settings')}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {t('profile.help')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={onSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('auth.signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernAdminHeader;
