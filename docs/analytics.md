# Nujmooz Analytics System

The Nujmooz analytics system provides comprehensive insights into user interactions, emotional responses, and service performance through multiple data sources and visualization components.

## Data Sources

### 1. Supabase Analytics
- **Table**: `analytics_events`
- **Features Tracked**:
  - Conversation flow
  - Emotional analysis
  - Service matching
  - Error tracking
  - Voice interactions
  - Service questions

### 2. SurveySparrow Integration
- **Purpose**: User feedback and satisfaction metrics
- **Features**:
  - Form completion rates
  - Drop-off analysis
  - Emotional feedback
  - Service satisfaction

### 3. Vercel Analytics
- **Purpose**: High-level usage metrics
- **Features**:
  - Page views
  - User sessions
  - Performance metrics
  - Error rates

## Environment Configuration

Required environment variables in `.env`:

```bash
# Analytics Configuration
VITE_ENABLE_ANALYTICS=true
VITE_ANALYTICS_ENDPOINT=your_endpoint
VITE_ANALYTICS_API_KEY=your_api_key

# SurveySparrow Configuration
VITE_SURVEYSPARROW_TOKEN=your_token
VITE_SURVEYSPARROW_FORM_ID=your_form_id
```

## Available Metrics

### 1. Conversion Metrics
- Conversation completion rates
- Service selection rates
- Question completion rates
- Voice interaction success rates

### 2. Emotional Analytics
- Primary emotion distribution
- Emotion intensity trends
- Service-emotion correlations
- Emotional shift patterns

### 3. Service Performance
- Service selection frequency
- Service completion rates
- Question effectiveness
- User satisfaction scores

### 4. User Journey Analysis
- Drop-off points
- Time spent per step
- Common user paths
- Friction points

## Dashboard Components

### 1. SurveyInsightsCard
- Form completion metrics
- Drop-off visualization
- Emotional feedback summary
- Tag cloud for common feedback

### 2. ConversationFunnel
- Step-by-step conversion visualization
- Drop-off rates per step
- Service type distribution
- Completion time analysis

### 3. EmotionTrendGraph
- Emotional state timeline
- Service correlation view
- Intensity tracking
- Pattern identification

### 4. RealTimeAnalytics
- Active user count
- Current conversations
- Live emotion tracking
- Error monitoring

## Activating/Deactivating Data Sources

### Vercel Analytics
```typescript
// In src/config/environment.ts
analytics: {
  enabled: import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
}
```

### SurveySparrow
```typescript
// In src/integrations/analytics/client.tsx
if (token && formId) {
  this.surveySparrowConfig = { token, formId };
  this.initializeSurveySparrow();
}
```

### Supabase Events
```typescript
// In src/services/analyticsService.ts
// Set log level in constructor
constructor() {
  this.logLevel = process.env.NODE_ENV === 'production' ? 'error' : 'debug';
}
```

## API Token Setup

1. **Vercel Analytics**
   - Get API key from Vercel dashboard
   - Add to `.env` as `VITE_ANALYTICS_API_KEY`

2. **SurveySparrow**
   - Create account at surveysparrow.com
   - Generate API token in settings
   - Create form and note form ID
   - Add both to `.env`

3. **Supabase**
   - No additional setup needed
   - Uses existing Supabase connection

## Error Handling

All analytics operations include:
- Graceful degradation
- Error logging to `analytics_events`
- User-friendly fallbacks
- Automatic retry for critical events

## Caching

The AnalyticsEngine implements a caching layer for:
- Conversion rates (5-minute TTL)
- Emotion trends (5-minute TTL)
- Survey results (5-minute TTL)
- Service statistics (5-minute TTL)

## Development Guidelines

1. **Adding New Metrics**
   - Add type to `Feature` and `Action` enums
   - Create tracking method in `AnalyticsService`
   - Add visualization component if needed
   - Update documentation

2. **Modifying Existing Metrics**
   - Update relevant interfaces
   - Modify tracking logic in service
   - Update visualization components
   - Update documentation

3. **Testing**
   - Use test environment for SurveySparrow
   - Enable debug logging in development
   - Monitor system logs for errors
   - Validate data consistency 