import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function ErrorPage() {
  const error = useRouteError();

  let errorMessage = 'An unexpected error occurred.';
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-3xl font-bold tracking-tight mb-2">Oops!</h1>
      <p className="text-muted-foreground mb-6 max-w-md">{errorMessage}</p>
      <Link
        to={ROUTES.HOME}
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
      >
        Return to Safety
      </Link>
    </div>
  );
}
