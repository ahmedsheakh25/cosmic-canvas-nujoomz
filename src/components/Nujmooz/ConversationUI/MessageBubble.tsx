import React from 'react';
import { MessageBubbleProps } from './types';
import { cn } from '@/lib/utils';
import { Mic } from 'lucide-react';

export function MessageBubble({ message, language, className }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const showEmotion = message.metadata?.emotion && !isUser;
  const showService = message.metadata?.service && !isUser;

  return (
    <div
      className={cn(
        'flex',
        isUser ? 'justify-end' : 'justify-start',
        className
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg p-4',
          isUser
            ? 'bg-primary text-primary-foreground'
            : isSystem
            ? 'bg-muted text-muted-foreground'
            : 'bg-secondary text-secondary-foreground',
          language === 'ar' ? 'text-right' : 'text-left'
        )}
      >
        <div className="flex items-center gap-2">
          {message.metadata?.isVoice && (
            <Mic className="h-4 w-4" />
          )}
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {(showEmotion || showService) && (
          <div className="mt-2 flex flex-wrap gap-2 text-xs opacity-80">
            {showEmotion && (
              <span className="rounded bg-background/10 px-1.5 py-0.5">
                {message.metadata.emotion}
              </span>
            )}
            {showService && (
              <span className="rounded bg-background/10 px-1.5 py-0.5">
                {message.metadata.service}
              </span>
            )}
          </div>
        )}

        <div className="mt-1 text-xs opacity-60">
          {new Date(message.timestamp).toLocaleTimeString(
            language === 'ar' ? 'ar-SA' : 'en-US',
            {
              hour: '2-digit',
              minute: '2-digit'
            }
          )}
        </div>
      </div>
    </div>
  );
} 