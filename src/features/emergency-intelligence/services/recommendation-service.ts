import { EmergencyType, EmergencySeverity, ResponseAction, EscalationLevel } from '../types';

export const generateRecommendations = (
  type: EmergencyType,
  severity: EmergencySeverity,
  escalationLevel: EscalationLevel
): ResponseAction[] => {
  const actions: ResponseAction[] = [];

  switch (type) {
    case 'Medical':
      actions.push('Dispatch Medical Team');
      if (severity === 'High' || severity === 'Critical') {
        actions.push('Dispatch Security Team');
        actions.push('Broadcast Emergency Message');
      }
      break;
    case 'Security':
      actions.push('Dispatch Security Team');
      if (severity === 'Critical') {
        actions.push('Close Entrance');
        actions.push('Escalate Incident');
      }
      break;
    case 'Fire':
      actions.push('Broadcast Emergency Message');
      actions.push('Activate Evacuation Route');
      actions.push('Open Emergency Exit');
      actions.push('Escalate Incident');
      break;
    case 'Overcrowding':
      actions.push('Redirect Crowd');
      if (severity === 'High' || severity === 'Critical') {
        actions.push('Deploy Additional Volunteers');
        actions.push('Close Entrance');
      }
      break;
    case 'Evacuation':
      actions.push('Activate Evacuation Route');
      actions.push('Open Emergency Exit');
      actions.push('Broadcast Emergency Message');
      actions.push('Deploy Additional Volunteers');
      break;
    case 'Power':
    case 'Water':
    case 'Infrastructure':
      actions.push('Request Maintenance');
      if (
        severity === 'Critical' ||
        escalationLevel === 'Level 3' ||
        escalationLevel === 'Level 4'
      ) {
        actions.push('Escalate Incident');
        actions.push('Dispatch Security Team');
      }
      break;
    case 'Weather':
      actions.push('Broadcast Emergency Message');
      if (severity === 'Critical') {
        actions.push('Activate Evacuation Route');
      }
      break;
    case 'Transport':
      actions.push('Redirect Crowd');
      actions.push('Deploy Additional Volunteers');
      break;
  }

  return actions;
};
