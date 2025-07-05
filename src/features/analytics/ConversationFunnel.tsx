import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/integrations/supabase/client';
import { analyticsClient } from '@/integrations/analytics/client';

interface FunnelStep {
  name: string;
  total: number;
  completed: number;
  percentage: number;
}

interface FunnelData {
  steps: FunnelStep[];
  totalConversations: number;
  conversionRate: number;
}

export const ConversationFunnel = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null);

  useEffect(() => {
    fetchFunnelData();
  }, []);

  const fetchFunnelData = async () => {
    try {
      setLoading(true);

      // Fetch conversation data from Supabase
      const { data: conversations, error: conversationsError } = await supabase
        .from('conversations')
        .select('*');

      if (conversationsError) throw conversationsError;

      // Fetch survey responses for additional insights
      const surveyResults = await analyticsClient.getSurveyResults();

      // Process and combine the data
      const processedData = processFunnelData(conversations, surveyResults);
      setFunnelData(processedData);
    } catch (err) {
      setError('Failed to fetch funnel data');
      console.error('Funnel data error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conversation Funnel</CardTitle>
          <CardDescription>Loading funnel data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-48" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conversation Funnel</CardTitle>
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
        <CardTitle>Conversation Funnel</CardTitle>
        <CardDescription>
          Step-by-step conversion analysis from greeting to completion
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Overall Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4 text-center">
              <div className="text-2xl font-bold">
                {funnelData?.totalConversations}
              </div>
              <div className="text-sm text-gray-500">Total Conversations</div>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <div className="text-2xl font-bold">
                {funnelData?.conversionRate}%
              </div>
              <div className="text-sm text-gray-500">Conversion Rate</div>
            </div>
          </div>

          {/* Funnel Visualization */}
          <div className="space-y-4">
            {funnelData?.steps.map((step, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{step.name}</span>
                  <span>{step.percentage}%</span>
                </div>
                <div className="relative h-4 w-full rounded-full bg-gray-100">
                  <div
                    className="absolute h-4 rounded-full bg-blue-500"
                    style={{
                      width: `${step.percentage}%`,
                      opacity: 1 - index * 0.2,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{step.completed} completed</span>
                  <span>{step.total} total</span>
                </div>
              </div>
            ))}
          </div>

          {/* Drop-off Points */}
          <div>
            <h3 className="mb-4 text-sm font-medium">Key Drop-off Points</h3>
            <div className="space-y-2">
              {funnelData?.steps.slice(0, -1).map((step, index) => {
                const dropOff = step.total - step.completed;
                const dropOffRate = Math.round((dropOff / step.total) * 100);
                if (dropOffRate > 20) {
                  return (
                    <div
                      key={index}
                      className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm"
                    >
                      <span className="font-medium">{step.name}:</span> Lost{' '}
                      {dropOff} users ({dropOffRate}% drop-off)
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const processFunnelData = (
  conversations: any[],
  surveyResults: any
): FunnelData => {
  // This is a placeholder implementation
  // In a real application, you would process the actual data
  const steps: FunnelStep[] = [
    {
      name: 'Initial Greeting',
      total: 1000,
      completed: 800,
      percentage: 80,
    },
    {
      name: 'Service Selection',
      total: 800,
      completed: 600,
      percentage: 60,
    },
    {
      name: 'Project Details',
      total: 600,
      completed: 400,
      percentage: 40,
    },
    {
      name: 'Engagement',
      total: 400,
      completed: 300,
      percentage: 30,
    },
    {
      name: 'Conversion',
      total: 300,
      completed: 200,
      percentage: 20,
    },
  ];

  return {
    steps,
    totalConversations: 1000,
    conversionRate: 20,
  };
}; 