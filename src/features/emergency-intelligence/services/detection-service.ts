import { useEmergencyStore } from '../store/emergency-store';
import { generateRecommendations } from './recommendation-service';
import { logEvent } from './event-logger';
import {
  EmergencyType,
  EmergencySeverity,
  EmergencyIncident,
  OperationalImpactScore,
} from '../types';

// Mock dependencies on other stores to avoid actual imports failing if they don't exist perfectly
// In a real scenario, we would import useSimulationStore, useCrowdStore, etc.
const evaluateConditions = () => {
  // Simulating detection logic based on random thresholds for demonstration.
  // In a real system, this would read from other Zustands.
  const randomFactor = Math.random();

  if (randomFactor > 0.95) {
    const types: EmergencyType[] = [
      'Medical',
      'Security',
      'Fire',
      'Overcrowding',
      'Evacuation',
      'Power',
      'Water',
      'Infrastructure',
      'Weather',
      'Transport',
    ];
    const type = types[Math.floor(Math.random() * types.length)];

    const severities: EmergencySeverity[] = ['Low', 'Medium', 'High', 'Critical'];
    const severity = severities[Math.floor(Math.random() * severities.length)];

    triggerIncident(type, severity, `Zone ${Math.floor(Math.random() * 10) + 1}`);
  }
};

export const triggerIncident = (
  type: EmergencyType,
  severity: EmergencySeverity,
  location: string
) => {
  const store = useEmergencyStore.getState();
  const id = `inc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const impact: OperationalImpactScore = {
    crowdOperations: Math.floor(Math.random() * 100),
    mobility: Math.floor(Math.random() * 100),
    accessibility: Math.floor(Math.random() * 100),
    sustainability: Math.floor(Math.random() * 100),
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
