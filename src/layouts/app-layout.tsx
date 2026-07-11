import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ToastProvider } from '@/components/providers/toast-provider';
import { DialogProvider } from '@/components/providers/dialog-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { AppErrorBoundary } from '@/components/providers/error-boundary';

export function AppLayout() {
  return (
    <AppErrorBoundary>
      <QueryProvider>
        <ThemeProvider defaultTheme="system" storageKey="stadium-mind-theme">
          <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
            <Outlet />
            <ToastProvider />
            <DialogProvider />
          </div>
        </ThemeProvider>
      </QueryProvider>
    </AppErrorBoundary>
  );
}
