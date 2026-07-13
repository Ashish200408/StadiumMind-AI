import { SimulationState } from '../../simulation/types';

export interface HealthScoreResult {
  score: number;
  status: 'Critical' | 'Warning' | 'Stable' | 'Optimal';
  trend: 'up' | 'down' | 'neutral';
  factors: {
    crowd: number;
    transport: number;
    environment: number;
    resources: number;
    incidents: number;
  };
}

// Previous score for trend calculation (in-memory for this simple util)
let previousScore = 100;

export function calculateHealthScore(state: SimulationState): HealthScoreResult {
  let crowdPenalty = 0;
  let transportPenalty = 0;
  let environmentPenalty = 0;
  let resourcesPenalty = 0;
  let incidentPenalty = 0;

  // Crowd Penalty
  Object.values(state.crowd).forEach((zone) => {
    if (zone.density > 90) crowdPenalty += 5;
    else if (zone.density > 75) crowdPenalty += 2;
  });

  // Transport Penalty
  Object.values(state.transport).forEach((t) => {
    if (t.occupancy > 95) transportPenalty += 5;
    else if (t.occupancy > 85) transportPenalty += 2;
  });

  // Gate Penalty (grouped with transport/flow)
  Object.values(state.gates).forEach((g) => {
    if (g.estimatedWaitTime > 20) transportPenalty += 3;
    else if (g.estimatedWaitTime > 10) transportPenalty += 1;
  });

  // Environment Penalty
  if (state.environment) {
    if (state.environment.temperature > 35) environmentPenalty += 10;
    else if (state.environment.temperature > 30) environmentPenalty += 5;

    if (state.environment.weather === 'storm') environmentPenalty += 15;
    else if (state.environment.weather === 'rain') environmentPenalty += 5;
  }

  // Resources Penalty
  if (state.resources) {
    if (state.resources.energyUsage > 9000) resourcesPenalty += 5;
    if (state.resources.wasteLevel > 85) resourcesPenalty += 5;
  }

  // Incident Penalty
  const activeIncidents = Object.values(state.incidents).filter((i) => i.status !== 'resolved');
  activeIncidents.forEach((inc) => {
    if (inc.severity === 'critical') incidentPenalty += 15;
    else if (inc.severity === 'high') incidentPenalty += 10;
    else if (inc.severity === 'medium') incidentPenalty += 5;
    else incidentPenalty += 2;
  });

  // Volunteer availability offsets penalties slightly
  let volunteerBonus = 0;
  if (state.volunteers) {
    if (state.volunteers.freeCount > 50) volunteerBonus = 5;
    else if (state.volunteers.freeCount < 10) incidentPenalty += 5; // lack of volunteers increases risk
  }

  // Calculate final score
  const totalPenalty =
    crowdPenalty +
    transportPenalty +
    environmentPenalty +
    resourcesPenalty +
    incidentPenalty -
    volunteerBonus;
  const score = Math.max(0, Math.min(100, 100 - totalPenalty));

  let status: HealthScoreResult['status'] = 'Optimal';
  if (score < 50) status = 'Critical';
  else if (score < 75) status = 'Warning';
  else if (score < 90) status = 'Stable';

  let trend: HealthScoreResult['trend'] = 'neutral';
  if (score > previousScore) trend = 'up';
  else if (score < previousScore) trend = 'down';

  previousScore = score;

  return {
    score,
    status,
    trend,
    factors: {
      crowd: Math.max(0, 100 - crowdPenalty),
      transport: Math.max(0, 100 - transportPenalty),
      environment: Math.max(0, 100 - environmentPenalty),
      resources: Math.max(0, 100 - resourcesPenalty),
      incidents: Math.max(0, 100 - incidentPenalty),
    },
  };
}
