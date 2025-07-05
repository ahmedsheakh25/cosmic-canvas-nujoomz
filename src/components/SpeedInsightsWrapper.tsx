import { useEffect, useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { speedInsightsConfig } from '@/config/speedInsights';

interface SpeedInsightsWrapperProps {
  timeoutDuration?: number; // Duration in ms to wait before showing console warning
  fallback?: React.ReactNode; // Optional fallback UI if Speed Insights fails
}

declare global {
  interface Window {
    __VERCEL_SPEED_INSIGHTS__?: unknown;
  }
}

export const SpeedInsightsWrapper: React.FC<SpeedInsightsWrapperProps> = ({
  timeoutDuration = speedInsightsConfig.timeoutDuration,
  fallback = null
}) => {
  const [error, setError] = useState<Error | null>(null);
  const [isEnabled] = useState(() => speedInsightsConfig.enabled);

  useEffect(() => {
    if (!isEnabled) {
      speedInsightsConfig.debugMode && console.debug('Vercel Speed Insights is disabled via configuration');
      return;
    }

    // Set up timeout to check if data is being collected
    const timeout = setTimeout(() => {
      // Check if Speed Insights is potentially blocked
      if (!window.__VERCEL_SPEED_INSIGHTS__) {
        console.warn(
          'Vercel Speed Insights might be blocked by a content blocker or failed to initialize properly.'
        );
      }
    }, timeoutDuration);

    return () => clearTimeout(timeout);
  }, [isEnabled, timeoutDuration]);

  // If disabled or there's an error and no fallback, render nothing
  if (!isEnabled || (error && !fallback)) {
    return null;
  }

  // If there's an error and a fallback is provided, render the fallback
  if (error && fallback) {
    return <>{fallback}</>;
  }

  // Render the Speed Insights component
  try {
    return <SpeedInsights />;
  } catch (err) {
    setError(err instanceof Error ? err : new Error('Failed to render Speed Insights'));
    speedInsightsConfig.debugMode && console.error('Failed to render Vercel Speed Insights:', err);
    return fallback ? <>{fallback}</> : null;
  }
}; 