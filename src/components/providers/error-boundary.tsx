import React from 'react';
import { ErrorBoundary as ReactErrorBoundary, FallbackProps } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="max-w-md w-full bg-card p-6 rounded-lg shadow-lg border border-border">
        <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong</h2>
        <div className="bg-muted p-4 rounded text-sm font-mono overflow-auto mb-6 text-muted-foreground">
          {error instanceof Error ? error.message : String(error)}
        </div>
        <button
          onClick={resetErrorBoundary}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export function AppErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the state of your app here
        window.location.href = '/';
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
}
