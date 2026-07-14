export type AccessibilityRisk = 'low' | 'moderate' | 'high' | 'critical';
export type RecommendationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type UserType =
  | 'wheelchair'
  | 'visually_impaired'
  | 'hearing_impaired'
  | 'senior_citizen'
  | 'family'
  | 'temporary_mobility';

export interface AccessibilityMetrics {
  accessibleRouteAvailability: number; // 0-100%
  liftAvailability: number; // 0-100%
  rampAvailability: number; // 0-100%
  accessibleEntranceAvailability: number; // 0-100%
  accessibleWashroomAvailability: number; // 0-100%
  accessibleParkingAvailability: number; // 0-100%
  crowdAccessibilityImpact: number; // 0-100 (higher = worse impact)
  travelDifficultyScore: number; // 0-100 (higher = harder)
  accessibilityScore: number; // 0-100 (overall score)
  comfortScore: number; // 0-100
  confidenceScore: number; // 0-100
}

export type AccessibilityDetectionType =
  | 'blocked_accessible_route'
  | 'unavailable_elevator'
  | 'high_crowd_barrier'
  | 'limited_accessible_parking'
  | 'emergency_accessibility_risk';

export interface AccessibilityDetection {
  id: string;
  type: AccessibilityDetectionType;
  message: string;
  severity: AccessibilityRisk;
  timestamp: string;
}

export type AccessibilityRecommendationType =
  | 'best_accessible_entrance'
  | 'best_accessible_route'
  | 'nearest_accessible_washroom'
  | 'nearest_lift'
  | 'nearest_medical_support'
  | 'alternative_accessible_route'
  | 'best_accessible_parking'
  | 'safe_waiting_zone';

export interface AccessibilityRecommendation {
  id: string;
  type: AccessibilityRecommendationType;
  title: string;
  description: string;
  priority: RecommendationPriority;
  targetId?: string;
}

export interface AccessibilityState {
  metrics: AccessibilityMetrics;
  detections: AccessibilityDetection[];
  recommendations: AccessibilityRecommendation[];
  lastUpdated: string;
}
