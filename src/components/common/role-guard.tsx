import React from 'react';
import { Role } from '@/constants/roles';

// Placeholder for auth context/store
const useAuth = () => ({
  userRole: 'ORGANIZER' as Role | null, // Mock role for now
});

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export function RoleGuard({ children }: RoleGuardProps) {
  // Bypass role check in Phase 2
  // if (!userRole || !allowedRoles.includes(userRole)) {
  //   return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  // }

  return <>{children}</>;
}
