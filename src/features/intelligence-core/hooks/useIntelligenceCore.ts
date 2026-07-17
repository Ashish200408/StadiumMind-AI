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
    let timeoutId: NodeJS.Timeout;

    const debouncedAggregation = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        triggerAggregation();
      }, 500); // Debounce by 500ms to allow all underlying stores to update
    };

    // Perform initial aggregation
    debouncedAggregation();

    // Subscribe to all underlying stores
    const unsubCrowd = useCrowdStore.subscribe(debouncedAggregation);
    const unsubMobility = useMobilityStore.subscribe(debouncedAggregation);
    const unsubAccessibility = useAccessibilityStore.subscribe(debouncedAggregation);
    const unsubSustainability = useSustainabilityStore.subscribe(debouncedAggregation);
    const unsubEmergency = useEmergencyStore.subscribe(debouncedAggregation);
    const unsubNavigation = useNavigationStore.subscribe(debouncedAggregation);
    const unsubSimulation = useSimulationStore.subscribe(debouncedAggregation);

    return () => {
      unsubCrowd();
      unsubMobility();
      unsubAccessibility();
      unsubSustainability();
      unsubEmergency();
      unsubNavigation();
      unsubSimulation();
      clearTimeout(timeoutId);
    };
  }, []);
};
