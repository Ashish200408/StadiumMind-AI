export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';
export type RecommendationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface CongestionData {
  score: number; // 0-100
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface IntelligenceMetrics {
  congestionScore: number;
  queuePressure: number; // 0-100
  gateUtilization: number; // 0-100
  crowdFlowTrend: 'increasing' | 'stable' | 'decreasing';
  waitingTimeEstimate: number; // in minutes (average)
  safeCapacityPercentage: number; // 0-100
  riskLevel: RiskLevel;
  confidenceScore: number; // 0-100
}

export interface DetectionEvent {
  id: string;
  type: 'congested_gate' | 'overcrowded_zone' | 'empty_gate' | 'crowd_surge' | 'queue_bottleneck';
  targetId: string;
  message: string;
  severity: RiskLevel;
  timestamp: string;
}

export interface Recommendation {
  id: string;
  actionType:
    'open_gate' | 'redirect_fans' | 'increase_volunteers' | 'broadcast_advisory' | 'adjust_routing';
  message: string;
  priority: RecommendationPriority;
  targetId?: string;
  timestamp: string;
}

export interface IntelligenceState {
  metrics: IntelligenceMetrics;
  detections: DetectionEvent[];
  recommendations: Recommendation[];
  lastAnalyzed: string;
}
