import { IntelligenceMetrics } from '../../crowd-intelligence/types';
import { MobilityMetrics } from '../../mobility-intelligence/types';
import { ResourceUsage } from '../../simulation/types';
import { SustainabilityMetrics } from '../types';

export function calculateSustainabilityMetrics(
  resources: ResourceUsage | null,
  crowdMetrics: IntelligenceMetrics,
  mobilityMetrics: MobilityMetrics
): SustainabilityMetrics {
  // Base values from simulation, or fallbacks if null
  const energyConsumption = resources?.energyUsage || 0;
  const waterConsumption = resources?.waterConsumption || 0;
  const wasteGeneration = resources?.wasteLevel || 0;

  // Simulated derivations based on base values
  const plasticWaste = Math.min(100, (wasteGeneration / 100) * 40); // Assuming 40% of waste is plastic

  // Carbon impact calculation (mock formula based on energy and transport)
  const transportEmissions = (100 - mobilityMetrics.carbonImpactScore) * 100; // Inverse of score
  const energyEmissions = energyConsumption * 0.5; // 0.5 kg CO2 per kW
  const carbonImpact = transportEmissions + energyEmissions;

  // Efficiency metrics
  const maxEnergy = 50000; // Mock max energy capacity for score calculation
  const maxWater = 100000;
  const resourceEfficiency = Math.max(
    0,
    100 - ((energyConsumption / maxEnergy + waterConsumption / maxWater) / 2) * 100
  );

  const recyclingEfficiency = Math.max(0, 100 - wasteGeneration); // Simplified: lower waste level = higher recycling efficiency

  // Calculated Scores (0-100)
  const carbonFootprintScore = Math.max(0, 100 - carbonImpact / 1000); // Scales down as impact goes up
  const resourceEfficiencyScore = resourceEfficiency;
  const wasteDiversionScore = recyclingEfficiency;

  // Environmental Health Score (blend of crowd congestion and resources)
  const environmentalHealthScore = Math.round(
    (resourceEfficiencyScore + (100 - crowdMetrics.congestionScore)) / 2
  );

  // Green Mobility Score (passed from mobility)
  const greenMobilityScore = mobilityMetrics.carbonImpactScore;

  // Overall Sustainability Score
  const overallSustainabilityScore = Math.round(
    carbonFootprintScore * 0.3 +
      resourceEfficiencyScore * 0.2 +
      wasteDiversionScore * 0.2 +
      greenMobilityScore * 0.3
  );

  const confidenceScore = resources ? 95 : 50;

  return {
    energyConsumption,
    waterConsumption,
    wasteGeneration,
    plasticWaste,
    carbonImpact,
    transportEmissions,
    resourceEfficiency,
    recyclingEfficiency,
    carbonFootprintScore,
    resourceEfficiencyScore,
    wasteDiversionScore,
    environmentalHealthScore,
    greenMobilityScore,
    overallSustainabilityScore,
    confidenceScore,
  };
}
