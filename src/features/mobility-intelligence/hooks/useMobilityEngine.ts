import { useEffect, useRef } from 'react';
import { useSimulationStore } from '../../simulation/store/simulation-store';
import { useIntelligenceStore } from '../../crowd-intelligence/store/intelligence-store';
import { useMobilityStore } from '../store/mobility-store';
import { calculateMobilityMetrics } from '../services/analysis-service';
import { generateMobilityDetections } from '../services/detection-service';
import { generateMobilityRecommendations } from '../services/recommendation-service';

export function useMobilityEngine() {
  const isRunning = useSimulationStore((state) => state.isRunning);
  const transport = useSimulationStore((state) => state.transport);
  const crowdMetrics = useIntelligenceStore((state) => state.metrics);
  const lastAnalyzedCrowd = useIntelligenceStore((state) => state.lastAnalyzed);
  const setMobilityData = useMobilityStore((state) => state.setMobilityData);

  const prevMetricsRef = useRef(useMobilityStore.getState().metrics);

  useEffect(() => {
    if (!isRunning) return;

    const currentMetrics = calculateMobilityMetrics(transport, crowdMetrics);

    // Smooth transitions if needed, but for now we take calculated directly
    const finalMetrics = { ...currentMetrics };

    const detections = generateMobilityDetections(transport, crowdMetrics, finalMetrics);
    const recommendations = generateMobilityRecommendations(detections, finalMetrics);

    setMobilityData(finalMetrics, detections, recommendations);

    prevMetricsRef.current = finalMetrics;
  }, [isRunning, transport, crowdMetrics, lastAnalyzedCrowd, setMobilityData]);
}
