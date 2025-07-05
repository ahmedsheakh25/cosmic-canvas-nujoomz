
import React from 'react';

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge: number | null;
  tourId: string;
  isNew?: boolean;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

export interface SidebarProps {
  hasAdminAccess: boolean;
  hasModeratorAccess: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  stats: {
    newBriefs: number;
  };
}
