import { useEffect, useRef } from 'react';
import { useSimulationStore } from '../../simulation/store/simulation-store';
import { useIntelligenceStore } from '../../crowd-intelligence/store/intelligence-store';
import { useNavigationStore } from '../store/navigation-store';
import { initializeStadiumGraph } from '../services/graph-service';
import { generateNavigationRecommendations } from '../services/recommendation-service';
import { calculateRoute } from '../services/routing-service';

export function useNavigationEngine() {
  const isRunning = useSimulationStore((state) => state.isRunning);
  const incidents = useSimulationStore((state) => state.incidents);
  const crowd = useSimulationStore((state) => state.crowd);

  const metrics = useIntelligenceStore((state) => state.metrics);
  const lastAnalyzed = useIntelligenceStore((state) => state.lastAnalyzed);

  const setGraph = useNavigationStore((state) => state.setGraph);
  const setRecommendations = useNavigationStore((state) => state.setRecommendations);
  const setActiveRoute = useNavigationStore((state) => state.setActiveRoute);

  const graphRef = useRef(initializeStadiumGraph());

  useEffect(() => {
    // Initial graph setup
    setGraph(graphRef.current.nodes, graphRef.current.edges);
  }, [setGraph]);

  useEffect(() => {
    if (!isRunning) return;

    // Determine if there's an emergency
    const hasEmergency = Object.values(incidents).some(
      (inc) => inc.category === 'security' || inc.category === 'medical'
    );

    // Update node base congestions using simulation crowd data
    const nodes = { ...graphRef.current.nodes };
    Object.values(crowd).forEach((zone) => {
      // Map simulation zone IDs to graph node IDs (mocking here)
      // Example: 'zone_a' matches a simulation crowd id if they share logic.
      // We'll just update based on the global congestion for this simple example,
      // or if there's a matching node id.
      if (nodes[zone.id]) {
        nodes[zone.id].baseCongestion = zone.density;
      }
    });

    graphRef.current.nodes = nodes;
    setGraph(nodes, graphRef.current.edges);

    // Generate recommendations based on new state
    const recommendations = generateNavigationRecommendations(
      nodes,
      graphRef.current.edges,
      metrics.congestionScore,
      hasEmergency
    );

    setRecommendations(recommendations);

    // If an active route is set, we might want to recalculate it
    const currentActive = useNavigationStore.getState().activeRoute;
    if (currentActive) {
      const segments = currentActive.segments;
      if (segments.length > 0) {
        const start = segments[0].nodeId;
        const end = segments[segments.length - 1].nodeId;
        const newRoute = calculateRoute(
          start,
          end,
          nodes,
          graphRef.current.edges,
          currentActive.type,
          { congestionScore: metrics.congestionScore, accessibilityRequired: false }
        );
        setActiveRoute(newRoute);
      }
    }
  }, [
    isRunning,
    lastAnalyzed,
    incidents,
    crowd,
    metrics.congestionScore,
    setGraph,
    setRecommendations,
    setActiveRoute,
  ]);
}
