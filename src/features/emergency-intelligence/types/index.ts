export type EmergencyType =
  | 'Medical'
  | 'Security'
  | 'Fire'
  | 'Overcrowding'
  | 'Evacuation'
  | 'Power'
  | 'Water'
  | 'Infrastructure'
  | 'Weather'
  | 'Transport';

export type EmergencySeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type EscalationLevel = 'Level 1' | 'Level 2' | 'Level 3' | 'Level 4';
export type IncidentState =
  'Detected' | 'Verified' | 'In Progress' | 'Contained' | 'Resolved' | 'Closed';

export type ResponseAction =
  | 'Dispatch Medical Team'
  | 'Dispatch Security Team'
  | 'Open Emergency Exit'
  | 'Close Entrance'
  | 'Redirect Crowd'
  | 'Activate Evacuation Route'
  | 'Broadcast Emergency Message'
  | 'Deploy Additional Volunteers'
  | 'Request Maintenance'
  | 'Escalate Incident';

export type ResponseTeamType = 'Medical' | 'Security' | 'Maintenance' | 'Volunteer';

export interface ResponseTeamStatus {
  id: string;
  type: ResponseTeamType;
  availability: number;
  currentAssignment: string | 'None';
  estimatedResponseTime: number; // in minutes
}

export interface OperationalImpactScore {
  crowdOperations: number; // 0-100
  mobility: number; // 0-100
  accessibility: number; // 0-100
  sustainability: number; // 0-100
  overall: number; // 0-100
}

export interface StructuredEventLog {
  id: string;
  timestamp: string;
  incidentId: string;
  module: string;
  action: string;
  severity: EmergencySeverity;
  stateTransition?: string;
  details?: string;
}

export interface EmergencyIncident {
  id: string;
  type: EmergencyType;
  severity: EmergencySeverity;
  escalationLevel: EscalationLevel;
  lifecycleState: IncidentState;
  location: string;
  timestamp: string;
  lastUpdated: string;
  recommendedActions: ResponseAction[];
  operationalImpact: OperationalImpactScore;
  resolutionLogs: string[];
}

export interface CorrelatedIncident {
  id: string;
  primaryIncidentId: string;
  relatedIncidentIds: string[];
  combinedSeverity: EmergencySeverity;
  correlationReason: string;
  timestamp: string;
}

export interface IncidentDependency {
  id: string;
  sourceId: string;
  targetId: string;
  relationshipType: 'Causes' | 'Exacerbates' | 'OccursWith';
}

export interface PostIncidentSummary {
  incidentId: string;
  type: EmergencyType;
  startTime: string;
  endTime: string;
  peakSeverity: EmergencySeverity;
  actionsTaken: ResponseAction[];
  resolutionTimeMinutes: number;
}

export interface EmergencyMetrics {
  severityIndex: number; // 0-100
  priorityScore: number; // 0-100
  operationalRiskScore: number; // 0-100
  emergencyHealthScore: number; // 0-100
  confidenceScore: number; // 0-100
}

export interface EmergencyKPIs {
  totalActiveIncidents: number;
  averageResponseTime: number;
  criticalIncidents: number;
  resourcesAvailable: number;
  operationalReadinessScore: number;
}
