import React, { useState } from 'react';
import { QuestionFlowProps } from './types';
import { QuestionInput } from './QuestionInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function ServiceQuestionFlow({
  currentQuestion,
  language,
  onAnswer,
  onComplete,
  isLoading,
  className = ''
}: QuestionFlowProps) {
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);

  if (!currentQuestion) {
    return null;
  }

  const { question, metadata } = currentQuestion;
  const progress = (metadata.position / metadata.total) * 100;

  const handleSubmit = () => {
    if (!question.validation?.required || currentAnswer !== null) {
      onAnswer(question.id, currentAnswer);
      setCurrentAnswer(null);
    }
  };

  const handleSkip = () => {
    if (!question.validation?.required) {
      onAnswer(question.id, null);
      setCurrentAnswer(null);
    }
  };

  return (
    <Card className={`w-full max-w-lg ${className}`}>
      <CardContent className="pt-6">
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2 text-center">
            {language === 'ar'
              ? `السؤال ${metadata.position} من ${metadata.total}`
              : `Question ${metadata.position} of ${metadata.total}`}
          </p>
        </div>

        <QuestionInput
          question={question}
          value={currentAnswer}
          onChange={setCurrentAnswer}
          language={language}
          disabled={isLoading}
        />

        {metadata.estimatedTimeLeft > 0 && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            {language === 'ar'
              ? `الوقت المتبقي: ${metadata.estimatedTimeLeft} دقيقة`
              : `Estimated time left: ${metadata.estimatedTimeLeft} minutes`}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        {!question.validation?.required && (
          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={isLoading}
          >
            {language === 'ar' ? 'تخطي' : 'Skip'}
          </Button>
        )}
        <div className="flex gap-2">
          {metadata.position === metadata.total ? (
            <Button
              onClick={onComplete}
              disabled={isLoading || (question.validation?.required && !currentAnswer)}
            >
              {language === 'ar' ? 'إنهاء' : 'Complete'}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading || (question.validation?.required && !currentAnswer)}
            >
              {language === 'ar' ? 'التالي' : 'Next'}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
} 