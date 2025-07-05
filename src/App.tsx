import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { navItems } from "./nav-items";
import EnhancedNujmooz from "./pages/EnhancedNujmooz";
import Landing from "./pages/Landing";
import MobileNujmooz from "./pages/MobileNujmooz";
import Admin from "./pages/Admin";
import KnowledgeBase from "./pages/KnowledgeBase";
import { SpeedInsightsWrapper } from '@/components/SpeedInsightsWrapper';
import { getDomainRouteConfig, getCurrentHostname, shouldRedirectToDomainDefault } from '@/utils/domainRouting';
import { useEffect } from 'react';

const queryClient = new QueryClient();

// Domain-aware routing component
const DomainRouter = () => {
  const location = useLocation();
  const hostname = getCurrentHostname();
  const domainConfig = getDomainRouteConfig(hostname);

  useEffect(() => {
    console.log('Current hostname:', hostname);
    console.log('Domain config:', domainConfig);
    console.log('Current path:', location.pathname);
  }, [hostname, domainConfig, location.pathname]);

  // Handle domain-specific redirects
  if (shouldRedirectToDomainDefault(hostname, location.pathname)) {
    const defaultRoute = domainConfig?.defaultRoute || '/';
    console.log('Redirecting to:', defaultRoute);
    return <Navigate to={defaultRoute} replace />;
  }

  // Special handling for root path based on domain
  if (location.pathname === '/') {
    switch (hostname) {
      case 'orbit.ofspace.com':
        return <Navigate to="/admin" replace />;
      case 'nujmooz.ofspace.studio':
        return <EnhancedNujmooz />;
      case 'www.ofspace.studio':
      case 'ofspace.studio':
        return <Navigate to="/landing" replace />;
      default:
        return <EnhancedNujmooz />;
    }
  }

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DomainRouter />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/mobile-nujmooz" element={<MobileNujmooz />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/chat" element={<EnhancedNujmooz />} />
        </Routes>
      </BrowserRouter>
      <SpeedInsightsWrapper 
        timeoutDuration={30000}
        fallback={
          process.env.NODE_ENV === 'development' ? (
            <div style={{ display: 'none' }}>Speed Insights not available in development</div>
          ) : null
        }
      />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
