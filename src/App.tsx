import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/layouts/app-layout';
import { AuthLayout } from '@/layouts/auth-layout';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { ErrorPage } from '@/pages/error-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { NoPermissionPage } from '@/pages/no-permission-page';

// Auth Pages
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';
import { ForgotPasswordPage } from '@/pages/auth/forgot-password';
import { VerifyEmailPage } from '@/pages/auth/verify-email';
import { SessionExpiredPage } from '@/pages/auth/session-expired';

// App Pages
import { ProfilePage } from '@/pages/profile';
import { SettingsPage } from '@/pages/settings';

// Common
import { ProtectedRoute } from '@/components/common/protected-route';
import { PublicRoute } from '@/components/common/public-route';
import { RoleGuard } from '@/components/auth/role-guard';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/config/roles';

// Providers
import { AuthProvider } from '@/contexts/auth-context';

import { EmergencyIntelligencePage } from '@/features/emergency-intelligence';
import { CopilotPage } from '@/features/ai-copilot';

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex h-[80vh] flex-col items-center justify-center p-8 text-center">
    <h1 className="text-3xl font-bold">{title}</h1>
    <p className="mt-2 text-muted-foreground">
      Module UI shell created. Business logic will be implemented in future phases.
    </p>
  </div>
);

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTES.HOME,
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <PlaceholderPage title="Overview Dashboard" />,
          },
          {
            path: ROUTES.DASHBOARD,
            element: <PlaceholderPage title="Main Dashboard" />,
          },
          {
            path: ROUTES.AI_COMMAND,
            element: <CopilotPage />,
          },
          {
            path: ROUTES.CROWD,
            element: <PlaceholderPage title="Crowd Intelligence" />,
          },
          {
            path: ROUTES.NAVIGATION,
            element: <PlaceholderPage title="Smart Navigation" />,
          },
          {
            path: ROUTES.TRANSPORT,
            element: <PlaceholderPage title="Transport Optimization" />,
          },
          {
            path: ROUTES.ACCESSIBILITY,
            element: <PlaceholderPage title="Accessibility" />,
          },
          {
            path: ROUTES.SUSTAINABILITY,
            element: <PlaceholderPage title="Sustainability Metrics" />,
          },
          {
            path: ROUTES.EMERGENCY,
            element: <EmergencyIntelligencePage />,
          },
          {
            path: ROUTES.REPORTS,
            element: <PlaceholderPage title="Automated Reports" />,
          },
          {
            path: ROUTES.PROFILE,
            element: <ProfilePage />,
          },
          {
            path: ROUTES.SETTINGS,
            element: (
              <RoleGuard
                allowedRoles={[
                  ROLES.ADMINISTRATOR,
                  ROLES.ORGANIZER,
                  ROLES.FAN,
                  ROLES.VOLUNTEER,
                  ROLES.SECURITY,
                  ROLES.TRANSPORT_COORDINATOR,
                  ROLES.VENUE_STAFF,
                ]}
              >
                <SettingsPage />
              </RoleGuard>
            ),
          },
          // Example of a role-restricted route
          {
            path: '/admin',
            element: (
              <RoleGuard allowedRoles={[ROLES.ADMINISTRATOR]}>
                <PlaceholderPage title="Admin Panel" />
              </RoleGuard>
            ),
          },
        ],
      },
      {
        path: ROUTES.UNAUTHORIZED,
        element: <NoPermissionPage />,
      },
      {
        path: ROUTES.SESSION_EXPIRED,
        element: <SessionExpiredPage />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: ROUTES.REGISTER,
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: (
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        ),
      },
      {
        path: ROUTES.VERIFY_EMAIL,
        element: (
          <PublicRoute>
            <VerifyEmailPage />
          </PublicRoute>
        ),
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
