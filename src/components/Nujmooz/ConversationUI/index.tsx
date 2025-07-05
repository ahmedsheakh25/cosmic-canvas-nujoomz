import React from 'react';
import { ConversationUIProps } from './types';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ServiceQuestionFlow } from '../ServiceQuestionFlow';
import { cn } from '@/lib/utils';

export function ConversationUI({
  messages,
  currentQuestion,
  isProcessing,
  language,
  onSendMessage,
  onAnswerQuestion,
  className
}: ConversationUIProps) {
  return (
    <div className={cn('flex h-full flex-col', className)}>
      <div className="flex-1 overflow-y-auto">
        <MessageList
          messages={messages}
          language={language}
        />
      </div>

      {currentQuestion && onAnswerQuestion ? (
        <div className="border-t bg-card p-4">
          <ServiceQuestionFlow
            currentQuestion={currentQuestion}
            language={language}
            onAnswer={onAnswerQuestion}
            onComplete={() => onAnswerQuestion(currentQuestion.question.id, null)}
            isLoading={isProcessing}
          />
        </div>
      ) : (
        <div className="border-t">
          <MessageInput
            onSend={onSendMessage}
            isProcessing={isProcessing}
            language={language}
          />
        </div>
      )}
    </div>
  );
} 