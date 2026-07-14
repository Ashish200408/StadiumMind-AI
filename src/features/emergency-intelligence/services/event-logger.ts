import { EmergencySeverity, StructuredEventLog } from '../types';
import { useEmergencyStore } from '../store/emergency-store';

export const logEvent = (
  incidentId: string,
  module: string,
  action: string,
  severity: EmergencySeverity,
  stateTransition?: string,
  details?: string
) => {
  const log: StructuredEventLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    incidentId,
    module,
    action,
    severity,
    stateTransition,
    details,
  };

  useEmergencyStore.getState().addEventLog(log);
};
