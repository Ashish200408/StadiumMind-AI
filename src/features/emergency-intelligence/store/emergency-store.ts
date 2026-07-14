import { create } from 'zustand';
import {
  EmergencyIncident,
  CorrelatedIncident,
  IncidentDependency,
  StructuredEventLog,
  EmergencyMetrics,
  EmergencyKPIs,
  ResponseTeamStatus,
  PostIncidentSummary,
} from '../types';

interface EmergencyState {
  incidents: EmergencyIncident[];
  correlatedIncidents: CorrelatedIncident[];
  incidentDependencies: IncidentDependency[];
  eventLogs: StructuredEventLog[];
  postIncidentSummaries: PostIncidentSummary[];
  teamStatuses: ResponseTeamStatus[];
  metrics: EmergencyMetrics;
  kpis: EmergencyKPIs;

  // Actions
  addIncident: (incident: EmergencyIncident) => void;
  updateIncident: (id: string, updates: Partial<EmergencyIncident>) => void;
  addCorrelatedIncident: (correlation: CorrelatedIncident) => void;
  addDependency: (dependency: IncidentDependency) => void;
  addEventLog: (log: StructuredEventLog) => void;
  addPostIncidentSummary: (summary: PostIncidentSummary) => void;
  updateTeamStatus: (id: string, updates: Partial<ResponseTeamStatus>) => void;
  updateMetrics: (metrics: Partial<EmergencyMetrics>) => void;
  updateKPIs: (kpis: Partial<EmergencyKPIs>) => void;

  // Selectors/Getters (simulated in state for priority queue)
  getPriorityQueue: () => EmergencyIncident[];
}

// Initial dummy data for teams
const initialTeams: ResponseTeamStatus[] = [
  {
    id: 'med-1',
    type: 'Medical',
    availability: 5,
    currentAssignment: 'None',
    estimatedResponseTime: 3,
  },
  {
    id: 'sec-1',
    type: 'Security',
    availability: 10,
    currentAssignment: 'None',
    estimatedResponseTime: 2,
  },
  {
    id: 'maint-1',
    type: 'Maintenance',
    availability: 4,
    currentAssignment: 'None',
    estimatedResponseTime: 5,
  },
  {
    id: 'vol-1',
    type: 'Volunteer',
    availability: 20,
    currentAssignment: 'None',
    estimatedResponseTime: 8,
  },
];

const severityWeight = {
  Low: 1,
  Medium: 2,
  High: 3,
  Critical: 4,
};

const escalationWeight = {
  'Level 1': 1,
  'Level 2': 2,
  'Level 3': 3,
  'Level 4': 4,
};

export const useEmergencyStore = create<EmergencyState>((set, get) => ({
  incidents: [],
  correlatedIncidents: [],
  incidentDependencies: [],
  eventLogs: [],
  postIncidentSummaries: [],
  teamStatuses: initialTeams,
  metrics: {
    severityIndex: 0,
    priorityScore: 0,
    operationalRiskScore: 0,
    emergencyHealthScore: 100,
    confidenceScore: 100,
  },
  kpis: {
    totalActiveIncidents: 0,
    averageResponseTime: 0,
    criticalIncidents: 0,
    resourcesAvailable: 39,
    operationalReadinessScore: 100,
  },

  addIncident: (incident) =>
    set((state) => ({
      incidents: [...state.incidents, incident],
    })),

  updateIncident: (id, updates) =>
    set((state) => ({
      incidents: state.incidents.map((inc) => (inc.id === id ? { ...inc, ...updates } : inc)),
    })),

  addCorrelatedIncident: (correlation) =>
    set((state) => ({
      correlatedIncidents: [...state.correlatedIncidents, correlation],
    })),

  addDependency: (dependency) =>
    set((state) => ({
      incidentDependencies: [...state.incidentDependencies, dependency],
    })),

  addEventLog: (log) =>
    set((state) => ({
      eventLogs: [...state.eventLogs, log],
    })),

  addPostIncidentSummary: (summary) =>
    set((state) => ({
      postIncidentSummaries: [...state.postIncidentSummaries, summary],
    })),

  updateTeamStatus: (id, updates) =>
    set((state) => ({
      teamStatuses: state.teamStatuses.map((team) =>
        team.id === id ? { ...team, ...updates } : team
      ),
    })),

  updateMetrics: (updates) =>
    set((state) => ({
      metrics: { ...state.metrics, ...updates },
    })),

  updateKPIs: (updates) =>
    set((state) => ({
      kpis: { ...state.kpis, ...updates },
    })),

  getPriorityQueue: () => {
    const { incidents } = get();
    return [...incidents]
      .filter((inc) => inc.lifecycleState !== 'Closed' && inc.lifecycleState !== 'Resolved')
      .sort((a, b) => {
        // Sort by Severity first
        if (severityWeight[b.severity] !== severityWeight[a.severity]) {
          return severityWeight[b.severity] - severityWeight[a.severity];
        }
        // Then by Escalation Level
        if (escalationWeight[b.escalationLevel] !== escalationWeight[a.escalationLevel]) {
          return escalationWeight[b.escalationLevel] - escalationWeight[a.escalationLevel];
        }
        // Finally by timestamp (older first for fairness/urgency)
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
  },
}));
