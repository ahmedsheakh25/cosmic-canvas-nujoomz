interface SpeedInsightsConfig {
  enabled: boolean;
  timeoutDuration: number;
  debugMode: boolean;
}

export const speedInsightsConfig: SpeedInsightsConfig = {
  // Enable/disable Speed Insights (can be overridden by env variable)
  enabled: process.env.NEXT_PUBLIC_SPEED_INSIGHTS_ENABLED !== 'false',
  
  // Time to wait before showing warning about potential blockers (in milliseconds)
  timeoutDuration: 30000,
  
  // Enable debug mode for additional console logging
  debugMode: process.env.NODE_ENV === 'development'
}; 