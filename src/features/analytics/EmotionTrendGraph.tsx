import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { supabase } from '@/integrations/supabase/client';

interface EmotionDataPoint {
  timestamp: string;
  emotion: string;
  intensity: number;
  phase: string;
}

interface EmotionTrend {
  emotion: string;
  data: { timestamp: string; value: number }[];
}

export const EmotionTrendGraph = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emotionData, setEmotionData] = useState<EmotionDataPoint[]>([]);
  const [trends, setTrends] = useState<EmotionTrend[]>([]);

  useEffect(() => {
    fetchEmotionData();
  }, []);

  const fetchEmotionData = async () => {
    try {
      setLoading(true);

      const { data, error: dbError } = await supabase
        .from('emotional_analytics')
        .select('*')
        .order('created_at', { ascending: true });

      if (dbError) throw dbError;

      const processedData = data?.map((record: any) => ({
        timestamp: record.created_at,
        emotion: record.primary_emotion,
        intensity: record.intensity || 1,
        phase: record.conversation_phase,
      })) || [];

      setEmotionData(processedData);
      
      // Process trends
      const emotionTrends = processEmotionTrends(processedData);
      setTrends(emotionTrends);
    } catch (err) {
      setError('Failed to fetch emotion data');
      console.error('Emotion data error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Emotional Trends</CardTitle>
          <CardDescription>Loading emotion data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-64" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Emotional Trends</CardTitle>
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
        <CardTitle>Emotional Trends</CardTitle>
        <CardDescription>
          Analysis of emotional states across conversation phases
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Emotion Timeline */}
          <div className="relative h-64">
            {trends.map((trend, trendIndex) => (
              <div
                key={trend.emotion}
                className="absolute inset-x-0"
                style={{
                  height: '100%',
                  opacity: 0.7,
                }}
              >
                <svg
                  className="h-full w-full"
                  preserveAspectRatio="none"
                  viewBox={`0 0 ${trend.data.length} 100`}
                >
                  <path
                    d={generatePathD(trend.data)}
                    fill="none"
                    stroke={getEmotionColor(trend.emotion)}
                    strokeWidth="2"
                  />
                </svg>
              </div>
            ))}
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500">
              {trends[0]?.data.filter((_, i) => i % 4 === 0).map((point, i) => (
                <span key={i}>
                  {new Date(point.timestamp).toLocaleDateString()}
                </span>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4">
            {trends.map((trend) => (
              <div
                key={trend.emotion}
                className="flex items-center gap-2"
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: getEmotionColor(trend.emotion) }}
                />
                <span className="text-sm">{trend.emotion}</span>
              </div>
            ))}
          </div>

          {/* Phase Analysis */}
          <div>
            <h3 className="mb-4 text-sm font-medium">Phase Analysis</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {analyzePhases(emotionData).map((phase, index) => (
                <div
                  key={index}
                  className="rounded-lg border p-4"
                >
                  <div className="font-medium">{phase.name}</div>
                  <div className="mt-2 text-sm text-gray-500">
                    Dominant emotion: {phase.dominantEmotion}
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Average intensity: {phase.averageIntensity.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const processEmotionTrends = (data: EmotionDataPoint[]): EmotionTrend[] => {
  const emotions = Array.from(new Set(data.map(d => d.emotion)));
  
  return emotions.map(emotion => ({
    emotion,
    data: data
      .filter(d => d.emotion === emotion)
      .map(d => ({
        timestamp: d.timestamp,
        value: d.intensity
      }))
  }));
};

const generatePathD = (data: { timestamp: string; value: number }[]): string => {
  if (data.length === 0) return '';
  
  const maxValue = Math.max(...data.map(d => d.value));
  const points = data.map((d, i) => {
    const x = i;
    const y = 100 - (d.value / maxValue) * 100;
    return `${x},${y}`;
  });
  
  return `M ${points.join(' L ')}`;
};

const getEmotionColor = (emotion: string): string => {
  const colors: { [key: string]: string } = {
    happy: '#10B981', // green
    sad: '#6B7280', // gray
    angry: '#EF4444', // red
    neutral: '#3B82F6', // blue
    excited: '#F59E0B', // yellow
    frustrated: '#7C3AED', // purple
  };
  
  return colors[emotion.toLowerCase()] || '#6B7280';
};

const analyzePhases = (data: EmotionDataPoint[]) => {
  const phases = Array.from(new Set(data.map(d => d.phase)));
  
  return phases.map(phase => {
    const phaseData = data.filter(d => d.phase === phase);
    const emotions = phaseData.map(d => d.emotion);
    const dominantEmotion = mode(emotions);
    const averageIntensity = mean(phaseData.map(d => d.intensity));
    
    return {
      name: phase,
      dominantEmotion,
      averageIntensity
    };
  });
};

const mode = (arr: string[]): string => {
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length - arr.filter(v => v === b).length
  ).pop() || '';
};

const mean = (arr: number[]): number => {
  return arr.length > 0 ? arr.reduce((a, b) => a + b) / arr.length : 0;
}; 