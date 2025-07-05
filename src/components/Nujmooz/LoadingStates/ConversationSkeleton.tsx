import React from 'react';
import { MessageSkeleton } from './MessageSkeleton';
import { QuestionSkeleton } from './QuestionSkeleton';
import { cn } from '@/lib/utils';

interface ConversationSkeletonProps {
  showQuestion?: boolean;
  className?: string;
}

export function ConversationSkeleton({
  showQuestion = false,
  className
}: ConversationSkeletonProps) {
  return (
    <div className={cn('flex h-full flex-col', className)}>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <MessageSkeleton type="user" />
        <MessageSkeleton type="assistant" />
        <MessageSkeleton type="user" />
        <MessageSkeleton type="assistant" />
      </div>

      {showQuestion ? (
        <div className="border-t bg-card p-4">
          <QuestionSkeleton />
        </div>
      ) : (
        <div className="border-t p-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <div className="h-[60px] rounded-md border bg-muted" />
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-10 rounded-md border bg-muted" />
              <div className="h-10 w-10 rounded-md border bg-muted" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 