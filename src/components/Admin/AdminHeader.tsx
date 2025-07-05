
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import InteractiveGuidedTour from './InteractiveGuidedTour';

interface AdminHeaderProps {
  user: User;
  userRole: string | null;
  onSignOut: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ user, userRole, onSignOut }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3" data-tour="overview">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
              <span className="text-xl">🛸</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">OfSpace Studio Admin</h1>
              <p className="text-sm text-gray-500">Enhanced Nujmooz Assistant Management</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <InteractiveGuidedTour user={user} />
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">{user.email}</div>
              <div className="text-xs text-gray-500 capitalize">
                {userRole || 'Loading...'}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
