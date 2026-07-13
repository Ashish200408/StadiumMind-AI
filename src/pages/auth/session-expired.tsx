import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export function SessionExpiredPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-4xl font-bold mb-4 tracking-tight">Session Expired</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        For your security, your session has expired due to inactivity. Please sign in again to
        continue.
      </p>
      <Link
        to={ROUTES.LOGIN}
        className="px-6 py-2 text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
      >
        Return to Login
      </Link>
    </div>
  );
}
