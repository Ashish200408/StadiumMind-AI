import {
  CrowdDensity,
  GateStatus,
  TransportStatus,
  EnvironmentStatus,
  ResourceUsage,
  VolunteerAvailability,
  MatchTimeline,
} from '../types';

// Deterministic random number generator based on a seed
export function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Generates a believable fluctuation around a base value using time
export function generateFluctuation(
  base: number,
  variance: number,
  timeStep: number,
  speed: number = 1
): number {
  const time = Date.now() / (10000 / speed) + timeStep;
  // Combine multiple sine waves for a more natural look
  const wave = (Math.sin(time) + Math.sin(time * 2.5 + 1) * 0.5) / 1.5;
  return Math.max(0, base + wave * variance);
}

// Generate base crowd data
export const generateInitialCrowd = (): Record<string, CrowdDensity> => {
  const zones = [
    'North Stand',
    'South Stand',
    'East Stand',
    'West Stand',
    'VIP Lounge',
    'Fan Zone',
  ];
  const record: Record<string, CrowdDensity> = {};

  zones.forEach((zone, index) => {
    const capacity = zone.includes('VIP') ? 2000 : zone.includes('Fan') ? 15000 : 20000;
    const initialDensity = 10 + index * 5; // 10% to 35% initially

    record[`zone-${index}`] = {
      id: `crowd-zone-${index}`,
      timestamp: new Date().toISOString(),
      status: 'active',
      severity: 'low',
      confidence: 0.95,
      location: { lat: 25.0, lng: 51.5, name: zone, zone: zone },
      type: 'crowd_density',
      density: initialDensity,
      capacity,
      currentCount: Math.floor((initialDensity / 100) * capacity),
    };
  });

  return record;
};

// Generate base gate data
export const generateInitialGates = (): Record<string, GateStatus> => {
  const record: Record<string, GateStatus> = {};

  for (let i = 1; i <= 8; i++) {
    record[`gate-${i}`] = {
      id: `gate-${i}`,
      timestamp: new Date().toISOString(),
      status: 'active',
      severity: 'low',
      confidence: 0.99,
      location: {
        lat: 25.0 + i * 0.001,
        lng: 51.5 - i * 0.001,
        name: `Gate ${i}`,
        zone: `Perimeter ${i % 2 === 0 ? 'A' : 'B'}`,
      },
      type: 'gate_status',
      isOpen: true,
      throughputPerMinute: 45,
      queueLength: 20 + i * 5,
      estimatedWaitTime: 5,
    };
  }

  return record;
};

// Generate base transport data
export const generateInitialTransport = (): Record<string, TransportStatus> => {
  return {
    'parking-a': {
      id: 'parking-a',
      timestamp: new Date().toISOString(),
      status: 'active',
      severity: 'low',
      confidence: 0.98,
      location: { lat: 25.01, lng: 51.51, name: 'North Parking' },
      type: 'transport_status',
      mode: 'parking',
      occupancy: 45,
      availability: 550,
    },
    'bus-station': {
      id: 'bus-station',
      timestamp: new Date().toISOString(),
      status: 'active',
      severity: 'low',
      confidence: 0.9,
      location: { lat: 25.02, lng: 51.52, name: 'Main Bus Terminal' },
      type: 'transport_status',
      mode: 'bus',
      occupancy: 60,
      availability: 12, // buses waiting
      nextArrival: new Date(Date.now() + 300000).toISOString(),
    },
    'metro-station': {
      id: 'metro-station',
      timestamp: new Date().toISOString(),
      status: 'active',
      severity: 'low',
      confidence: 0.99,
      location: { lat: 25.03, lng: 51.5, name: 'Stadium Metro' },
      type: 'transport_status',
      mode: 'metro',
      occupancy: 30,
      availability: 1,
      nextArrival: new Date(Date.now() + 180000).toISOString(),
    },
  };
};

export const generateInitialEnvironment = (): EnvironmentStatus => ({
  id: 'env-1',
  timestamp: new Date().toISOString(),
  status: 'active',
  severity: 'low',
  confidence: 1,
  location: { lat: 25.0, lng: 51.5, name: 'Stadium Roof Sensor' },
  type: 'environment_status',
  weather: 'sunny',
  temperature: 28.5,
  humidity: 45,
  windSpeed: 12,
});

export const generateInitialResources = (): ResourceUsage => ({
  id: 'res-1',
  timestamp: new Date().toISOString(),
  status: 'active',
  severity: 'low',
  confidence: 0.99,
  location: { lat: 25.0, lng: 51.5, name: 'Main Utility Center' },
  type: 'resource_usage',
  energyUsage: 4500, // kW
  waterConsumption: 12000, // L
  wasteLevel: 15, // %
});

export const generateInitialVolunteers = (): VolunteerAvailability => ({
  id: 'vol-1',
  timestamp: new Date().toISOString(),
  status: 'active',
  severity: 'low',
  confidence: 0.95,
  location: { lat: 25.0, lng: 51.5, name: 'Volunteer HQ' },
  type: 'volunteer_availability',
  totalActive: 450,
  totalRequired: 500,
  freeCount: 85,
});

export const generateInitialTimeline = (): MatchTimeline => ({
  phase: 'pre_match',
  minute: -120, // 2 hours before match
  homeScore: 0,
  awayScore: 0,
});
