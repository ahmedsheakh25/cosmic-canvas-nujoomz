import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuestionSkeletonProps {
  className?: string;
}

export function QuestionSkeleton({ className }: QuestionSkeletonProps) {
  return (
    <Card className={cn('w-full max-w-lg', className)}>
      <CardContent className="pt-6">
        <div className="mb-4">
          <Skeleton className="h-2 w-full" />
          <div className="mt-2 text-center">
            <Skeleton className="mx-auto h-4 w-24" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center">
          <Skeleton className="mx-auto h-4 w-32" />
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Skeleton className="h-9 w-16" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
        </div>
      </CardFooter>
    </Card>
  );
} 