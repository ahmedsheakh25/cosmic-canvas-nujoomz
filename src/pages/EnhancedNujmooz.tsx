
import React from 'react';
import { ThemeProvider } from 'next-themes';
import EnhancedNujmoozInterface from '@/components/Nujmooz/EnhancedNujmoozInterface';

const EnhancedNujmooz: React.FC = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <div className="min-h-screen">
        <EnhancedNujmoozInterface />
      </div>
    </ThemeProvider>
  );
};

export default EnhancedNujmooz;
