import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface MessageSkeletonProps {
  type: 'user' | 'assistant';
  className?: string;
}

export function MessageSkeleton({ type, className }: MessageSkeletonProps) {
  return (
    <div
      className={cn(
        'flex',
        type === 'user' ? 'justify-end' : 'justify-start',
        className
      )}
    >
      <div
        className={cn(
          'max-w-[80%] space-y-2',
          type === 'user' ? 'items-end' : 'items-start'
        )}
      >
        <Skeleton
          className={cn(
            'h-12 w-48 rounded-lg',
            type === 'user' ? 'bg-primary/20' : 'bg-secondary/20'
          )}
        />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
} 