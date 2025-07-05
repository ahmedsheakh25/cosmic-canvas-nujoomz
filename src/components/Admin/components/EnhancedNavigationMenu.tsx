
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { 
  BarChart3, 
  FileText, 
  Activity, 
  Users, 
  Settings, 
  Zap, 
  Terminal, 
  Shield, 
  BookOpen
} from 'lucide-react';
import { NavigationSection, SidebarProps } from '../types/NavigationTypes';

interface EnhancedNavigationMenuProps extends SidebarProps {}

const EnhancedNavigationMenu: React.FC<EnhancedNavigationMenuProps> = ({
  hasAdminAccess,
  hasModeratorAccess,
  activeTab,
  onTabChange,
  stats
}) => {
  const navigationSections: NavigationSection[] = [
    {
      title: "Overview",
      items: [
        {
          id: "overview",
          label: "Dashboard",
          icon: BarChart3,
          badge: null,
          tourId: "overview"
        }
      ]
    },
    {
      title: "Content Management",
      items: [
        {
          id: "briefs",
          label: "Project Briefs",
          icon: FileText,
          badge: stats.newBriefs > 0 ? stats.newBriefs : null,
          tourId: "briefs"
        },
        {
          id: "analytics",
          label: "Real-Time Analytics",
          icon: Zap,
          badge: null,
          tourId: "analytics",
          isNew: true
        }
      ]
    },
    {
      title: "Team & Access",
      items: [
        {
          id: "team",
          label: "Team Management",
          icon: Users,
          badge: null,
          tourId: "team"
        },
        ...(hasAdminAccess ? [{
          id: "roles",
          label: "Role Management",
          icon: Shield,
          badge: null,
          tourId: "roles"
        }] : []),
        ...(hasModeratorAccess ? [{
          id: "knowledge",
          label: "Knowledge Base",
          icon: BookOpen,
          badge: null,
          tourId: "knowledge"
        }] : [])
      ]
    },
    {
      title: "System",
      items: [
        {
          id: "features",
          label: "Feature Toggles",
          icon: Settings,
          badge: null,
          tourId: "settings"
        },
        {
          id: "developer",
          label: "Developer Tools",
          icon: Terminal,
          badge: null,
          tourId: "developer",
          isNew: true
        },
        {
          id: "activity",
          label: "Activity Logs",
          icon: Activity,
          badge: null,
          tourId: "activity"
        }
      ]
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {navigationSections.map((section, sectionIndex) => (
        <motion.div 
          key={section.title} 
          className="sidebar-section"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + (sectionIndex * 0.1), duration: 0.5 }}
        >
          <div className="px-6 py-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              {section.title}
              {section.title === "System" && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-3 h-3 text-purple-400" />
                </motion.div>
              )}
            </h3>
            <nav className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <motion.button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  data-tour={item.tourId}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                    activeTab === item.id
                      ? 'cosmic-gradient text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (sectionIndex * 0.1) + (itemIndex * 0.05), duration: 0.3 }}
                >
                  <motion.div
                    whileHover={{ rotate: activeTab === item.id ? 0 : 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <item.icon className={`w-5 h-5 ${
                      activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`} />
                  </motion.div>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  
                  {/* Enhanced badges and indicators */}
                  <div className="flex items-center gap-1">
                    {item.isNew && (
                      <motion.div
                        className="px-1.5 py-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-xs font-bold text-white"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, type: "spring", stiffness: 500 }}
                      >
                        NEW
                      </motion.div>
                    )}
                    {item.badge && (
                      <motion.div
                        className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
                      >
                        {item.badge}
                      </motion.div>
                    )}
                  </div>

                  {/* Active indicator */}
                  <AnimatePresence>
                    {activeTab === item.id && (
                      <motion.div
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-l-full"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        exit={{ scaleY: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.button>
              ))}
            </nav>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default EnhancedNavigationMenu;
