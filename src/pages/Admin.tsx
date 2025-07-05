import React, { Suspense, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DashboardShell } from '@/layouts/DashboardShell';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import ModernAdminSidebar from '@/components/Admin/ModernAdminSidebar';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Lazy load components
const AdminDashboard = React.lazy(() => import('@/components/Admin/DashboardOverview'));
const AnalyticsPage = React.lazy(() => import('@/components/Admin/RealTimeAnalytics'));
const TeamPage = React.lazy(() => import('@/components/Admin/TeamManagement'));
const ProjectsPage = React.lazy(() => import('@/pages/Admin/Projects'));
const RolesPage = React.lazy(() => import('@/components/Admin/RoleManagement'));
const FeaturesPage = React.lazy(() => import('@/components/Admin/FeatureManagement'));
const KnowledgeBasePage = React.lazy(() => import('@/components/Admin/KnowledgeBaseManagement'));
const DeveloperToolsPage = React.lazy(() => import('@/components/Admin/DeveloperTools'));
const ActivityLogPage = React.lazy(() => import('@/components/Admin/ActivityLog'));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { userRole, hasAdminAccess, hasModeratorAccess } = useAdminAuth();
  
  if (requiredRole === 'admin' && !hasAdminAccess) {
    return <Navigate to="/admin" replace />;
  }
  
  if (requiredRole === 'moderator' && !hasModeratorAccess) {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const { userRole, hasAdminAccess, hasModeratorAccess, loading: authLoading } = useAdminAuth();
  const { stats, loading: statsLoading, fetchDashboardStats, error: statsError } = useAdminDashboard(user);
  const [activeTab, setActiveTab] = useState(() => {
    const path = location.pathname.split('/')[2] || '';
    return path || 'overview';
  });
  
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getSession();
  }, []);

  if (authLoading) {
    return <PageLoader />;
  }

  return (
    <LanguageProvider>
      <div className="flex h-screen bg-gray-100">
        <ModernAdminSidebar
          hasAdminAccess={hasAdminAccess}
          hasModeratorAccess={hasModeratorAccess}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          stats={{ newBriefs: stats?.newBriefs || 0 }}
        />
        
        <div className="flex-1 overflow-auto">
          <DashboardShell
            title="Admin Dashboard"
            description="Manage your OfSpace Studio platform"
          >
            <Suspense fallback={<PageLoader />}>
              {statsError ? (
                <div className="text-red-500 p-4">
                  Error loading dashboard data: {statsError}
                </div>
              ) : (
                <Routes>
                  <Route 
                    index 
                    element={
                      <AdminDashboard 
                        stats={stats} 
                        loading={statsLoading} 
                        onRefresh={fetchDashboardStats} 
                      />
                    } 
                  />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="team" element={<TeamPage />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route 
                    path="roles" 
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <RolesPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="features" element={<FeaturesPage />} />
                  <Route 
                    path="knowledge" 
                    element={
                      <ProtectedRoute requiredRole="moderator">
                        <KnowledgeBasePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="developer" element={<DeveloperToolsPage />} />
                  <Route path="activity" element={<ActivityLogPage />} />
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Routes>
              )}
            </Suspense>
          </DashboardShell>
        </div>
      </div>
    </LanguageProvider>
  );
}
