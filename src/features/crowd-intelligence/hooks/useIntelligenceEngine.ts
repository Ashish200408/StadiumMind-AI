import { useEffect, useRef } from 'react';
import { useSimulationStore } from '../../simulation/store/simulation-store';
import { useIntelligenceStore } from '../store/intelligence-store';
import { analyzeCrowdData } from '../services/analysis-service';
import { generateDetections } from '../services/detection-service';
import { generateRecommendations } from '../services/recommendation-service';

export function useIntelligenceEngine() {
  const isRunning = useSimulationStore((state) => state.isRunning);
  const crowd = useSimulationStore((state) => state.crowd);
  const gates = useSimulationStore((state) => state.gates);
  const lastUpdated = useSimulationStore((state) => state.lastUpdated);
  const updateIntelligence = useIntelligenceStore((state) => state.updateIntelligence);

  // Keep previous metrics for trend analysis
  const prevMetricsRef = useRef(useIntelligenceStore.getState().metrics);

  useEffect(() => {
    if (!isRunning) return;

    const currentMetrics = analyzeCrowdData(crowd, gates, prevMetricsRef.current);
    const detections = generateDetections(crowd, gates, currentMetrics);
    const recommendations = generateRecommendations(detections, currentMetrics);

    updateIntelligence(currentMetrics, detections, recommendations);

    prevMetricsRef.current = currentMetrics;
  }, [isRunning, crowd, gates, lastUpdated, updateIntelligence]);
}
