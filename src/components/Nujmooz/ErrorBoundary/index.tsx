import React from 'react';
import { ErrorBoundaryProps } from './types';
import { ErrorFallback } from './ErrorFallback';
import { AnalyticsService } from '@/services/analyticsService';

interface State {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Track error in analytics
    AnalyticsService.trackError(
      error,
      'system', // Use system user ID for component errors
      {
        componentStack: errorInfo.componentStack,
        language: this.props.language
      }
    );

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.error) {
      // Use custom fallback if provided, otherwise use default
      return this.props.fallback || (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={() => this.setState({ error: null })}
          language={this.props.language}
        />
      );
    }

    return this.props.children;
  }
} 