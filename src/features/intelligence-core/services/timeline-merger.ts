import { GlobalEvent } from '../types';
import { useEmergencyStore } from '../../emergency-intelligence/store/emergency-store';
// Typically we would import from other stores as well if they had event logs

export const mergeTimelines = (): GlobalEvent[] => {
  const allEvents: GlobalEvent[] = [];

  try {
    const emergencyState = useEmergencyStore.getState();
    const emergencyEvents = emergencyState.eventLogs.map(
      (log) =>
        ({
          id: log.id,
          timestamp: log.timestamp,
          moduleSource: 'Emergency Intelligence',
          eventType: log.action,
          description: log.details || log.stateTransition || 'Emergency event occurred',
          severity:
            log.severity === 'Critical'
              ? 'Critical'
              : log.severity === 'High'
                ? 'Error'
                : log.severity === 'Medium'
                  ? 'Warning'
                  : 'Info',
          metadata: { incidentId: log.incidentId },
        }) as GlobalEvent
    );

    allEvents.push(...emergencyEvents);
  } catch {
    // Ignore if emergency store not ready
  }

  // Sort chronologically (newest first)
  allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return allEvents;
};
