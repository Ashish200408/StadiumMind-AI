import { useEmergencyStore } from '../store/emergency-store';
import { logEvent } from './event-logger';
import { EscalationLevel } from '../types';

const ESCALATION_THRESHOLDS_MINUTES = {
  'Level 1': 5,
  'Level 2': 10,
  'Level 3': 15,
};

export const evaluateEscalation = () => {
  const store = useEmergencyStore.getState();
  const { incidents, updateIncident } = store;

  const now = new Date().getTime();

  incidents.forEach((incident) => {
    // Only escalate if not closed or resolved
    if (incident.lifecycleState === 'Closed' || incident.lifecycleState === 'Resolved') return;

    const timeSinceDetection = (now - new Date(incident.timestamp).getTime()) / (1000 * 60); // minutes

    let newEscalationLevel: EscalationLevel = incident.escalationLevel;

    if (
      incident.escalationLevel === 'Level 1' &&
      timeSinceDetection > ESCALATION_THRESHOLDS_MINUTES['Level 1']
    ) {
      newEscalationLevel = 'Level 2';
    } else if (
      incident.escalationLevel === 'Level 2' &&
      timeSinceDetection > ESCALATION_THRESHOLDS_MINUTES['Level 2']
    ) {
      newEscalationLevel = 'Level 3';
    } else if (
      incident.escalationLevel === 'Level 3' &&
      timeSinceDetection > ESCALATION_THRESHOLDS_MINUTES['Level 3']
    ) {
      newEscalationLevel = 'Level 4';
    }

    // Severity overrides: Critical incidents jump to Level 3 or 4 quickly
    if (incident.severity === 'Critical' && incident.escalationLevel === 'Level 1') {
      newEscalationLevel = 'Level 3';
    }

    if (newEscalationLevel !== incident.escalationLevel) {
      updateIncident(incident.id, {
        escalationLevel: newEscalationLevel,
        lastUpdated: new Date().toISOString(),
      });

      logEvent(
        incident.id,
        'EscalationEngine',
        'Escalate Incident',
        incident.severity,
        `${incident.escalationLevel} -> ${newEscalationLevel}`,
        `Incident escalated due to elapsed time or severity.`
      );
    }
  });
};
