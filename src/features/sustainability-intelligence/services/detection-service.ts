import { SustainabilityDetection, SustainabilityMetrics } from '../types';

export function generateSustainabilityDetections(
  metrics: SustainabilityMetrics
): SustainabilityDetection[] {
  const detections: SustainabilityDetection[] = [];
  const now = new Date().toISOString();

  // Energy Spikes
  if (metrics.energyConsumption > 45000) {
    detections.push({
      id: `det_sust_energy_${now}`,
      type: 'energy_spike',
      message: 'Critical energy spike detected in stadium operations.',
      severity: metrics.energyConsumption > 48000 ? 'critical' : 'high',
      timestamp: now,
    });
  }

  // Water Overuse
  if (metrics.waterConsumption > 80000) {
    detections.push({
      id: `det_sust_water_${now}`,
      type: 'water_overuse',
      message: 'Water consumption exceeding typical threshold limits.',
      severity: metrics.waterConsumption > 90000 ? 'critical' : 'moderate',
      timestamp: now,
    });
  }

  // Waste Overflow
  if (metrics.wasteGeneration > 85) {
    detections.push({
      id: `det_sust_waste_${now}`,
      type: 'waste_overflow',
      message: 'Waste generation at critical capacity. Overflow risk imminent.',
      severity: metrics.wasteGeneration > 95 ? 'critical' : 'high',
      timestamp: now,
    });
  }

  // High Carbon Events
  if (metrics.carbonImpact > 100000) {
    detections.push({
      id: `det_sust_carbon_${now}`,
      type: 'high_carbon_event',
      message: 'High carbon emissions detected due to transport and energy loads.',
      severity: 'high',
      timestamp: now,
    });
  }

  // Poor Recycling Rates
  if (metrics.recyclingEfficiency < 40) {
    detections.push({
      id: `det_sust_recycling_${now}`,
      type: 'poor_recycling_rate',
      message: 'Recycling efficiency has dropped below acceptable standards.',
      severity: 'moderate',
      timestamp: now,
    });
  }

  // Resource Bottlenecks
  if (metrics.resourceEfficiencyScore < 50) {
    detections.push({
      id: `det_sust_bottleneck_${now}`,
      type: 'resource_bottleneck',
      message: 'Overall resource efficiency bottleneck detected.',
      severity: 'high',
      timestamp: now,
    });
  }

  return detections;
}
