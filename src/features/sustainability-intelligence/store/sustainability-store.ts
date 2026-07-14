import { create } from 'zustand';
import {
  SustainabilityState,
  SustainabilityMetrics,
  SustainabilityDetection,
  SustainabilityRecommendation,
} from '../types';

interface SustainabilityStore extends SustainabilityState {
  setSustainabilityData: (
    metrics: SustainabilityMetrics,
    detections: SustainabilityDetection[],
    recommendations: SustainabilityRecommendation[]
  ) => void;
}

const defaultMetrics: SustainabilityMetrics = {
  energyConsumption: 0,
  waterConsumption: 0,
  wasteGeneration: 0,
  plasticWaste: 0,
  carbonImpact: 0,
  transportEmissions: 0,
  resourceEfficiency: 100,
  recyclingEfficiency: 100,
  carbonFootprintScore: 100,
  resourceEfficiencyScore: 100,
  wasteDiversionScore: 100,
  environmentalHealthScore: 100,
  greenMobilityScore: 100,
  overallSustainabilityScore: 100,
  confidenceScore: 100,
};

export const useSustainabilityStore = create<SustainabilityStore>((set) => ({
  metrics: defaultMetrics,
  detections: [],
  recommendations: [],
  lastUpdated: new Date().toISOString(),

  setSustainabilityData: (metrics, detections, recommendations) =>
    set({
      metrics,
      detections,
      recommendations,
      lastUpdated: new Date().toISOString(),
    }),
}));
