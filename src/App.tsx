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

// Domain-aware routing component for root path only
const DomainRouter = () => {
  const hostname = getCurrentHostname();
  
  // Only apply domain routing in production environments
  const isProduction = hostname.includes('ofspace.com') || hostname.includes('ofspace.studio');
  
  if (isProduction) {
    switch (hostname) {
      case 'orbit.ofspace.com':
        return <Navigate to="/admin" replace />;
      case 'nujmooz.ofspace.studio':
        return <EnhancedNujmooz />;
      case 'www.ofspace.studio':
      case 'ofspace.studio':
        return <Navigate to="/landing" replace />;
    }
  }
  
  // Default behavior for development or unknown domains
  return <EnhancedNujmooz />;
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
