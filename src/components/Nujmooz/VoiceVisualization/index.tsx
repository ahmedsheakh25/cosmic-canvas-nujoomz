import React, { useEffect, useState, useCallback } from 'react';
import { VoiceVisualizationProps, AudioBar } from './types';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const NUM_BARS = 20;
const MIN_HEIGHT = 10;
const MAX_HEIGHT = 40;
const UPDATE_INTERVAL = 50;

export function VoiceVisualization({
  isRecording,
  progress,
  className
}: VoiceVisualizationProps) {
  const [bars, setBars] = useState<AudioBar[]>([]);

  const generateBars = useCallback(() => {
    return Array.from({ length: NUM_BARS }, () => ({
      height: Math.random() * (MAX_HEIGHT - MIN_HEIGHT) + MIN_HEIGHT,
      color: `hsl(${Math.random() * 60 + 200}, 100%, 50%)`
    }));
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRecording) {
      intervalId = setInterval(() => {
        setBars(generateBars());
      }, UPDATE_INTERVAL);
    } else {
      setBars([]);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRecording, generateBars]);

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex h-12 items-center justify-center">
        {isRecording ? (
          <div className="flex items-center gap-0.5">
            {bars.map((bar, index) => (
              <div
                key={index}
                className="w-1 rounded-full transition-all duration-100 ease-in-out"
                style={{
                  height: `${bar.height}px`,
                  backgroundColor: bar.color
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Voice recording visualization
          </div>
        )}
      </div>
      <Progress value={progress} className="h-1" />
    </div>
  );
} 