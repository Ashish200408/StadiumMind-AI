import { useEffect } from 'react';
import { runDetectionLoop } from '../services/detection-service';
import { evaluateEscalation } from '../services/escalation-engine';
import { evaluateCorrelations } from '../services/correlation-engine';
import { optimizeResources } from '../services/resource-optimizer';

export const useEmergencyEngine = () => {
  useEffect(() => {
    // Start the continuous monitoring loop
    const detectionInterval = setInterval(() => {
      runDetectionLoop();
    }, 5000); // Check conditions every 5s

    const escalationInterval = setInterval(() => {
      evaluateEscalation();
    }, 10000); // Check escalation every 10s

    const correlationInterval = setInterval(() => {
      evaluateCorrelations();
    }, 8000); // Check correlations every 8s

    const resourceInterval = setInterval(() => {
      optimizeResources();
    }, 6000); // Optimize resources every 6s

    return () => {
      clearInterval(detectionInterval);
      clearInterval(escalationInterval);
      clearInterval(correlationInterval);
      clearInterval(resourceInterval);
    };
  }, []);
};
