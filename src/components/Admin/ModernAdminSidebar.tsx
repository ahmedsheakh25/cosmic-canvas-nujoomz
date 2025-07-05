
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  FileText, 
  Activity, 
  Users, 
  Settings, 
  Zap, 
  Terminal, 
  Shield, 
  BookOpen,
  TrendingUp,
  Database,
  Eye,
  UserCheck
} from 'lucide-react';

interface NavigationItem {
  id: string;
  labelKey: string;
  icon: React.ComponentType<any>;
  badge?: number;
  isNew?: boolean;
}

interface NavigationSection {
  titleKey: string;
  items: NavigationItem[];
}

interface ModernAdminSidebarProps {
  hasAdminAccess: boolean;
  hasModeratorAccess: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats: {
    newBriefs: number;
  };
}

const ModernAdminSidebar: React.FC<ModernAdminSidebarProps> = ({
  hasAdminAccess,
  hasModeratorAccess,
  activeTab,
  onTabChange,
  stats
}) => {
  const { t, direction } = useLanguage();

  const navigationSections: NavigationSection[] = [
    {
      titleKey: 'dashboard.overview',
      items: [
        {
          id: 'overview',
          labelKey: 'nav.dashboard',
          icon: BarChart3
        }
      ]
    },
    {
      titleKey: 'Content Management',
      items: [
        {
          id: 'briefs',
          labelKey: 'nav.projects',
          icon: FileText,
          badge: stats.newBriefs > 0 ? stats.newBriefs : undefined
        },
        {
          id: 'analytics',
          labelKey: 'nav.analytics',
          icon: TrendingUp,
          isNew: true
        }
      ]
    },
    {
      titleKey: 'Team & Access',
      items: [
        {
          id: 'team',
          labelKey: 'nav.team',
          icon: Users
        },
        {
          id: 'users',
          labelKey: 'nav.users',
          icon: UserCheck
        },
        ...(hasAdminAccess ? [{
          id: 'roles',
          labelKey: 'Role Management',
          icon: Shield
        }] : []),
        ...(hasModeratorAccess ? [{
          id: 'knowledge',
          labelKey: 'Knowledge Base',
          icon: BookOpen
        }] : [])
      ]
    },
    {
      titleKey: 'System',
      items: [
        {
          id: 'features',
          labelKey: 'nav.settings',
          icon: Settings
        },
        {
          id: 'developer',
          labelKey: 'Developer Tools',
          icon: Terminal,
          isNew: true
        },
        {
          id: 'activity',
          labelKey: 'nav.audit',
          icon: Activity
        },
        {
          id: 'monitoring',
          labelKey: 'System Monitor',
          icon: Eye
        }
      ]
    }
  ];

  return (
    <motion.div 
      className="w-72 h-screen bg-white border-r border-gray-200 flex flex-col shadow-sm sticky top-0"
      initial={{ x: direction === 'rtl' ? 300 : -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              OfSpace Admin
            </h2>
            <p className="text-sm text-gray-500">
              Management Hub
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6">
        {navigationSections.map((section, sectionIndex) => (
          <motion.div 
            key={section.titleKey} 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * sectionIndex, duration: 0.3 }}
          >
            <div className="px-6 mb-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {t(section.titleKey) || section.titleKey}
              </h3>
            </div>
            
            <nav className="space-y-1 px-3">
              {section.items.map((item, itemIndex) => (
                <motion.button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    activeTab === item.id
                      ? 'bg-green-50 text-green-700 border-r-2 rtl:border-l-2 rtl:border-r-0 border-green-500'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  whileHover={{ scale: 1.02, x: direction === 'rtl' ? -4 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: direction === 'rtl' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * itemIndex, duration: 0.2 }}
                >
                  <item.icon className={`w-5 h-5 ${
                    activeTab === item.id ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  <span className="flex-1 text-left rtl:text-right truncate">
                    {t(item.labelKey) || item.labelKey}
                  </span>
                  
                  {/* Badges and indicators */}
                  <div className="flex items-center gap-1">
                    {item.isNew && (
                      <Badge className="bg-green-500 text-white text-xs px-1.5 py-0.5">
                        NEW
                      </Badge>
                    )}
                    {item.badge && (
                      <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </motion.button>
              ))}
            </nav>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-sm font-medium text-green-600 mb-1">
            OfSpace Studio v2.0
          </div>
          <p className="text-xs text-gray-400">
            Enhanced Admin Panel
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernAdminSidebar;
