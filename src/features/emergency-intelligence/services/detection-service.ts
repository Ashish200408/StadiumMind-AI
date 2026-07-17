import { useEmergencyStore } from '../store/emergency-store';
import { useSimulationStore } from '../../simulation/store/simulation-store';
import { generateRecommendations } from './recommendation-service';
import { logEvent } from './event-logger';
import {
  EmergencyType,
  EmergencySeverity,
  EmergencyIncident,
  OperationalImpactScore,
} from '../types';

export const evaluateConditions = () => {
  const simulationState = useSimulationStore.getState();
  const emergencyStore = useEmergencyStore.getState();

  // 1. Resolve incidents that no longer exist in the simulation store
  emergencyStore.incidents.forEach((inc) => {
    if (
      !simulationState.incidents[inc.id] &&
      inc.lifecycleState !== 'Closed' &&
      inc.lifecycleState !== 'Resolved'
    ) {
      emergencyStore.updateIncident(inc.id, { lifecycleState: 'Resolved' });
    }
  });

  // 2. Sync Simulation Incidents to Emergency Incidents
  Object.values(simulationState.incidents).forEach((simIncident) => {
    // Only process if it doesn't already exist in emergency store
    if (!emergencyStore.incidents.find((inc) => inc.id === simIncident.id)) {
      const typeMap: Record<string, EmergencyType> = {
        security: 'Security',
        facility: 'Infrastructure',
        medical: 'Medical',
      };

      const type: EmergencyType = typeMap[simIncident.category] || 'Infrastructure';

      let severity: EmergencySeverity = 'Low';
      if (simIncident.severity === 'critical') severity = 'Critical';
      else if (simIncident.severity === 'high') severity = 'High';
      else if (simIncident.severity === 'medium') severity = 'Medium';

      triggerIncident(type, severity, simIncident.location.name, simIncident.id);
    }
  });
};

export const triggerIncident = (
  type: EmergencyType,
  severity: EmergencySeverity,
  location: string,
  id: string
) => {
  const store = useEmergencyStore.getState();

  const impact: OperationalImpactScore = {
    crowdOperations: severity === 'Critical' ? 90 : severity === 'High' ? 70 : 40,
    mobility: severity === 'Critical' ? 85 : severity === 'High' ? 60 : 30,
    accessibility: severity === 'Critical' ? 95 : severity === 'High' ? 75 : 50,
    sustainability: severity === 'Critical' ? 60 : severity === 'High' ? 40 : 20,
    overall: 0,
  };
  impact.overall = Math.round(
    (impact.crowdOperations + impact.mobility + impact.accessibility + impact.sustainability) / 4
  );

  const incident: EmergencyIncident = {
    id,
    type,
    severity,
    escalationLevel: 'Level 1',
    lifecycleState: 'Detected',
    location,
    timestamp: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    recommendedActions: generateRecommendations(type, severity, 'Level 1'),
    operationalImpact: impact,
    resolutionLogs: [],
  };

  store.addIncident(incident);

  logEvent(
    id,
    'DetectionService',
    'Incident Detected',
    severity,
    'None -> Detected',
    `Detected ${severity} ${type} emergency at ${location}`
  );
};

export const updateMetrics = () => {
  const store = useEmergencyStore.getState();
  const activeIncidents = store.incidents.filter(
    (i) => i.lifecycleState !== 'Closed' && i.lifecycleState !== 'Resolved'
  );

  const totalActiveIncidents = activeIncidents.length;
  const criticalIncidents = activeIncidents.filter((i) => i.severity === 'Critical').length;

  // Calculate a generic risk score
  let operationalRiskScore = 0;
  activeIncidents.forEach((inc) => {
    operationalRiskScore += inc.operationalImpact.overall;
  });
  if (totalActiveIncidents > 0) {
    operationalRiskScore = Math.min(
      100,
      Math.round(operationalRiskScore / totalActiveIncidents) + criticalIncidents * 10
    );
  }

  const emergencyHealthScore = Math.max(0, 100 - operationalRiskScore);

  store.updateKPIs({
    totalActiveIncidents,
    criticalIncidents,
    operationalReadinessScore: emergencyHealthScore,
  });

  store.updateMetrics({
    operationalRiskScore,
    emergencyHealthScore,
  });
};

export const runDetectionLoop = () => {
  evaluateConditions();
  updateMetrics();
};
