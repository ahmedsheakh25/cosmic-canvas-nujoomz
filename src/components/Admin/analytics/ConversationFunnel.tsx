import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { FunnelChart, Funnel, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

interface FunnelStep {
  name: string;
  value: number;
  description: string;
  color: string;
}

export const ConversationFunnel: React.FC = () => {
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFunnelData();
  }, []);

  const fetchFunnelData = async () => {
    try {
      // Fetch analytics events from Supabase
      const { data: events, error } = await supabase
        .from('analytics_events')
        .select('action, feature')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process events into funnel steps
      const steps: FunnelStep[] = [
        {
          name: 'Initial Contact',
          value: countEvents(events, 'conversation', 'message_sent'),
          description: 'Users who started a conversation',
          color: '#c4b5fd'
        },
        {
          name: 'Service Selection',
          value: countEvents(events, 'service_matching', 'service_detected'),
          description: 'Users who selected a service',
          color: '#a78bfa'
        },
        {
          name: 'Emotional Analysis',
          value: countEvents(events, 'emotion_analysis', 'emotion_detected'),
          description: 'Users with emotional state analyzed',
          color: '#8b5cf6'
        },
        {
          name: 'Service Questions',
          value: countEvents(events, 'service_questions', 'question_answered'),
          description: 'Users who answered service questions',
          color: '#7c3aed'
        },
        {
          name: 'Completion',
          value: countEvents(events, 'conversation', 'message_received', true),
          description: 'Users who completed the process',
          color: '#6d28d9'
        }
      ];

      setFunnelData(steps);
    } catch (error) {
      console.error('Error fetching funnel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const countEvents = (
    events: any[],
    feature: string,
    action: string,
    isLast = false
  ): number => {
    const filtered = events.filter(e => 
      e.feature === feature && e.action === action
    );
    return isLast 
      ? new Set(filtered.map(e => e.user_id)).size
      : filtered.length;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversation Funnel</CardTitle>
        <CardDescription>Step-by-step conversion analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as FunnelStep;
                    return (
                      <div className="bg-white p-2 shadow rounded border">
                        <p className="font-medium">{data.name}</p>
                        <p className="text-sm text-gray-500">{data.description}</p>
                        <p className="font-bold">{data.value} users</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Funnel
                dataKey="value"
                data={funnelData}
                isAnimationActive
              >
                {funnelData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        {/* Step Details */}
        <div className="mt-6 space-y-4">
          {funnelData.map((step, index) => (
            <div key={step.name} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{step.name}</p>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{step.value}</p>
                {index > 0 && (
                  <p className="text-sm text-gray-500">
                    {Math.round((step.value / funnelData[index - 1].value) * 100)}% conversion
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 