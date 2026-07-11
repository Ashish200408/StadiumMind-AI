import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinOff } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4">
      <MapPinOff className="h-16 w-16 text-muted-foreground mb-4" />
      <h1 className="text-4xl font-extrabold tracking-tight mb-2">404</h1>
      <p className="text-lg font-medium text-foreground mb-2">Page Not Found</p>
      <p className="text-muted-foreground mb-6 max-w-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to={ROUTES.HOME}
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
      >
        Go Home
      </Link>
    </div>
  );
}
