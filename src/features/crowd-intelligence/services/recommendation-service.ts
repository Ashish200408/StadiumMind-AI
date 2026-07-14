import { DetectionEvent, IntelligenceMetrics, Recommendation } from '../types';

export function generateRecommendations(
  detections: DetectionEvent[],
  metrics: IntelligenceMetrics
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const now = new Date().toISOString();
  let recIdCounter = 1;

  // Process detections to generate deterministic recommendations
  detections.forEach((det) => {
    if (det.type === 'congested_gate') {
      recommendations.push({
        id: `rec_${recIdCounter++}_${now}`,
        actionType: 'redirect_fans',
        message: `Redirect fans away from ${det.targetId} to a less congested gate.`,
        priority: det.severity === 'critical' ? 'urgent' : 'high',
        targetId: det.targetId,
        timestamp: now,
      });
      recommendations.push({
        id: `rec_${recIdCounter++}_${now}`,
        actionType: 'increase_volunteers',
        message: `Deploy additional volunteers to ${det.targetId} to manage queues.`,
        priority: 'high',
        targetId: det.targetId,
        timestamp: now,
      });
    }

    if (det.type === 'empty_gate') {
      recommendations.push({
        id: `rec_${recIdCounter++}_${now}`,
        actionType: 'broadcast_advisory',
        message: `Broadcast advisory to guide fans to underutilized gate: ${det.targetId}.`,
        priority: 'medium',
        targetId: det.targetId,
        timestamp: now,
      });
    }

    if (det.type === 'overcrowded_zone') {
      recommendations.push({
        id: `rec_${recIdCounter++}_${now}`,
        actionType: 'adjust_routing',
        message: `Adjust internal routing to bypass ${det.targetId}.`,
        priority: det.severity === 'critical' ? 'urgent' : 'high',
        targetId: det.targetId,
        timestamp: now,
      });
    }

    if (det.type === 'queue_bottleneck') {
      recommendations.push({
        id: `rec_${recIdCounter++}_${now}`,
        actionType: 'open_gate',
        message: `Open closed gate ${det.targetId} to relieve bottleneck.`,
        priority: 'urgent',
        targetId: det.targetId,
        timestamp: now,
      });
    }
  });

  // Global recommendations based on overall metrics
  if (metrics.riskLevel === 'critical' || metrics.riskLevel === 'high') {
    recommendations.push({
      id: `rec_global_${now}`,
      actionType: 'broadcast_advisory',
      message: 'Stadium is experiencing high congestion. Issue stadium-wide crowd advisory.',
      priority: 'urgent',
      timestamp: now,
    });
  }

  // Deduplicate and limit recommendations to top 5
  // (In a real app we might group them, but here we just slice)
  return recommendations.slice(0, 5);
}
