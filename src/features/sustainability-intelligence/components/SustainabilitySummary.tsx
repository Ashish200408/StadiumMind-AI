import { useSustainabilityStore } from '../store/sustainability-store';
import { Card } from '../../../components/ui/card';

export function SustainabilitySummary() {
  const metrics = useSustainabilityStore((state) => state.metrics);

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-green-400';
    if (score > 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      role="region"
      aria-label="Sustainability Metrics Summary"
    >
      <Card
        className="p-4 bg-white/5 backdrop-blur border-white/10 text-white"
        role="article"
        aria-label="Overall Sustainability Score"
      >
        <h3 className="text-sm font-medium text-gray-400">Sustainability Score</h3>
        <p
          className={`text-2xl font-bold mt-2 ${getScoreColor(metrics.overallSustainabilityScore)}`}
        >
          {metrics.overallSustainabilityScore.toFixed(0)}{' '}
          <span className="text-sm font-normal text-gray-400">/ 100</span>
        </p>
      </Card>

      <Card
        className="p-4 bg-white/5 backdrop-blur border-white/10 text-white"
        role="article"
        aria-label="Carbon Footprint Score"
      >
        <h3 className="text-sm font-medium text-gray-400">Carbon Footprint</h3>
        <p className={`text-2xl font-bold mt-2 ${getScoreColor(metrics.carbonFootprintScore)}`}>
          {metrics.carbonFootprintScore.toFixed(0)}{' '}
          <span className="text-sm font-normal text-gray-400">/ 100</span>
        </p>
      </Card>

      <Card
        className="p-4 bg-white/5 backdrop-blur border-white/10 text-white"
        role="article"
        aria-label="Resource Efficiency"
      >
        <h3 className="text-sm font-medium text-gray-400">Resource Efficiency</h3>
        <p className={`text-2xl font-bold mt-2 ${getScoreColor(metrics.resourceEfficiencyScore)}`}>
          {metrics.resourceEfficiencyScore.toFixed(0)}%
        </p>
      </Card>

      <Card
        className="p-4 bg-white/5 backdrop-blur border-white/10 text-white"
        role="article"
        aria-label="Waste Diversion Score"
      >
        <h3 className="text-sm font-medium text-gray-400">Waste Diversion</h3>
        <p className={`text-2xl font-bold mt-2 ${getScoreColor(metrics.wasteDiversionScore)}`}>
          {metrics.wasteDiversionScore.toFixed(0)}%
        </p>
      </Card>
    </div>
  );
}
