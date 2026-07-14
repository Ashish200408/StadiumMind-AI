import { TransportStatus } from '../../simulation/types';
import { IntelligenceMetrics } from '../../crowd-intelligence/types';
import { MobilityMetrics } from '../types';

export function calculateMobilityMetrics(
  transports: Record<string, TransportStatus>,
  crowdMetrics: IntelligenceMetrics
): MobilityMetrics {
  const transportValues = Object.values(transports);

  // Calculate Parking Score
  const parkingFacilities = transportValues.filter((t) => t.mode === 'parking');
  const avgParkingOccupancy =
    parkingFacilities.length > 0
      ? parkingFacilities.reduce((sum, p) => sum + p.occupancy, 0) / parkingFacilities.length
      : 0;
  const parkingScore = Math.max(0, 100 - avgParkingOccupancy);

  // Calculate Transit Score (Bus & Metro)
  const transitFacilities = transportValues.filter((t) => t.mode !== 'parking');
  const avgTransitOccupancy =
    transitFacilities.length > 0
      ? transitFacilities.reduce((sum, t) => sum + t.occupancy, 0) / transitFacilities.length
      : 0;
  const transitScore = Math.max(0, 100 - avgTransitOccupancy);

  // Road Congestion Score
  const roadCongestionScore = Math.min(
    100,
    avgParkingOccupancy * 0.7 + crowdMetrics.congestionScore * 0.3
  );

  // Mobility Score (Blended)
  const mobilityScore = Math.round((parkingScore + transitScore + (100 - roadCongestionScore)) / 3);

  // Transport Reliability (Example algorithm)
  const transportReliability = Math.max(0, 100 - roadCongestionScore * 0.5);

  // Travel Delay (minutes)
  const travelDelay = Math.max(0, roadCongestionScore / 10 + crowdMetrics.queuePressure / 10);

  // Carbon Impact Score (Higher transit usage = better score, offset by congestion)
  const carbonImpactScore = Math.min(
    100,
    Math.max(0, avgTransitOccupancy * 0.8 + (100 - roadCongestionScore) * 0.2)
  );

  // Confidence Score
  const confidenceScore = transportValues.length > 0 ? 95 : 50;

  // Arrival/Departure estimations
  const now = Date.now();
  const estimatedArrivalTime = new Date(now + travelDelay * 60000).toISOString();
  // Assume a typical match lasts 2 hours (120 mins) from now for departure
  const estimatedDepartureTime = new Date(now + 120 * 60000 + travelDelay * 60000).toISOString();

  return {
    parkingScore,
    transitScore,
    mobilityScore,
    travelDelay,
    estimatedArrivalTime,
    estimatedDepartureTime,
    roadCongestionScore,
    transportReliability,
    carbonImpactScore,
    confidenceScore,
  };
}
