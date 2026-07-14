import { useEmergencyStore } from '../store/emergency-store';
import { logEvent } from './event-logger';
import { ResponseTeamType } from '../types';

export const optimizeResources = () => {
  const store = useEmergencyStore.getState();
  const { teamStatuses, updateTeamStatus } = store;
  const priorityQueue = store.getPriorityQueue();

  if (priorityQueue.length === 0) return;

  // For each incident in priority queue, attempt to assign necessary teams if not already assigned
  priorityQueue.forEach((incident) => {
    if (incident.lifecycleState === 'Closed' || incident.lifecycleState === 'Resolved') return;

    incident.recommendedActions.forEach((action) => {
      let requiredTeamType: ResponseTeamType | null = null;

      if (action === 'Dispatch Medical Team') requiredTeamType = 'Medical';
      else if (action === 'Dispatch Security Team') requiredTeamType = 'Security';
      else if (action === 'Request Maintenance') requiredTeamType = 'Maintenance';
      else if (action === 'Deploy Additional Volunteers') requiredTeamType = 'Volunteer';

      if (requiredTeamType) {
        // Find an available team of this type
        const availableTeam = teamStatuses.find(
          (t) =>
            t.type === requiredTeamType && t.availability > 0 && t.currentAssignment !== incident.id
        );

        if (availableTeam) {
          // Assign to this incident
          updateTeamStatus(availableTeam.id, {
            availability: availableTeam.availability - 1,
            currentAssignment: incident.id,
            estimatedResponseTime: Math.floor(Math.random() * 5) + 1, // mock ETA
          });

          logEvent(
            incident.id,
            'ResourceOptimizer',
            'Assign Team',
            incident.severity,
            undefined,
            `Assigned ${requiredTeamType} team.`
          );
        }
      }
    });
  });
};
