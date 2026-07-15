export interface AIExplanation {
  recommendation: string;
  reasoning: string;
  supportingData: Record<string, string | number>;
  confidence: number;
  relatedAlertIds: string[];
  relatedTimelineEventIds: string[];
}

export interface DecisionSupportData {
  topRecommendedActions: ActionItem[];
  highestPriorityIncidents: IncidentItem[];
  operationalRisks: RiskItem[];
  resourceConstraints: ConstraintItem[];
  immediateActions: ActionItem[];
}

export interface ActionItem {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low' | 'Critical';
  department: string;
  estimatedImpact: string;
}

export interface IncidentItem {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Investigating' | 'Resolved';
  time: string;
}

export interface RiskItem {
  id: string;
  description: string;
  likelihood: 'High' | 'Medium' | 'Low';
  impact: 'High' | 'Medium' | 'Low';
}

export interface ConstraintItem {
  id: string;
  resource: string;
  currentLevel: number;
  threshold: number;
  status: 'Warning' | 'Critical';
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'AI_RECOMMENDATION' | 'ACCEPTED_ACTION' | 'INCIDENT_PROGRESS' | 'OPERATIONAL_EVENT';
  title: string;
  description: string;
  status?: string;
}

export type ReportType =
  | 'Executive Match Report'
  | 'Stadium Operations Report'
  | 'Incident Report'
  | 'Emergency Response Report'
  | 'Crowd Intelligence Report'
  | 'Mobility Report'
  | 'Accessibility Report'
  | 'Sustainability Report'
  | 'Volunteer Briefing'
  | 'Shift Handover Report'
  | 'Match Completion Report';

export interface GeneratedReport {
  id: string;
  type: ReportType;
  generatedTime: string;
  generatedBy: string;
  content: string;
  exportStatus: 'Pending' | 'Exported' | 'Failed' | 'None';
  reportSizeKb: number;
  summary: string;
}

export interface OperationalComparison {
  metric: string;
  currentValue: number;
  previousValue: number;
  trend: 'Up' | 'Down' | 'Stable';
  status: 'Good' | 'Warning' | 'Critical';
}
