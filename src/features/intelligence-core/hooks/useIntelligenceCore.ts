import { useEffect } from 'react';
import { triggerAggregation } from '../services/aggregation-service';
import { useIntelligenceStore as useCrowdStore } from '../../crowd-intelligence/store/intelligence-store';
import { useMobilityStore } from '../../mobility-intelligence/store/mobility-store';
import { useAccessibilityStore } from '../../accessibility-intelligence/store/accessibility-store';
import { useSustainabilityStore } from '../../sustainability-intelligence/store/sustainability-store';
import { useEmergencyStore } from '../../emergency-intelligence/store/emergency-store';
import { useNavigationStore } from '../../navigation-intelligence/store/navigation-store';
import { useSimulationStore } from '../../simulation/store/simulation-store';

export const useIntelligenceCore = () => {
  useEffect(() => {
    // Perform initial aggregation
    triggerAggregation();

    // Subscribe to all underlying stores
    // When any of these stores change, we re-trigger the aggregation.
    // In a highly performant production app, we would use more granular selectors
    // or throttle this aggregation to prevent excessive re-renders.

    const unsubCrowd = useCrowdStore.subscribe(() => {
      triggerAggregation();
    });

    const unsubMobility = useMobilityStore.subscribe(() => {
      triggerAggregation();
    });

    const unsubAccessibility = useAccessibilityStore.subscribe(() => {
      triggerAggregation();
    });

    const unsubSustainability = useSustainabilityStore.subscribe(() => {
      triggerAggregation();
    });

    const unsubEmergency = useEmergencyStore.subscribe(() => {
      triggerAggregation();
    });

    const unsubNavigation = useNavigationStore.subscribe(() => {
      triggerAggregation();
    });

    const unsubSimulation = useSimulationStore.subscribe(() => {
      triggerAggregation();
    });

    // Alternatively, setting up a polling interval for fallback aggregation
    const interval = setInterval(() => {
      triggerAggregation();
    }, 5000);

    return () => {
      unsubCrowd();
      unsubMobility();
      unsubAccessibility();
      unsubSustainability();
      unsubEmergency();
      unsubNavigation();
      unsubSimulation();
      clearInterval(interval);
    };
  }, []);
};
