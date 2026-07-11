import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function NoPermissionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4">
      <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-3xl font-bold tracking-tight mb-2">Access Denied</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        You do not have the required permissions to view this page. If you believe this is a
        mistake, please contact your administrator.
      </p>
      <Link
        to={ROUTES.HOME}
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
      >
        Return to Home
      </Link>
    </div>
  );
}
