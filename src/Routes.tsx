import React from 'react';
import { Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { getCurrentHostname } from '@/utils/domainRouting';
import EnhancedNujmooz from './pages/EnhancedNujmooz';
import Landing from './pages/Landing';
import MobileNujmooz from './pages/MobileNujmooz';
import Admin from './pages/Admin';
import KnowledgeBase from './pages/KnowledgeBase';
import Projects from './pages/Admin/Projects';

function DomainRouter() {
  const hostname = getCurrentHostname();

  if (hostname === 'admin.ofspace.studio') {
    return <Navigate to="/admin" replace />;
  }

  return <Landing />;
}

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<DomainRouter />} />
      <Route path="/admin" element={<Admin />}>
        <Route path="projects" element={<Projects />} />
      </Route>
      <Route path="/nujmooz" element={<EnhancedNujmooz />} />
      <Route path="/mobile" element={<MobileNujmooz />} />
      <Route path="/knowledge-base" element={<KnowledgeBase />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
} 