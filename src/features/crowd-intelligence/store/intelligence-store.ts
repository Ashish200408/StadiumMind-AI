import { create } from 'zustand';
import { IntelligenceState, IntelligenceMetrics, DetectionEvent, Recommendation } from '../types';

interface IntelligenceStore extends IntelligenceState {
  setMetrics: (metrics: IntelligenceMetrics) => void;
  setDetections: (detections: DetectionEvent[]) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;
  updateIntelligence: (
    metrics: IntelligenceMetrics,
    detections: DetectionEvent[],
    recommendations: Recommendation[]
  ) => void;
}

const defaultMetrics: IntelligenceMetrics = {
  congestionScore: 0,
  queuePressure: 0,
  gateUtilization: 0,
  crowdFlowTrend: 'stable',
  waitingTimeEstimate: 0,
  safeCapacityPercentage: 100,
  riskLevel: 'low',
  confidenceScore: 100,
};

export const useIntelligenceStore = create<IntelligenceStore>((set) => ({
  metrics: defaultMetrics,
  detections: [],
  recommendations: [],
  lastAnalyzed: new Date().toISOString(),

  setMetrics: (metrics) => set({ metrics, lastAnalyzed: new Date().toISOString() }),
  setDetections: (detections) => set({ detections, lastAnalyzed: new Date().toISOString() }),
  setRecommendations: (recommendations) =>
    set({ recommendations, lastAnalyzed: new Date().toISOString() }),

  updateIntelligence: (metrics, detections, recommendations) =>
    set({
      metrics,
      detections,
      recommendations,
      lastAnalyzed: new Date().toISOString(),
    }),
}));
