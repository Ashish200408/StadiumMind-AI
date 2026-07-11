import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  className,
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        'absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm',
        className
      )}
    >
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h2 className="text-xl font-semibold text-foreground">StadiumMind AI</h2>
      <p className="text-sm text-muted-foreground mt-2">Loading...</p>
    </div>
  );
}
