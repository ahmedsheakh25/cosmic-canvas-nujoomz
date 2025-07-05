
import React from 'react';
import { User } from '@supabase/supabase-js';
import { Badge } from '@/components/ui/badge';
import { Rocket, Sparkles } from 'lucide-react';

interface CosmicSidebarHeaderProps {
  user: User;
  userRole: string | null;
}

const CosmicSidebarHeader: React.FC<CosmicSidebarHeaderProps> = ({ user, userRole }) => {
  const getRoleBadgeColor = (role: string | null) => {
    switch (role) {
      case 'admin':
        return 'cosmic-gradient text-white';
      case 'moderator':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="sidebar-section p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative">
          <div className="w-12 h-12 cosmic-gradient rounded-xl flex items-center justify-center cosmic-glow">
            <Rocket className="w-6 h-6 text-white cosmic-float" />
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 cosmic-gradient rounded-full flex items-center justify-center">
            <Sparkles className="w-2 h-2 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">OfSpace Admin</h1>
          <p className="text-sm text-gray-300">Nujmooz Management Hub</p>
        </div>
      </div>
      
      {/* User Info */}
      <div className="bg-black/20 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300 truncate">{user.email}</span>
          <Badge className={`text-xs ${getRoleBadgeColor(userRole)}`}>
            {userRole || 'Loading...'}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default CosmicSidebarHeader;
