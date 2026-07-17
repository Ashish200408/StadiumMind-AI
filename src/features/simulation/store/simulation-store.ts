import { create } from 'zustand';
import {
  SimulationState,
  CrowdDensity,
  GateStatus,
  TransportStatus,
  EnvironmentStatus,
  ResourceUsage,
  Incident,
  VolunteerAvailability,
  MatchTimeline,
} from '../types';
import {
  generateInitialCrowd,
  generateInitialGates,
  generateInitialTransport,
  generateInitialEnvironment,
  generateInitialResources,
  generateInitialVolunteers,
  generateInitialTimeline,
} from '../utils/generators';

interface SimulationStore extends SimulationState {
  // Actions
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;

  // Updaters (used by the service)
  updateCrowd: (data: Record<string, CrowdDensity>) => void;
  updateGates: (data: Record<string, GateStatus>) => void;
  updateTransport: (data: Record<string, TransportStatus>) => void;
  updateEnvironment: (data: EnvironmentStatus) => void;
  updateResources: (data: ResourceUsage) => void;
  updateIncidents: (data: Record<string, Incident>) => void;
  updateVolunteers: (data: VolunteerAvailability) => void;
  updateTimeline: (data: MatchTimeline) => void;
}

const initialState: Omit<SimulationState, 'isRunning' | 'speed'> = {
  lastUpdated: new Date().toISOString(),
  crowd: generateInitialCrowd(),
  gates: generateInitialGates(),
  transport: generateInitialTransport(),
  environment: generateInitialEnvironment(),
  resources: generateInitialResources(),
  incidents: {},
  volunteers: generateInitialVolunteers(),
  timeline: generateInitialTimeline(),
};

export const useSimulationStore = create<SimulationStore>((set) => ({
  isRunning: true,
  speed: 1, // 1x normal speed, could be increased for faster simulation
  ...initialState,

  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),
  resume: () => set({ isRunning: true }),
  reset: () => set({ isRunning: true, ...initialState }),
  setSpeed: (speed) => set({ speed }),

  updateCrowd: (crowd) => set({ crowd, lastUpdated: new Date().toISOString() }),
  updateGates: (gates) => set({ gates, lastUpdated: new Date().toISOString() }),
  updateTransport: (transport) => set({ transport, lastUpdated: new Date().toISOString() }),
  updateEnvironment: (environment) => set({ environment, lastUpdated: new Date().toISOString() }),
  updateResources: (resources) => set({ resources, lastUpdated: new Date().toISOString() }),
  updateIncidents: (incidents) => set({ incidents, lastUpdated: new Date().toISOString() }),
  updateVolunteers: (volunteers) => set({ volunteers, lastUpdated: new Date().toISOString() }),
  updateTimeline: (timeline) => set({ timeline, lastUpdated: new Date().toISOString() }),
}));
