import { Role } from '@/types/auth';

export const ROLES: Record<string, Role> = {
  FAN: 'FAN',
  VOLUNTEER: 'VOLUNTEER',
  ORGANIZER: 'ORGANIZER',
  SECURITY: 'SECURITY',
  TRANSPORT_COORDINATOR: 'TRANSPORT_COORDINATOR',
  VENUE_STAFF: 'VENUE_STAFF',
  ADMINISTRATOR: 'ADMINISTRATOR',
};

// Define what each role can access (Resource -> Action mappings or simple module access)
export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  FAN: ['view_events', 'purchase_tickets', 'view_profile'],
  VOLUNTEER: ['view_events', 'view_profile', 'view_assignments'],
  ORGANIZER: ['manage_events', 'manage_volunteers', 'view_reports', 'view_profile'],
  SECURITY: ['view_incidents', 'report_incident', 'view_cameras', 'view_profile'],
  TRANSPORT_COORDINATOR: ['manage_transport', 'view_traffic', 'view_profile'],
  VENUE_STAFF: ['manage_facilities', 'view_maintenance', 'view_profile'],
  ADMINISTRATOR: ['*'], // Has access to everything
};
