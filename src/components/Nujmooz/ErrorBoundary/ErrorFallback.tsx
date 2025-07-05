import React from 'react';
import { ErrorFallbackProps } from './types';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export function ErrorFallback({
  error,
  resetErrorBoundary,
  language = 'en'
}: ErrorFallbackProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <h2 className="mt-4 text-lg font-semibold">
        {language === 'ar'
          ? 'عذراً، حدث خطأ غير متوقع'
          : 'Oops! Something went wrong'}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {language === 'ar'
          ? 'يرجى المحاولة مرة أخرى أو الاتصال بالدعم إذا استمرت المشكلة'
          : 'Please try again or contact support if the problem persists'}
      </p>
      <div className="mt-4 flex gap-2">
        <Button
          variant="outline"
          onClick={() => {
            window.location.reload();
          }}
        >
          {language === 'ar' ? 'تحديث الصفحة' : 'Refresh Page'}
        </Button>
        <Button onClick={resetErrorBoundary}>
          {language === 'ar' ? 'حاول مرة أخرى' : 'Try Again'}
        </Button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-4 max-w-full overflow-auto rounded bg-muted p-4 text-left text-sm">
          <code>{error.message}</code>
        </pre>
      )}
    </div>
  );
} 