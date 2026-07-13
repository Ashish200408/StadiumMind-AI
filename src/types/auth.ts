export type Role =
  | 'FAN'
  | 'VOLUNTEER'
  | 'ORGANIZER'
  | 'SECURITY'
  | 'TRANSPORT_COORDINATOR'
  | 'VENUE_STAFF'
  | 'ADMINISTRATOR';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string | null;
  role: Role;
  createdAt: string;
}
