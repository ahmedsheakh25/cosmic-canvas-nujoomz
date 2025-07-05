
import React from 'react';
import { motion } from 'framer-motion';
import { User } from '@supabase/supabase-js';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface EnhancedSidebarHeaderProps {
  user: User;
  userRole: string | null;
}

const EnhancedSidebarHeader: React.FC<EnhancedSidebarHeaderProps> = ({ user, userRole }) => {
  return (
    <motion.div 
      className="p-6 border-b border-white/10"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <motion.div 
          className="w-10 h-10 cosmic-gradient rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-lg">🛸</span>
        </motion.div>
        <div>
          <h1 className="text-xl font-bold text-white">OfSpace Admin</h1>
          <p className="text-gray-300 text-sm">Enhanced Dashboard</p>
        </div>
      </div>
      
      <div className="text-xs text-gray-400 mb-2">Current User</div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-300 truncate max-w-32">
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
    </motion.div>
  );
};

export default EnhancedSidebarHeader;
