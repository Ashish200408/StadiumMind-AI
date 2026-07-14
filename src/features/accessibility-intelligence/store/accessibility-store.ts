import { create } from 'zustand';
import {
  AccessibilityState,
  AccessibilityMetrics,
  AccessibilityDetection,
  AccessibilityRecommendation,
} from '../types';

interface AccessibilityStore extends AccessibilityState {
  setAccessibilityData: (
    metrics: AccessibilityMetrics,
    detections: AccessibilityDetection[],
    recommendations: AccessibilityRecommendation[]
  ) => void;
}

const defaultMetrics: AccessibilityMetrics = {
  accessibleRouteAvailability: 100,
  liftAvailability: 100,
  rampAvailability: 100,
  accessibleEntranceAvailability: 100,
  accessibleWashroomAvailability: 100,
  accessibleParkingAvailability: 100,
  crowdAccessibilityImpact: 0,
  travelDifficultyScore: 0,
  accessibilityScore: 100,
  comfortScore: 100,
  confidenceScore: 100,
};

export const useAccessibilityStore = create<AccessibilityStore>((set) => ({
  metrics: defaultMetrics,
  detections: [],
  recommendations: [],
  lastUpdated: new Date().toISOString(),

  setAccessibilityData: (metrics, detections, recommendations) =>
    set({
      metrics,
      detections,
      recommendations,
      lastUpdated: new Date().toISOString(),
    }),
}));
