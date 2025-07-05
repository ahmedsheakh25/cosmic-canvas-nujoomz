import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  TrendingUp
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge: number | null;
  tourId: string;
  isNew?: boolean;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

interface EnhancedNavigationMenuProps {
  hasAdminAccess: boolean;
  hasModeratorAccess: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats: {
    newBriefs: number;
  };
}

const menuVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    }
  })
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.2
    }
  },
  hover: { 
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  }
};

const EnhancedNavigationMenu: React.FC<EnhancedNavigationMenuProps> = ({
  hasAdminAccess,
  hasModeratorAccess,
  activeTab,
  onTabChange,
  stats
}) => {
  const { t } = useLanguage();

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
    <TooltipProvider>
      <nav className="flex-1 overflow-y-auto py-6 px-4" role="navigation">
        {navigationSections.map((section, sectionIndex) => (
          <motion.div 
            key={section.title}
            custom={sectionIndex}
            initial="hidden"
            animate="visible"
            variants={menuVariants}
            className="mb-8"
          >
            <h3 
              className="px-4 mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider"
              id={`nav-section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {section.title}
            </h3>
            
            <div 
              role="group" 
              aria-labelledby={`nav-section-${section.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="space-y-1"
            >
              {section.items.map((item) => {
                const isActive = activeTab === item.id;
                
                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <motion.button
                        onClick={() => onTabChange(item.id)}
                        className={cn(
                          'w-full flex items-center px-4 py-3 text-sm rounded-lg transition-colors',
                          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
                          isActive
                            ? 'bg-green-50 text-green-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        )}
                        variants={itemVariants}
                        whileHover="hover"
                        role="menuitem"
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <item.icon className={cn(
                          'flex-shrink-0 w-5 h-5 mr-3',
                          isActive ? 'text-green-600' : 'text-gray-400'
                        )} />
                        
                        <span className="flex-1 text-left">
                          {item.label}
                        </span>
                        
                        {item.badge && (
                          <Badge 
                            variant="default" 
                            className="ml-2 bg-green-100 text-green-700"
                          >
                            {item.badge}
                          </Badge>
                        )}
                        
                        {item.isNew && (
                          <Badge 
                            variant="default" 
                            className="ml-2 bg-blue-100 text-blue-700"
                          >
                            New
                          </Badge>
                        )}
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t(`tooltips.${item.tourId}`) || item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </motion.div>
        ))}
      </nav>
    </TooltipProvider>
  );
};

export default EnhancedNavigationMenu;
