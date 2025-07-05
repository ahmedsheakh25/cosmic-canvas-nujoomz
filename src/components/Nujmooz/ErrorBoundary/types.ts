import { Language } from '@/core/NujmoozEngine/types';

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  language?: Language;
}

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  language?: Language;
} 