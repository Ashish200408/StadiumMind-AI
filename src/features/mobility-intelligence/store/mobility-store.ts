import { create } from 'zustand';
import {
  MobilityState,
  MobilityMetrics,
  MobilityDetection,
  MobilityRecommendation,
} from '../types';

interface MobilityStore extends MobilityState {
  setMobilityData: (
    metrics: MobilityMetrics,
    detections: MobilityDetection[],
    recommendations: MobilityRecommendation[]
  ) => void;
}

const defaultMetrics: MobilityMetrics = {
  parkingScore: 100,
  transitScore: 100,
  mobilityScore: 100,
  travelDelay: 0,
  estimatedArrivalTime: new Date().toISOString(),
  estimatedDepartureTime: new Date(Date.now() + 7200000).toISOString(),
  roadCongestionScore: 0,
  transportReliability: 100,
  carbonImpactScore: 80,
  confidenceScore: 100,
};

export const useMobilityStore = create<MobilityStore>((set) => ({
  metrics: defaultMetrics,
  detections: [],
  recommendations: [],
  lastUpdated: new Date().toISOString(),

  setMobilityData: (metrics, detections, recommendations) =>
    set({
      metrics,
      detections,
      recommendations,
      lastUpdated: new Date().toISOString(),
    }),
}));
