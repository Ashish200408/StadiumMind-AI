import { IntelligenceMetrics } from '../../crowd-intelligence/types';
import { MobilityMetrics } from '../../mobility-intelligence/types';
import { AccessibilityMetrics } from '../types';
import { Incident } from '../../simulation/types';

export function calculateAccessibilityMetrics(
  crowdMetrics: IntelligenceMetrics,
  mobilityMetrics: MobilityMetrics,
  incidents: Record<string, Incident>
): AccessibilityMetrics {
  const incidentValues = Object.values(incidents);

  // Calculate facility availability (simulated based on facility incidents)
  const facilityIncidents = incidentValues.filter((inc) => inc.category === 'facility');
  const brokenLifts = facilityIncidents.filter(
    (inc) =>
      inc.description.toLowerCase().includes('lift') ||
      inc.description.toLowerCase().includes('elevator')
  ).length;

  const liftAvailability = Math.max(0, 100 - brokenLifts * 20); // each broken lift drops availability
  const rampAvailability = 100; // Assuming ramps don't break
  const accessibleEntranceAvailability = 100;

  // Accessible parking
  const accessibleParkingAvailability = Math.min(
    100,
    Math.max(0, mobilityMetrics.parkingScore + 10)
  ); // Slightly better reserved

  // Accessible washrooms
  const accessibleWashroomAvailability = Math.max(0, 100 - facilityIncidents.length * 5);

  // Accessible Routes
  const accessibleRouteAvailability = Math.min(liftAvailability, accessibleEntranceAvailability);

  // Crowd Impact: highly congested areas make accessibility very difficult
  const crowdAccessibilityImpact = Math.min(100, crowdMetrics.congestionScore * 1.2);

  // Travel Difficulty Score
  const travelDifficultyScore = Math.min(
    100,
    crowdAccessibilityImpact * 0.7 + (100 - liftAvailability) * 0.3
  );

  // Overall Accessibility Score
  const accessibilityScore = Math.round(
    accessibleRouteAvailability * 0.4 +
      (100 - travelDifficultyScore) * 0.4 +
      accessibleParkingAvailability * 0.2
  );

  // Comfort Score
  const comfortScore = Math.max(0, 100 - crowdAccessibilityImpact);

  // Confidence Score
  const confidenceScore = 90;

  return {
    accessibleRouteAvailability,
    liftAvailability,
    rampAvailability,
    accessibleEntranceAvailability,
    accessibleWashroomAvailability,
    accessibleParkingAvailability,
    crowdAccessibilityImpact,
    travelDifficultyScore,
    accessibilityScore,
    comfortScore,
    confidenceScore,
  };
}
