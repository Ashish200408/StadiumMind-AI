export type SustainabilityRisk = 'low' | 'moderate' | 'high' | 'critical';
export type RecommendationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SustainabilityMetrics {
  // Raw / Simulated Values
  energyConsumption: number; // kW
  waterConsumption: number; // Liters
  wasteGeneration: number; // kg
  plasticWaste: number; // percentage of total waste
  carbonImpact: number; // kg CO2
  transportEmissions: number; // kg CO2

  // Calculated Efficiency Scores (0-100)
  resourceEfficiency: number;
  recyclingEfficiency: number;

  // Final Output Scores (0-100)
  carbonFootprintScore: number;
  resourceEfficiencyScore: number;
  wasteDiversionScore: number;
  environmentalHealthScore: number;
  greenMobilityScore: number;
  overallSustainabilityScore: number;

  confidenceScore: number;
}

export type SustainabilityDetectionType =
  | 'energy_spike'
  | 'water_overuse'
  | 'waste_overflow'
  | 'high_carbon_event'
  | 'poor_recycling_rate'
  | 'resource_bottleneck';

export interface SustainabilityDetection {
  id: string;
  type: SustainabilityDetectionType;
  message: string;
  severity: SustainabilityRisk;
  timestamp: string;
}

export type SustainabilityRecommendationType =
  | 'reduce_lighting'
  | 'increase_recycling_bins'
  | 'redirect_buses'
  | 'promote_walking_routes'
  | 'reduce_water_usage'
  | 'optimize_waste_collection'
  | 'shift_energy_loads'
  | 'improve_recycling_coverage';

export interface SustainabilityRecommendation {
  id: string;
  type: SustainabilityRecommendationType;
  title: string;
  description: string;
  priority: RecommendationPriority;
  targetId?: string;
}

export interface SustainabilityState {
  metrics: SustainabilityMetrics;
  detections: SustainabilityDetection[];
  recommendations: SustainabilityRecommendation[];
  lastUpdated: string;
}
