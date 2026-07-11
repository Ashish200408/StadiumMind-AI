import React from 'react';
import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl shadow-lg border border-border">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-foreground">StadiumMind AI</h2>
          <p className="mt-2 text-sm text-muted-foreground">The AI Brain Behind Every Match</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
