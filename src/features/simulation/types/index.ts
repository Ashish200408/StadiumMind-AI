export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'active' | 'inactive' | 'warning' | 'error' | 'resolved';

export interface Location {
  lat: number;
  lng: number;
  name: string;
  zone?: string;
}

export interface BaseSimulationData {
  id: string;
  timestamp: string;
  status: Status;
  severity: Severity;
  confidence: number; // 0 to 1
  location: Location;
}

export interface CrowdDensity extends BaseSimulationData {
  type: 'crowd_density';
  density: number; // 0 to 100
  capacity: number;
  currentCount: number;
}

export interface GateStatus extends BaseSimulationData {
  type: 'gate_status';
  isOpen: boolean;
  throughputPerMinute: number;
  queueLength: number;
  estimatedWaitTime: number; // in minutes
}

export interface TransportStatus extends BaseSimulationData {
  type: 'transport_status';
  mode: 'parking' | 'bus' | 'metro';
  occupancy: number; // 0 to 100
  availability: number;
  nextArrival?: string;
}

export interface EnvironmentStatus extends BaseSimulationData {
  type: 'environment_status';
  weather: 'sunny' | 'cloudy' | 'rain' | 'storm';
  temperature: number; // Celsius
  humidity: number;
  windSpeed: number;
}

export interface ResourceUsage extends BaseSimulationData {
  type: 'resource_usage';
  energyUsage: number; // kW
  waterConsumption: number; // Liters
  wasteLevel: number; // 0 to 100 percentage
}

export interface Incident extends BaseSimulationData {
  type: 'incident';
  category: 'medical' | 'security' | 'facility';
  description: string;
  assignedTo?: string; // Volunteer or security ID
}

export interface VolunteerAvailability extends BaseSimulationData {
  type: 'volunteer_availability';
  totalActive: number;
  totalRequired: number;
  freeCount: number;
}

export interface MatchTimeline {
  phase: 'pre_match' | 'first_half' | 'halftime' | 'second_half' | 'post_match' | 'inactive';
  minute: number;
  homeScore: number;
  awayScore: number;
}

export interface SimulationState {
  isRunning: boolean;
  speed: number;
  lastUpdated: string;

  // Data stores
  crowd: Record<string, CrowdDensity>;
  gates: Record<string, GateStatus>;
  transport: Record<string, TransportStatus>;
  environment: EnvironmentStatus | null;
  resources: ResourceUsage | null;
  incidents: Record<string, Incident>;
  volunteers: VolunteerAvailability | null;
  timeline: MatchTimeline;
}
