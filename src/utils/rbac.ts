import { Role } from '@/types/auth';
import { ROLE_PERMISSIONS, ROLES } from '@/config/roles';

/**
 * Checks if a role has a specific permission.
 */
export const hasPermission = (role: Role | undefined, permission: string): boolean => {
  if (!role) return false;

  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;

  return permissions.includes('*') || permissions.includes(permission);
};

/**
 * Checks if a user role has at least the required access level
 * (This is a simplified hierarchy check if needed, otherwise strict role check)
 */
export const hasRole = (userRole: Role | undefined, allowedRoles: Role[]): boolean => {
  if (!userRole) return false;
  if (userRole === ROLES.ADMINISTRATOR) return true; // Admins typically have access to everything

  return allowedRoles.includes(userRole);
};
