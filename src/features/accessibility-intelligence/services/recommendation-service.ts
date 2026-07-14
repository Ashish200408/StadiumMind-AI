import {
  AccessibilityDetection,
  AccessibilityMetrics,
  AccessibilityRecommendation,
} from '../types';

export function generateAccessibilityRecommendations(
  detections: AccessibilityDetection[],
  metrics: AccessibilityMetrics
): AccessibilityRecommendation[] {
  const recommendations: AccessibilityRecommendation[] = [];
  const now = Date.now();
  let recCounter = 1;

  detections.forEach((det) => {
    if (det.type === 'unavailable_elevator') {
      recommendations.push({
        id: `rec_acc_${recCounter++}_${now}`,
        type: 'alternative_accessible_route',
        title: 'Alternative Route Required',
        description: 'Primary elevator is down. Reroute via South Concourse ramps.',
        priority: det.severity === 'critical' ? 'urgent' : 'high',
      });
    }

    if (det.type === 'high_crowd_barrier') {
      recommendations.push({
        id: `rec_acc_${recCounter++}_${now}`,
        type: 'safe_waiting_zone',
        title: 'Safe Waiting Zone',
        description:
          'Direct vulnerable visitors to designated low-congestion safe zones until crowds disperse.',
        priority: 'high',
      });
    }

    if (det.type === 'limited_accessible_parking') {
      recommendations.push({
        id: `rec_acc_${recCounter++}_${now}`,
        type: 'best_accessible_parking',
        title: 'Overflow Accessible Parking',
        description: 'Open overflow accessible parking in VIP Lot B.',
        priority: 'medium',
      });
    }
  });

  // Base Recommendations
  if (metrics.accessibilityScore > 80 && recommendations.length === 0) {
    recommendations.push({
      id: `rec_acc_${recCounter++}_${now}`,
      type: 'best_accessible_entrance',
      title: 'Optimal Entrance',
      description: 'North Entrance is currently providing the best accessible experience.',
      priority: 'low',
    });
  }

  // Ensure there's always at least one helpful recommendation
  if (recommendations.length === 0) {
    recommendations.push({
      id: `rec_acc_default_${now}`,
      type: 'best_accessible_route',
      title: 'Standard Accessible Routes Active',
      description: 'All primary accessible routes and facilities are operating normally.',
      priority: 'low',
    });
  }

  return recommendations.slice(0, 5);
}
