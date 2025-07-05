
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import { 
  Search, 
  Bell, 
  Settings, 
  LogOut,
  Plus,
  Download,
  Upload,
  User as UserIcon
} from 'lucide-react';

interface ModernAdminHeaderProps {
  user: User;
  userRole: string | null;
  onSignOut: () => void;
  onRefresh: () => void;
}

const ModernAdminHeader: React.FC<ModernAdminHeaderProps> = ({
  user,
  userRole,
  onSignOut,
  onRefresh
}) => {
  const { t, direction } = useLanguage();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-xl">🛸</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {t('dashboard.title')}
                </h1>
                <p className="text-sm text-gray-500">
                  {t('dashboard.subtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Center section - Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${
                direction === 'rtl' ? 'right-3' : 'left-3'
              }`} />
              <Input
                placeholder={t('actions.search')}
                className={`${
                  direction === 'rtl' ? 'pr-10 pl-3' : 'pl-10 pr-3'
                } bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500/20`}
              />
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            {/* Quick Actions */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 border-green-200 hover:bg-green-50"
              >
                <Upload className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {t('actions.import')}
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                {t('actions.add')}
              </Button>
            </div>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                3
              </Badge>
            </Button>

            {/* Language Toggle */}
            <LanguageToggle />

            {/* Settings */}
            <Button variant="ghost" size="sm">
              <Settings className="w-5 h-5 text-gray-600" />
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-3 rtl:space-x-reverse pl-4 rtl:pr-4 border-l rtl:border-r rtl:border-l-0 border-gray-200">
              <div className="text-right rtl:text-left">
                <div className="text-sm font-medium text-gray-900 truncate max-w-32">
                  {user.email}
                </div>
                <Badge 
                  className={`text-xs ${
                    userRole === 'admin' 
                      ? 'bg-green-100 text-green-800' 
                      : userRole === 'moderator'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {userRole || 'Loading...'}
                </Badge>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-green-600" />
              </div>
              <Button variant="ghost" size="sm" onClick={onSignOut}>
                <LogOut className="w-4 h-4 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ModernAdminHeader;
