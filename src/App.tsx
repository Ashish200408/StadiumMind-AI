import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/layouts/app-layout';
import { AuthLayout } from '@/layouts/auth-layout';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { ErrorPage } from '@/pages/error-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { NoPermissionPage } from '@/pages/no-permission-page';
import { EnvValidator } from '@/components/common/EnvValidator';

// Auth Pages
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';
import { ForgotPasswordPage } from '@/pages/auth/forgot-password';
import { VerifyEmailPage } from '@/pages/auth/verify-email';
import { SessionExpiredPage } from '@/pages/auth/session-expired';

// App Pages
import { ProfilePage } from '@/pages/profile';
import { SettingsPage } from '@/pages/settings';
import { HealthDashboard } from '@/pages/health/HealthDashboard';

// Common
import { ProtectedRoute } from '@/components/common/protected-route';
import { PublicRoute } from '@/components/common/public-route';
import { RoleGuard } from '@/components/auth/role-guard';
import { ROUTES } from '@/constants/routes';
import { ROLES } from '@/config/roles';

// Providers
import { AuthProvider } from '@/contexts/auth-context';

// Lazy load major features
const EmergencyIntelligencePage = lazy(() =>
  import('@/features/emergency-intelligence').then((module) => ({
    default: module.EmergencyIntelligencePage,
  }))
);
const CopilotPage = lazy(() =>
  import('@/features/ai-copilot').then((module) => ({ default: module.CopilotPage }))
);
const ExecutiveDashboard = lazy(() =>
  import('@/features/executive-intelligence').then((module) => ({
    default: module.ExecutiveDashboard,
  }))
);
const ReportsPage = lazy(() =>
  import('@/features/executive-intelligence').then((module) => ({
    default: module.ReportsPage,
  }))
);
const CrowdIntelligencePage = lazy(() =>
  import('@/features/crowd-intelligence').then((module) => ({
    default: module.CrowdIntelligencePage,
  }))
);
const NavigationIntelligencePage = lazy(() =>
  import('@/features/navigation-intelligence').then((module) => ({
    default: module.NavigationIntelligencePage,
  }))
);
const MobilityIntelligencePage = lazy(() =>
  import('@/features/mobility-intelligence').then((module) => ({
    default: module.MobilityIntelligencePage,
  }))
);
const AccessibilityIntelligencePage = lazy(() =>
  import('@/features/accessibility-intelligence').then((module) => ({
    default: module.AccessibilityIntelligencePage,
  }))
);
const SustainabilityIntelligencePage = lazy(() =>
  import('@/features/sustainability-intelligence').then((module) => ({
    default: module.SustainabilityIntelligencePage,
  }))
);

const LoadingFallback = () => (
  <div className="flex h-screen items-center justify-center bg-slate-950">
    <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
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
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ExecutiveDashboard />
              </Suspense>
            ),
          },
          {
            path: ROUTES.DASHBOARD,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ExecutiveDashboard />
              </Suspense>
            ),
          },
          {
            path: ROUTES.AI_COMMAND,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <CopilotPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.CROWD,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <CrowdIntelligencePage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.NAVIGATION,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <NavigationIntelligencePage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.TRANSPORT,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <MobilityIntelligencePage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.ACCESSIBILITY,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <AccessibilityIntelligencePage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.SUSTAINABILITY,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <SustainabilityIntelligencePage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.EMERGENCY,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <EmergencyIntelligencePage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.REPORTS,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <ReportsPage />
              </Suspense>
            ),
          },
          {
            path: ROUTES.PROFILE,
            element: <ProfilePage />,
          },
          {
            path: '/health',
            element: <HealthDashboard />,
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
                <Suspense fallback={<LoadingFallback />}>
                  <ExecutiveDashboard />
                </Suspense>
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

import { EngineInitializer } from '@/components/common/EngineInitializer';

function App() {
  return (
    <EnvValidator>
      <AuthProvider>
        <EngineInitializer />
        <RouterProvider router={router} />
      </AuthProvider>
    </EnvValidator>
  );
}

export default App;
