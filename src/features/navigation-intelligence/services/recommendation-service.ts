import { GraphEdge, GraphNode, NavigationRecommendation } from '../types';
import { calculateRoute } from './routing-service';

export function generateNavigationRecommendations(
  nodes: Record<string, GraphNode>,
  edges: GraphEdge[],
  congestionScore: number,
  isEmergency: boolean
): NavigationRecommendation[] {
  const recommendations: NavigationRecommendation[] = [];
  const now = Date.now();

  const context = {
    congestionScore,
    accessibilityRequired: false,
  };

  // We assume the user is at 'zone_a' for this simulation
  const currentLocation = 'zone_a';

  if (isEmergency) {
    const route = calculateRoute(
      currentLocation,
      'emergency_exit_1',
      nodes,
      edges,
      'emergency',
      context
    );
    if (route) {
      recommendations.push({
        id: `rec_emerg_${now}`,
        type: 'emergency_exit',
        title: 'Emergency Evacuation Route',
        description: 'Safest and fastest route to the nearest emergency exit.',
        route,
      });
    }
  }

  // Best Entrance (Assuming coming from Transport)
  const entranceRoute = calculateRoute(
    'transport_metro',
    'entrance_main',
    nodes,
    edges,
    'least_congested',
    context
  );
  if (entranceRoute) {
    recommendations.push({
      id: `rec_ent_${now}`,
      type: 'best_entrance',
      title: 'Optimal Entrance Route',
      description: 'Least congested path from metro to main entrance.',
      route: entranceRoute,
    });
  }

  // Nearest Washroom
  const washroomRoute = calculateRoute(
    currentLocation,
    'washroom_1',
    nodes,
    edges,
    'shortest',
    context
  );
  if (washroomRoute) {
    recommendations.push({
      id: `rec_wash_${now}`,
      type: 'nearest_accessible_washroom',
      title: 'Nearest Washroom',
      description: 'Quickest path to the closest facility.',
      route: washroomRoute,
    });
  }

  // Nearest Medical
  const medicalRoute = calculateRoute(
    currentLocation,
    'medical_1',
    nodes,
    edges,
    'shortest',
    context
  );
  if (medicalRoute) {
    recommendations.push({
      id: `rec_med_${now}`,
      type: 'nearest_medical',
      title: 'Nearest Medical Center',
      description: 'Direct route to medical assistance.',
      route: medicalRoute,
    });
  }

  // Best Food
  const foodRoute = calculateRoute(
    currentLocation,
    'food_court_1',
    nodes,
    edges,
    'least_congested',
    context
  );
  if (foodRoute) {
    recommendations.push({
      id: `rec_food_${now}`,
      type: 'best_food',
      title: 'Recommended Food Court',
      description: 'Path to the least congested food court.',
      route: foodRoute,
    });
  }

  return recommendations;
}
