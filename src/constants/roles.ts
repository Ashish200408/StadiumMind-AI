export const ROLES = {
  FAN: 'FAN',
  VOLUNTEER: 'VOLUNTEER',
  VENUE_STAFF: 'VENUE_STAFF',
  SECURITY: 'SECURITY',
  TRANSPORT: 'TRANSPORT',
  ORGANIZER: 'ORGANIZER',
} as const;

export type Role = keyof typeof ROLES;
