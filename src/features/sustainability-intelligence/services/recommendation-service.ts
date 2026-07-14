import {
  SustainabilityDetection,
  SustainabilityMetrics,
  SustainabilityRecommendation,
} from '../types';

export function generateSustainabilityRecommendations(
  detections: SustainabilityDetection[],
  metrics: SustainabilityMetrics
): SustainabilityRecommendation[] {
  const recommendations: SustainabilityRecommendation[] = [];
  const now = Date.now();
  let recCounter = 1;

  detections.forEach((det) => {
    if (det.type === 'energy_spike') {
      recommendations.push({
        id: `rec_sust_${recCounter++}_${now}`,
        type: 'shift_energy_loads',
        title: 'Shift Energy Loads',
        description:
          'Shift non-critical energy loads to battery storage or reduce lighting in unoccupied zones.',
        priority: det.severity === 'critical' ? 'urgent' : 'high',
      });
      recommendations.push({
        id: `rec_sust_${recCounter++}_${now}`,
        type: 'reduce_lighting',
        title: 'Reduce Lighting',
        description: 'Dim concourse lighting by 20% to conserve power.',
        priority: 'medium',
      });
    }

    if (det.type === 'water_overuse') {
      recommendations.push({
        id: `rec_sust_${recCounter++}_${now}`,
        type: 'reduce_water_usage',
        title: 'Reduce Water Usage',
        description: 'Lower flow rate for washroom taps and disable non-essential irrigation.',
        priority: 'high',
      });
    }

    if (det.type === 'waste_overflow' || det.type === 'poor_recycling_rate') {
      recommendations.push({
        id: `rec_sust_${recCounter++}_${now}`,
        type: 'optimize_waste_collection',
        title: 'Optimize Waste Collection',
        description: 'Deploy waste management teams to high-traffic zones immediately.',
        priority: det.type === 'waste_overflow' ? 'urgent' : 'medium',
      });
      recommendations.push({
        id: `rec_sust_${recCounter++}_${now}`,
        type: 'improve_recycling_coverage',
        title: 'Improve Recycling Coverage',
        description: 'Increase recycling bins in food courts to improve waste diversion.',
        priority: 'high',
      });
    }

    if (det.type === 'high_carbon_event') {
      recommendations.push({
        id: `rec_sust_${recCounter++}_${now}`,
        type: 'redirect_buses',
        title: 'Redirect Buses',
        description:
          'Redirect idling buses away from pedestrian zones to reduce concentrated emissions.',
        priority: 'medium',
      });
      recommendations.push({
        id: `rec_sust_${recCounter++}_${now}`,
        type: 'promote_walking_routes',
        title: 'Promote Walking Routes',
        description:
          'Incentivize walking or cycling for departing crowds to lower transport emissions.',
        priority: 'low',
      });
    }
  });

  // Base Recommendations
  if (metrics.overallSustainabilityScore > 85 && recommendations.length === 0) {
    recommendations.push({
      id: `rec_sust_${recCounter++}_${now}`,
      type: 'improve_recycling_coverage',
      title: 'Maintain Eco-Standards',
      description: 'Operations are running sustainably. Continue monitoring resource usage.',
      priority: 'low',
    });
  }

  return recommendations.slice(0, 6);
}
