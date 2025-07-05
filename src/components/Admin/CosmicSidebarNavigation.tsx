
import React from 'react';
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
  BookOpen
} from 'lucide-react';

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge: number | null;
  tourId: string;
}

interface CosmicSidebarNavigationProps {
  hasAdminAccess: boolean;
  hasModeratorAccess: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats: {
    newBriefs: number;
  };
}

const CosmicSidebarNavigation: React.FC<CosmicSidebarNavigationProps> = ({
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
          tourId: "analytics"
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
          tourId: "developer"
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
      {navigationSections.map((section) => (
        <div key={section.title} className="sidebar-section">
          <div className="px-6 py-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <nav className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  data-tour={item.tourId}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    activeTab === item.id
                      ? 'cosmic-gradient text-white shadow-lg'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${
                    activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-white'
                  }`} />
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.badge && (
                    <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CosmicSidebarNavigation;
