import { TransportStatus } from '../../simulation/types';
import { IntelligenceMetrics } from '../../crowd-intelligence/types';
import { MobilityDetection, MobilityMetrics } from '../types';

export function generateMobilityDetections(
  transports: Record<string, TransportStatus>,
  crowdMetrics: IntelligenceMetrics,
  mobilityMetrics: MobilityMetrics
): MobilityDetection[] {
  const detections: MobilityDetection[] = [];
  const now = new Date().toISOString();

  // Check Parking
  Object.values(transports)
    .filter((t) => t.mode === 'parking')
    .forEach((parking) => {
      if (parking.occupancy > 90) {
        detections.push({
          id: `det_parking_full_${parking.id}_${now}`,
          type: 'parking_full',
          message: `Parking facility at near capacity (${parking.occupancy}%).`,
          severity: parking.occupancy > 98 ? 'critical' : 'high',
          timestamp: now,
        });
      }
    });

  // Check Metro Delays
  Object.values(transports)
    .filter((t) => t.mode === 'metro')
    .forEach((metro) => {
      if (metro.occupancy > 85) {
        detections.push({
          id: `det_metro_delay_${metro.id}_${now}`,
          type: 'metro_delays',
          message: 'Metro lines experiencing high passenger volume, expect delays.',
          severity: metro.occupancy > 95 ? 'critical' : 'moderate',
          timestamp: now,
        });
      }
    });

  // Check Bus Overload
  Object.values(transports)
    .filter((t) => t.mode === 'bus')
    .forEach((bus) => {
      if (bus.occupancy > 90) {
        detections.push({
          id: `det_bus_overload_${bus.id}_${now}`,
          type: 'bus_overload',
          message: 'Bus network is overloaded.',
          severity: 'high',
          timestamp: now,
        });
      }
    });

  // Check Road Congestion
  if (mobilityMetrics.roadCongestionScore > 75) {
    detections.push({
      id: `det_road_congestion_${now}`,
      type: 'road_congestion',
      message: 'Severe road congestion detected on primary access routes.',
      severity: mobilityMetrics.roadCongestionScore > 90 ? 'critical' : 'high',
      timestamp: now,
    });
  }

  // Check Walking Congestion (using Crowd metrics)
  if (crowdMetrics.congestionScore > 80) {
    detections.push({
      id: `det_walking_congestion_${now}`,
      type: 'walking_congestion',
      message: 'High pedestrian traffic on stadium approach paths.',
      severity: 'moderate',
      timestamp: now,
    });
  }

  return detections;
}
