import { CrowdDensity, GateStatus } from '../../simulation/types';
import { DetectionEvent, IntelligenceMetrics } from '../types';

export function generateDetections(
  crowd: Record<string, CrowdDensity>,
  gates: Record<string, GateStatus>,
  metrics: IntelligenceMetrics
): DetectionEvent[] {
  const detections: DetectionEvent[] = [];
  const now = new Date().toISOString();

  // 1. Detect Congested Gates
  Object.values(gates).forEach((gate) => {
    if (gate.queueLength > 40 || gate.estimatedWaitTime > 15) {
      detections.push({
        id: `det_gate_${gate.id}_${now}`,
        type: 'congested_gate',
        targetId: gate.id,
        message: `Gate ${gate.location.name} is congested. Wait time: ${gate.estimatedWaitTime} min.`,
        severity: gate.estimatedWaitTime > 25 ? 'critical' : 'high',
        timestamp: now,
      });
    }

    if (!gate.isOpen && gate.queueLength > 0) {
      detections.push({
        id: `det_gate_closed_${gate.id}_${now}`,
        type: 'queue_bottleneck',
        targetId: gate.id,
        message: `Queue forming at closed gate ${gate.location.name}.`,
        severity: 'high',
        timestamp: now,
      });
    }

    if (gate.isOpen && gate.queueLength === 0 && metrics.congestionScore > 50) {
      detections.push({
        id: `det_empty_gate_${gate.id}_${now}`,
        type: 'empty_gate',
        targetId: gate.id,
        message: `Gate ${gate.location.name} is open but underutilized.`,
        severity: 'low',
        timestamp: now,
      });
    }
  });

  // 2. Detect Overcrowded Zones
  Object.values(crowd).forEach((zone) => {
    if (zone.density > 85) {
      detections.push({
        id: `det_zone_${zone.id}_${now}`,
        type: 'overcrowded_zone',
        targetId: zone.id,
        message: `Zone ${zone.location.name} is overcrowded (${zone.density.toFixed(1)}% density).`,
        severity: zone.density > 95 ? 'critical' : 'high',
        timestamp: now,
      });
    }
  });

  // 3. Detect General Crowd Surges
  if (metrics.crowdFlowTrend === 'increasing' && metrics.congestionScore > 70) {
    detections.push({
      id: `det_surge_${now}`,
      type: 'crowd_surge',
      targetId: 'stadium_wide',
      message: 'Sudden crowd surge detected stadium-wide.',
      severity: 'high',
      timestamp: now,
    });
  }

  return detections;
}
