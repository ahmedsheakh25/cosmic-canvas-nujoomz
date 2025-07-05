import React, { useEffect, useRef } from 'react';
import { MessageListProps } from './types';
import { MessageBubble } from './MessageBubble';
import { cn } from '@/lib/utils';

export function MessageList({ messages, language, className }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={cn('flex flex-col space-y-4 p-4', className)}>
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          language={language}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
} 