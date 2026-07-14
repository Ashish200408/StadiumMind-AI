export interface StandardizedModule {
  moduleName: string;
  healthScore: number;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  confidenceScore: number;
  status: 'Active' | 'Inactive' | 'Degraded' | 'Offline';
  metrics: Record<string, number | string>;
  recommendations: string[];
  alerts: GlobalAlert[];
  lastUpdated: string;
}

export interface OverallScores {
  overallStadiumHealth: number; // 0-100
  overallOperationalRisk: number; // 0-100
  overallConfidence: number; // 0-100
  overallReadinessScore: number; // 0-100
  overallSustainabilityScore: number; // 0-100
  overallAccessibilityScore: number; // 0-100
  overallMobilityScore: number; // 0-100
  overallSafetyScore: number; // 0-100
}

export interface GlobalAlert {
  id: string;
  moduleSource: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  priority: number; // 1 (highest) to 4 (lowest)
  message: string;
  timestamp: string;
}

export interface GlobalRecommendation {
  id: string;
  moduleSource: string[]; // Can be aggregated from multiple modules
  action: string;
  priorityRank: number; // 1 (highest)
  targetArea?: string;
}

export interface ExecutiveSnapshot {
  operationalSnapshot: Record<string, any>;
  crowdSnapshot: Record<string, any>;
  mobilitySnapshot: Record<string, any>;
  accessibilitySnapshot: Record<string, any>;
  sustainabilitySnapshot: Record<string, any>;
  emergencySnapshot: Record<string, any>;
  generatedAt: string;
}

export interface GlobalEvent {
  id: string;
  timestamp: string;
  moduleSource: string;
  eventType: string;
  description: string;
  severity: 'Info' | 'Warning' | 'Error' | 'Critical';
  metadata?: Record<string, any>;
}

export interface UnifiedIntelligence {
  modules: Record<string, StandardizedModule>;
  overallScores: OverallScores;
  globalAlerts: GlobalAlert[];
  globalRecommendations: GlobalRecommendation[];
  snapshots: ExecutiveSnapshot | null;
  eventTimeline: GlobalEvent[];
}
