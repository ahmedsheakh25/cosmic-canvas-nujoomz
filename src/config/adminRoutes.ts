import { LayoutDashboard, Users, FolderKanban, FileText, Settings } from 'lucide-react';

export interface AdminRoute {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: typeof LayoutDashboard;
  disabled?: boolean;
}

export const adminRoutes: AdminRoute[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Overview of system metrics and activity',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    id: 'team',
    title: 'Team',
    description: 'Manage team members and roles',
    href: '/admin/team',
    icon: Users,
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Track and manage projects',
    href: '/admin/projects',
    icon: FolderKanban,
  },
  {
    id: 'reports',
    title: 'Reports',
    description: 'View and generate reports',
    href: '/admin/reports',
    icon: FileText,
  },
  {
    id: 'settings',
    title: 'Settings',
    description: 'Configure system settings',
    href: '/admin/settings',
    icon: Settings,
  },
]; 