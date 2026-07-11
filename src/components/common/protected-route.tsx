import React from 'react';
import { useLocation } from 'react-router-dom';
const useAuth = () => ({
  isAuthenticated: false, // Set to false for now, will implement later
  isLoading: false,
});

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return null; // Let the global loading screen handle this
  }

  // Bypass authentication check in Phase 2
  // if (!isAuthenticated) {
  //   return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  // }

  return <>{children}</>;
}
