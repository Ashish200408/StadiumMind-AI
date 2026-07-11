import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@/layouts/app-layout';
import { AuthLayout } from '@/layouts/auth-layout';
import { DashboardLayout } from '@/layouts/dashboard-layout';
import { ErrorPage } from '@/pages/error-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { NoPermissionPage } from '@/pages/no-permission-page';
import { ProtectedRoute } from '@/components/common/protected-route';
import { ROUTES } from '@/constants/routes';

const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTES.HOME,
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: (
              <div className="flex flex-col items-center justify-center h-[50vh]">
                <h1 className="text-3xl font-bold mb-2">Welcome to StadiumMind AI</h1>
                <p className="text-muted-foreground">Foundation setup complete.</p>
              </div>
            ),
          },
          {
            path: ROUTES.DASHBOARD,
            element: (
              <ProtectedRoute>
                <div className="p-4 bg-card border rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                  <p className="text-muted-foreground">Business logic goes here in Phase 3.</p>
                </div>
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: ROUTES.UNAUTHORIZED,
        element: <NoPermissionPage />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <div className="text-center p-4">Login Page Placeholder</div>,
      },
      {
        path: ROUTES.REGISTER,
        element: <div className="text-center p-4">Register Page Placeholder</div>,
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: <NotFoundPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
