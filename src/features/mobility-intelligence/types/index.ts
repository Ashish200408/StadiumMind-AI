export type MobilityRisk = 'low' | 'moderate' | 'high' | 'critical';
export type RecommendationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface MobilityMetrics {
  parkingScore: number; // 0-100
  transitScore: number; // 0-100
  mobilityScore: number; // 0-100
  travelDelay: number; // minutes
  estimatedArrivalTime: string; // ISO string or time string
  estimatedDepartureTime: string; // ISO string or time string
  roadCongestionScore: number; // 0-100
  transportReliability: number; // 0-100
  carbonImpactScore: number; // 0-100 (lower is better impact, or 100 means very eco-friendly)
  confidenceScore: number; // 0-100
}

export type DetectionType =
  | 'parking_full'
  | 'road_congestion'
  | 'metro_delays'
  | 'bus_overload'
  | 'ride_share_saturation'
  | 'walking_congestion';

export interface MobilityDetection {
  id: string;
  type: DetectionType;
  message: string;
  severity: MobilityRisk;
  timestamp: string;
}

export type RecommendationType =
  | 'best_parking'
  | 'best_bus'
  | 'best_metro'
  | 'best_walking'
  | 'best_ride_share'
  | 'recommended_departure'
  | 'alternative_transport'
  | 'alternative_exit'
  | 'carbon_friendly';

export interface MobilityRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  priority: RecommendationPriority;
  targetId?: string;
}

export interface MobilityState {
  metrics: MobilityMetrics;
  detections: MobilityDetection[];
  recommendations: MobilityRecommendation[];
  lastUpdated: string;
}
