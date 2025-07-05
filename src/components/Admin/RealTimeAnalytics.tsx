
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, TrendingUp, Users, Activity, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface AnalyticsEvent {
  id: string;
  feature: string;
  action: string;
  user_id?: string;
  session_id?: string;
  metadata: any;
  created_at: string;
}

interface FeatureUsage {
  feature: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

const RealTimeAnalytics: React.FC = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [featureUsage, setFeatureUsage] = useState<FeatureUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [realTimeEnabled, setRealTimeEnabled] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
    setupRealTimeSubscription();
    
    return () => {
      if (realTimeEnabled) {
        supabase.removeAllChannels();
      }
    };
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch recent events
      const { data: eventsData, error: eventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (eventsError) throw eventsError;

      // Calculate feature usage
      const usageMap = new Map();
      eventsData?.forEach(event => {
        const count = usageMap.get(event.feature) || 0;
        usageMap.set(event.feature, count + 1);
      });

      const usage = Array.from(usageMap.entries()).map(([feature, count]) => ({
        feature,
        count,
        trend: 'stable' as const // Simplified for now
      }));

      setEvents(eventsData || []);
      setFeatureUsage(usage);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const setupRealTimeSubscription = () => {
    const channel = supabase
      .channel('analytics-events')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'analytics_events'
      }, (payload) => {
        setEvents(prev => [payload.new as AnalyticsEvent, ...prev.slice(0, 49)]);
        toast.success('New event tracked!');
      })
      .subscribe();

    setRealTimeEnabled(true);
  };

  const logTestEvent = async () => {
    const testFeatures = ['voice_commands', 'service_suggestions', 'file_generation'];
    const testActions = ['click', 'use', 'complete'];
    
    const randomFeature = testFeatures[Math.floor(Math.random() * testFeatures.length)];
    const randomAction = testActions[Math.floor(Math.random() * testActions.length)];

    try {
      const { error } = await supabase
        .from('analytics_events')
        .insert({
          feature: randomFeature,
          action: randomAction,
          session_id: crypto.randomUUID(),
          metadata: { test: true, timestamp: new Date().toISOString() }
        });

      if (error) throw error;
      toast.success('Test event logged!');
    } catch (error) {
      console.error('Error logging test event:', error);
      toast.error('Failed to log test event');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Real-Time Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Real-Time Feature Analytics
              </CardTitle>
              <CardDescription>
                Live monitoring of feature usage and user interactions
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={realTimeEnabled ? "default" : "secondary"}>
                {realTimeEnabled ? "Live" : "Offline"}
              </Badge>
              <Button onClick={fetchAnalyticsData} size="sm" variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={logTestEvent} size="sm">
                Log Test Event
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Live Events</TabsTrigger>
              <TabsTrigger value="features">Feature Usage</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">Total Events</span>
                    </div>
                    <p className="text-2xl font-bold">{events.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">Active Features</span>
                    </div>
                    <p className="text-2xl font-bold">{featureUsage.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                      <span className="text-sm font-medium">Most Used</span>
                    </div>
                    <p className="text-sm font-bold">
                      {featureUsage[0]?.feature || 'N/A'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <div className="max-h-96 overflow-y-auto space-y-2">
                {events.map((event) => (
                  <Card key={event.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">{event.feature}</Badge>
                        <span className="text-sm">{event.action}</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(event.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div className="space-y-2">
                {featureUsage.map((usage) => (
                  <Card key={usage.feature} className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{usage.feature}</span>
                      <div className="flex items-center gap-2">
                        <Badge>{usage.count} uses</Badge>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAnalytics;
