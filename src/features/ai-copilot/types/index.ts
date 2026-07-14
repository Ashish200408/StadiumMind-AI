export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

export const CopilotCapabilities = {
  EXECUTIVE_MATCH_SUMMARY: 'Executive Match Summary',
  OPERATIONAL_SITUATION_REPORT: 'Operational Situation Report',
  CROWD_EXPLANATION: 'Crowd Explanation',
  EMERGENCY_EXPLANATION: 'Emergency Explanation',
  MOBILITY_SUMMARY: 'Mobility Summary',
  ACCESSIBILITY_SUMMARY: 'Accessibility Summary',
  SUSTAINABILITY_SUMMARY: 'Sustainability Summary',
  OPERATIONAL_RISK_EXPLANATION: 'Operational Risk Explanation',
  ROOT_CAUSE_ANALYSIS: 'Root Cause Analysis',
  RECOMMENDATION_EXPLANATION: 'Recommendation Explanation',
  INCIDENT_TIMELINE_EXPLANATION: 'Incident Timeline Explanation',
  VOLUNTEER_BRIEFING: 'Volunteer Briefing',
  EXECUTIVE_BRIEFING: 'Executive Briefing',
  POST_MATCH_SUMMARY: 'Post Match Summary',
  WHAT_CHANGED: 'What changed in the last 15 minutes?',
} as const;

export type CopilotCapabilities = (typeof CopilotCapabilities)[keyof typeof CopilotCapabilities];

export interface PromptTemplate {
  objective: string;
  requiredOutput: string;
}

export interface AILogMetrics {
  id: string;
  requestTimestamp: string;
  responseTimestamp: string;
  processingTimeMs: number;
  promptSizeBytes: number;
  responseSizeBytes: number;
  cacheHit: boolean;
  errorCategory?: string;
}
