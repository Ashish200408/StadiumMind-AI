import { describe, it, expect, beforeEach } from 'vitest';
import { useEmergencyStore } from './emergency-store';

describe('Emergency Store', () => {
  beforeEach(() => {
    // Reset store state if needed, or use initial state
    useEmergencyStore.setState({
      incidents: [],
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
        resourcesAvailable: 100,
        operationalReadinessScore: 100,
      },
    });
  });

  it('correctly orders priority queue based on severity', () => {
    useEmergencyStore.getState().addIncident({
      id: 'inc-1',
      type: 'Medical',
      severity: 'Low',
      escalationLevel: 'Level 1',
      lifecycleState: 'Active' as any,
      location: 'Sector A',
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      recommendedActions: [],
      operationalImpact: {
        crowdOperations: 10,
        mobility: 10,
        accessibility: 10,
        sustainability: 10,
        overall: 10,
      },
      resolutionLogs: [],
    });

    useEmergencyStore.getState().addIncident({
      id: 'inc-2',
      type: 'Fire',
      severity: 'Critical',
      escalationLevel: 'Level 4',
      lifecycleState: 'Active' as any,
      location: 'Sector B',
      timestamp: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      recommendedActions: [],
      operationalImpact: {
        crowdOperations: 90,
        mobility: 90,
        accessibility: 90,
        sustainability: 90,
        overall: 90,
      },
      resolutionLogs: [],
    });

    const queue = useEmergencyStore.getState().getPriorityQueue();
    expect(queue.length).toBe(2);
    expect(queue[0].severity).toBe('Critical');
    expect(queue[1].severity).toBe('Low');
  });
});
