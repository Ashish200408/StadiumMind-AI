import { CrowdDensity, GateStatus } from '../../simulation/types';
import { IntelligenceMetrics } from '../types';

export function analyzeCrowdData(
  crowd: Record<string, CrowdDensity>,
  gates: Record<string, GateStatus>,
  prevMetrics: IntelligenceMetrics
): IntelligenceMetrics {
  const crowdValues = Object.values(crowd);
  const gateValues = Object.values(gates);

  // 1. Calculate safe capacity percentage
  let totalCapacity = 0;
  let totalCurrentCount = 0;

  crowdValues.forEach((zone) => {
    totalCapacity += zone.capacity;
    totalCurrentCount += zone.currentCount;
  });

  const safeCapacityPercentage = totalCapacity > 0 ? (totalCurrentCount / totalCapacity) * 100 : 0;

  // 2. Calculate Congestion Score
  const avgDensity =
    crowdValues.length > 0
      ? crowdValues.reduce((sum, zone) => sum + zone.density, 0) / crowdValues.length
      : 0;
  const congestionScore = Math.min(100, avgDensity * 1.1); // Slightly weighted

  // 3. Calculate Queue Pressure
  const maxAcceptableQueue = 50; // threshold
  let totalQueueLength = 0;
  let maxQueue = 0;

  gateValues.forEach((gate) => {
    totalQueueLength += gate.queueLength;
    if (gate.queueLength > maxQueue) maxQueue = gate.queueLength;
  });

  const queuePressure = Math.min(100, (maxQueue / maxAcceptableQueue) * 100);

  // 4. Calculate Gate Utilization
  const openGates = gateValues.filter((g) => g.isOpen).length;
  const gateUtilization = gateValues.length > 0 ? (openGates / gateValues.length) * 100 : 0;

  // 5. Calculate Crowd Flow Trend
  let crowdFlowTrend: 'increasing' | 'stable' | 'decreasing' = 'stable';
  if (congestionScore > prevMetrics.congestionScore + 2) {
    crowdFlowTrend = 'increasing';
  } else if (congestionScore < prevMetrics.congestionScore - 2) {
    crowdFlowTrend = 'decreasing';
  } else {
    crowdFlowTrend = 'stable';
  }

  // 6. Calculate Waiting Time Estimate
  const avgWaitTime =
    gateValues.length > 0
      ? gateValues.reduce((sum, gate) => sum + gate.estimatedWaitTime, 0) / gateValues.length
      : 0;
  const waitingTimeEstimate = avgWaitTime;

  // 7. Calculate Risk Level
  let riskLevel: IntelligenceMetrics['riskLevel'] = 'low';
  if (congestionScore > 90 || queuePressure > 90) riskLevel = 'critical';
  else if (congestionScore > 75 || queuePressure > 75) riskLevel = 'high';
  else if (congestionScore > 50 || queuePressure > 50) riskLevel = 'moderate';

  // 8. Calculate Confidence Score
  // Base it on data freshness or amount of data
  const confidenceScore = crowdValues.length > 0 ? 95 : 0;

  return {
    congestionScore,
    queuePressure,
    gateUtilization,
    crowdFlowTrend,
    waitingTimeEstimate,
    safeCapacityPercentage,
    riskLevel,
    confidenceScore,
  };
}
