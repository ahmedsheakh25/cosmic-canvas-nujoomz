import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { analyticsClient } from '@/integrations/analytics/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

interface SurveyMetrics {
  completionRate: number;
  averageTimeSpent: number;
  dropOffPoints: { step: string; rate: number }[];
  emotionalFeedback: { emotion: string; count: number }[];
}

export const SurveyInsightsCard: React.FC = () => {
  const [metrics, setMetrics] = useState<SurveyMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveyMetrics();
  }, []);

  const fetchSurveyMetrics = async () => {
    try {
      const results = await analyticsClient.getSurveyResults();
      if (!results) throw new Error('No survey results available');

      // Process survey results into metrics
      const processedMetrics: SurveyMetrics = {
        completionRate: calculateCompletionRate(results),
        averageTimeSpent: calculateAverageTimeSpent(results),
        dropOffPoints: calculateDropOffPoints(results),
        emotionalFeedback: aggregateEmotionalFeedback(results),
      };

      setMetrics(processedMetrics);
    } catch (error) {
      console.error('Error fetching survey metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No survey data available
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Survey Insights</CardTitle>
        <CardDescription>Analysis of user feedback and engagement</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Completion Rate */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
            <p className="text-2xl font-bold">{metrics.completionRate}%</p>
          </div>

          {/* Average Time Spent */}
          <div>
            <h3 className="text-sm font-medium text-gray-500">Avg. Time Spent</h3>
            <p className="text-2xl font-bold">{metrics.averageTimeSpent}s</p>
          </div>

          {/* Drop-off Points Chart */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Drop-off Points</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.dropOffPoints}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="step" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="#8b5cf6" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Emotional Feedback */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-4">Emotional Feedback</h3>
            <div className="grid grid-cols-2 gap-4">
              {metrics.emotionalFeedback.map(({ emotion, count }) => (
                <div key={emotion} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">{emotion}</p>
                  <p className="text-lg font-bold">{count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions for processing survey data
const calculateCompletionRate = (results: any[]): number => {
  const completed = results.filter(r => r.status === 'completed').length;
  return Math.round((completed / results.length) * 100);
};

const calculateAverageTimeSpent = (results: any[]): number => {
  const times = results.map(r => r.timeSpent || 0);
  return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
};

const calculateDropOffPoints = (results: any[]): { step: string; rate: number }[] => {
  const steps = ['start', 'personal', 'feedback', 'completion'];
  return steps.map(step => ({
    step,
    rate: results.filter(r => r.lastStep === step).length / results.length * 100
  }));
};

const aggregateEmotionalFeedback = (results: any[]): { emotion: string; count: number }[] => {
  const emotions = results
    .filter(r => r.emotionalResponse)
    .map(r => r.emotionalResponse);
  
  const counts = emotions.reduce((acc: Record<string, number>, emotion: string) => {
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(counts)
    .map(([emotion, count]) => ({ emotion, count: count as number }))
    .sort((a, b) => b.count - a.count);
}; 