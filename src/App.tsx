import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EnhancedNujmooz from "./pages/EnhancedNujmooz";
import Landing from "./pages/Landing";
import MobileNujmooz from "./pages/MobileNujmooz";
import Admin from "./pages/Admin";
import KnowledgeBase from "./pages/KnowledgeBase";
import { SpeedInsightsWrapper } from '@/components/SpeedInsightsWrapper';
import { getCurrentHostname } from '@/utils/domainRouting';

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
        return <Navigate to="/chat" replace />;
      case 'www.ofspace.studio':
      case 'ofspace.studio':
        return <Navigate to="/landing" replace />;
    }
  }
  
  // Default behavior for development or unknown domains
  return <Navigate to="/chat" replace />;
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
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/chat" element={<EnhancedNujmooz />} />
          <Route path="*" element={<Navigate to="/" replace />} />
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
