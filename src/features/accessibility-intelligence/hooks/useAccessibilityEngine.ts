import { useEffect, useRef } from 'react';
import { useSimulationStore } from '../../simulation/store/simulation-store';
import { useIntelligenceStore } from '../../crowd-intelligence/store/intelligence-store';
import { useMobilityStore } from '../../mobility-intelligence/store/mobility-store';
import { useAccessibilityStore } from '../store/accessibility-store';
import { calculateAccessibilityMetrics } from '../services/analysis-service';
import { generateAccessibilityDetections } from '../services/detection-service';
import { generateAccessibilityRecommendations } from '../services/recommendation-service';

export function useAccessibilityEngine() {
  const isRunning = useSimulationStore((state) => state.isRunning);
  const incidents = useSimulationStore((state) => state.incidents);

  const crowdMetrics = useIntelligenceStore((state) => state.metrics);
  const mobilityMetrics = useMobilityStore((state) => state.metrics);

  const setAccessibilityData = useAccessibilityStore((state) => state.setAccessibilityData);
  const prevMetricsRef = useRef(useAccessibilityStore.getState().metrics);

  useEffect(() => {
    if (!isRunning) return;

    const currentMetrics = calculateAccessibilityMetrics(crowdMetrics, mobilityMetrics, incidents);
    const detections = generateAccessibilityDetections(currentMetrics, incidents);
    const recommendations = generateAccessibilityRecommendations(detections, currentMetrics);

    setAccessibilityData(currentMetrics, detections, recommendations);

    prevMetricsRef.current = currentMetrics;
  }, [isRunning, incidents, crowdMetrics, mobilityMetrics, setAccessibilityData]);
}
