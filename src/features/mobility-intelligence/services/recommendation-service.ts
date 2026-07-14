import { MobilityDetection, MobilityMetrics, MobilityRecommendation } from '../types';

export function generateMobilityRecommendations(
  detections: MobilityDetection[],
  metrics: MobilityMetrics
): MobilityRecommendation[] {
  const recommendations: MobilityRecommendation[] = [];
  const now = Date.now();
  let recCounter = 1;

  // Process Detections
  detections.forEach((det) => {
    if (det.type === 'parking_full') {
      recommendations.push({
        id: `rec_mob_${recCounter++}_${now}`,
        type: 'alternative_transport',
        title: 'Parking Saturated',
        description:
          'Recommend redirecting incoming traffic to public transit or overflow parking.',
        priority: det.severity === 'critical' ? 'urgent' : 'high',
      });
    }

    if (det.type === 'road_congestion') {
      recommendations.push({
        id: `rec_mob_${recCounter++}_${now}`,
        type: 'recommended_departure',
        title: 'Road Congestion',
        description: 'Advise fans to delay departure by 30 minutes to ease road load.',
        priority: 'high',
      });
    }

    if (det.type === 'metro_delays' || det.type === 'bus_overload') {
      recommendations.push({
        id: `rec_mob_${recCounter++}_${now}`,
        type: 'best_walking',
        title: 'Transit Overload',
        description: 'Promote active travel (walking/cycling) routes to nearby transit hubs.',
        priority: 'medium',
      });
    }
  });

  // Base Recommendations depending on overall scores
  if (metrics.carbonImpactScore < 50) {
    recommendations.push({
      id: `rec_mob_eco_${now}`,
      type: 'carbon_friendly',
      title: 'Promote Green Transport',
      description:
        'Offer incentives for fans using public transit or carpooling to improve carbon score.',
      priority: 'medium',
    });
  }

  if (metrics.mobilityScore > 80 && recommendations.length === 0) {
    recommendations.push({
      id: `rec_mob_opt_${now}`,
      type: 'best_metro',
      title: 'Optimal Transit',
      description: 'Metro network is operating efficiently. Direct fans to metro stations.',
      priority: 'low',
    });
  }

  return recommendations.slice(0, 5); // Limit to top 5
}
