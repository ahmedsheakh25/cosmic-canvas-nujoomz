import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SpeedInsightsWrapper } from '@/components/SpeedInsightsWrapper';
import { Routes } from './Routes';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Router>
            <Routes />
            <Toaster />
            <SpeedInsightsWrapper 
              timeoutDuration={30000}
              onTimeout={() => {
                console.warn('Speed insights timed out');
              }}
            />
          </Router>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
