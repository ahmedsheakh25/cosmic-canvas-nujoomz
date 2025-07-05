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
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface NavigationItem {
  id: string;
  labelKey: string;
  icon: React.ElementType;
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
  loading?: boolean;
}

const ModernAdminSidebar: React.FC<ModernAdminSidebarProps> = ({
  hasAdminAccess,
  hasModeratorAccess,
  activeTab,
  onTabChange,
  stats,
  loading = false
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

  if (loading) {
    return (
      <div className="w-64 h-screen bg-white border-r border-gray-200 p-4 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Navigation Sections */}
        <div className="space-y-8">
          {Array(4).fill(0).map((_, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2">
                {Array(3).fill(0).map((_, itemIndex) => (
                  <Skeleton key={itemIndex} className="h-10 w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
                  className={`