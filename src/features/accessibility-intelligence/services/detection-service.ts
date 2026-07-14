import { AccessibilityDetection, AccessibilityMetrics } from '../types';
import { Incident } from '../../simulation/types';

export function generateAccessibilityDetections(
  metrics: AccessibilityMetrics,
  incidents: Record<string, Incident>
): AccessibilityDetection[] {
  const detections: AccessibilityDetection[] = [];
  const now = new Date().toISOString();

  // Unavailable Elevators
  if (metrics.liftAvailability < 100) {
    detections.push({
      id: `det_acc_lift_${now}`,
      type: 'unavailable_elevator',
      message: 'One or more accessibility lifts are out of service.',
      severity: metrics.liftAvailability < 50 ? 'critical' : 'high',
      timestamp: now,
    });
  }

  // High Crowd Barriers
  if (metrics.crowdAccessibilityImpact > 75) {
    detections.push({
      id: `det_acc_crowd_${now}`,
      type: 'high_crowd_barrier',
      message: 'High crowd density is severely restricting accessible movement.',
      severity: metrics.crowdAccessibilityImpact > 90 ? 'critical' : 'high',
      timestamp: now,
    });
  }

  // Limited Parking
  if (metrics.accessibleParkingAvailability < 20) {
    detections.push({
      id: `det_acc_parking_${now}`,
      type: 'limited_accessible_parking',
      message: 'Accessible parking is nearing full capacity.',
      severity: 'moderate',
      timestamp: now,
    });
  }

  // Emergency Risks
  const hasEmergency = Object.values(incidents).some(
    (inc) => inc.category === 'medical' || inc.category === 'security'
  );
  if (hasEmergency && metrics.accessibilityScore < 70) {
    detections.push({
      id: `det_acc_emerg_${now}`,
      type: 'emergency_accessibility_risk',
      message:
        'Emergency incident detected alongside low accessibility scores. Evacuation risks present.',
      severity: 'critical',
      timestamp: now,
    });
  }

  return detections;
}
