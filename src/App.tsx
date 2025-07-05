import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import EnhancedNujmooz from "./pages/EnhancedNujmooz";
import Landing from "./pages/Landing";
import MobileNujmooz from "./pages/MobileNujmooz";
import Admin from "./pages/Admin";
import KnowledgeBase from "./pages/KnowledgeBase";
import { SpeedInsightsWrapper } from '@/components/SpeedInsightsWrapper';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EnhancedNujmooz />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/mobile-nujmooz" element={<MobileNujmooz />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/admin" element={<Admin />} />
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
