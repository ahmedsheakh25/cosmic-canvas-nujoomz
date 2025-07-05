import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { analyticsClient } from '@/integrations/analytics/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface SurveyStats {
  completionRate: number;
  dropoffPoints: { step: string; count: number }[];
  emotionalFeedback: { emotion: string; count: number }[];
  commonTags: { tag: string; count: number }[];
}

export const SurveyInsightsCard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<SurveyStats | null>(null);

  useEffect(() => {
    fetchSurveyData();
  }, []);

  const fetchSurveyData = async () => {
    try {
      setLoading(true);
      const results = await analyticsClient.getSurveyResults();
      
      if (!results) {
        setError('No survey data available');
        return;
      }

      // Process survey results into stats
      const processedStats: SurveyStats = {
        completionRate: calculateCompletionRate(results),
        dropoffPoints: analyzeDropoffPoints(results),
        emotionalFeedback: analyzeEmotionalFeedback(results),
        commonTags: analyzeCommonTags(results),
      };

      setStats(processedStats);
    } catch (err) {
      setError('Failed to fetch survey insights');
      console.error('Survey insights error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px] mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <Skeleton className="h-4 w-[150px] mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-[120px] mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Survey Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Survey Insights</CardTitle>
        <CardDescription>
          Analysis of user feedback and interaction patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dropoff">Drop-off</TabsTrigger>
            <TabsTrigger value="emotions">Emotions</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="mt-6">
              <h3 className="text-lg font-medium">Completion Rate</h3>
              <div className="mt-2 flex items-center">
                <div className="relative h-4 w-full rounded-full bg-gray-200">
                  <div
                    className="absolute h-4 rounded-full bg-green-500"
                    style={{ width: `${stats?.completionRate || 0}%` }}
                  />
                </div>
                <span className="ml-4 text-sm font-medium">
                  {stats?.completionRate || 0}%
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dropoff" className="space-y-4">
            <div className="mt-6">
              <h3 className="text-lg font-medium">Drop-off Points</h3>
              <div className="mt-4 space-y-2">
                {stats?.dropoffPoints.map((point, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{point.step}</span>
                    <div className="flex items-center">
                      <div className="h-2 w-32 rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full bg-red-500"
                          style={{
                            width: `${(point.count / Math.max(...stats.dropoffPoints.map(p => p.count))) * 100}%`
                          }}
                        />
                      </div>
                      <span className="ml-2 text-sm">{point.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="emotions" className="space-y-4">
            <div className="mt-6">
              <h3 className="text-lg font-medium">Emotional Feedback</h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {stats?.emotionalFeedback.map((emotion, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-4 text-center"
                  >
                    <div className="text-2xl font-bold">{emotion.count}</div>
                    <div className="mt-1 text-sm text-gray-500">
                      {emotion.emotion}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tags" className="space-y-4">
            <div className="mt-6">
              <h3 className="text-lg font-medium">Common Tags</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {stats?.commonTags.map((tag, index) => (
                  <div
                    key={index}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                  >
                    {tag.tag} ({tag.count})
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper functions for processing survey data
const calculateCompletionRate = (results: any): number => {
  const total = results.total_responses || 0;
  const completed = results.completed_responses || 0;
  return total > 0 ? Math.round((completed / total) * 100) : 0;
};

const analyzeDropoffPoints = (results: any): { step: string; count: number }[] => {
  // Process drop-off points from results
  // This is a placeholder implementation
  return [
    { step: 'Initial Question', count: 100 },
    { step: 'Service Selection', count: 75 },
    { step: 'Project Details', count: 50 },
    { step: 'Final Feedback', count: 25 },
  ];
};

const analyzeEmotionalFeedback = (results: any): { emotion: string; count: number }[] => {
  // Process emotional feedback from results
  // This is a placeholder implementation
  return [
    { emotion: 'Satisfied', count: 45 },
    { emotion: 'Neutral', count: 30 },
    { emotion: 'Frustrated', count: 15 },
    { emotion: 'Delighted', count: 10 },
  ];
};

const analyzeCommonTags = (results: any): { tag: string; count: number }[] => {
  // Process common tags from results
  // This is a placeholder implementation
  return [
    { tag: 'UI Design', count: 25 },
    { tag: 'Branding', count: 20 },
    { tag: 'Marketing', count: 15 },
    { tag: 'Development', count: 10 },
  ];
}; 