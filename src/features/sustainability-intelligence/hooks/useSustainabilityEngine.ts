import { useEffect, useRef } from 'react';
import { useSimulationStore } from '../../simulation/store/simulation-store';
import { useIntelligenceStore } from '../../crowd-intelligence/store/intelligence-store';
import { useMobilityStore } from '../../mobility-intelligence/store/mobility-store';
import { useSustainabilityStore } from '../store/sustainability-store';
import { calculateSustainabilityMetrics } from '../services/analysis-service';
import { generateSustainabilityDetections } from '../services/detection-service';
import { generateSustainabilityRecommendations } from '../services/recommendation-service';

export function useSustainabilityEngine() {
  const isRunning = useSimulationStore((state) => state.isRunning);
  const resources = useSimulationStore((state) => state.resources);

  const crowdMetrics = useIntelligenceStore((state) => state.metrics);
  const mobilityMetrics = useMobilityStore((state) => state.metrics);

  const setSustainabilityData = useSustainabilityStore((state) => state.setSustainabilityData);
  const prevMetricsRef = useRef(useSustainabilityStore.getState().metrics);

  useEffect(() => {
    if (!isRunning) return;

    const currentMetrics = calculateSustainabilityMetrics(resources, crowdMetrics, mobilityMetrics);
    const detections = generateSustainabilityDetections(currentMetrics);
    const recommendations = generateSustainabilityRecommendations(detections, currentMetrics);

    setSustainabilityData(currentMetrics, detections, recommendations);

    prevMetricsRef.current = currentMetrics;
  }, [isRunning, resources, crowdMetrics, mobilityMetrics, setSustainabilityData]);
}
