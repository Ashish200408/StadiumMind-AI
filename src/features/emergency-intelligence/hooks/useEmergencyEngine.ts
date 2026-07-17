import { useEffect } from 'react';
import { useSimulationStore } from '../../simulation/store/simulation-store';
import { runDetectionLoop } from '../services/detection-service';
import { evaluateEscalation } from '../services/escalation-engine';
import { evaluateCorrelations } from '../services/correlation-engine';
import { optimizeResources } from '../services/resource-optimizer';

export const useEmergencyEngine = () => {
  const isRunning = useSimulationStore((state) => state.isRunning);
  const incidents = useSimulationStore((state) => state.incidents);

  useEffect(() => {
    if (!isRunning) return;

    // Run the emergency evaluation synchronously when simulation incidents or run state changes
    runDetectionLoop();
    evaluateEscalation();
    evaluateCorrelations();
    optimizeResources();
  }, [isRunning, incidents]);
};
