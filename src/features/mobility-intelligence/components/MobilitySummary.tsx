import { useMobilityStore } from '../store/mobility-store';
import { Card } from '../../../components/ui/card';

export function MobilitySummary() {
  const metrics = useMobilityStore((state) => state.metrics);

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-green-400';
    if (score > 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 bg-white/5 backdrop-blur border-white/10 text-white">
        <h3 className="text-sm font-medium text-gray-400">Mobility Score</h3>
        <p className={`text-2xl font-bold mt-2 ${getScoreColor(metrics.mobilityScore)}`}>
          {metrics.mobilityScore.toFixed(0)}{' '}
          <span className="text-sm font-normal text-gray-400">/ 100</span>
        </p>
      </Card>

      <Card className="p-4 bg-white/5 backdrop-blur border-white/10 text-white">
        <h3 className="text-sm font-medium text-gray-400">Road Congestion</h3>
        <p
          className={`text-2xl font-bold mt-2 ${getScoreColor(100 - metrics.roadCongestionScore)}`}
        >
          {metrics.roadCongestionScore.toFixed(0)}%
        </p>
      </Card>

      <Card className="p-4 bg-white/5 backdrop-blur border-white/10 text-white">
        <h3 className="text-sm font-medium text-gray-400">Avg Travel Delay</h3>
        <div className="flex items-end mt-2 gap-2">
          <p className="text-2xl font-bold text-orange-400">{metrics.travelDelay.toFixed(1)}</p>
          <span className="text-sm text-gray-400 mb-1">min</span>
        </div>
      </Card>

      <Card className="p-4 bg-white/5 backdrop-blur border-white/10 text-white">
        <h3 className="text-sm font-medium text-gray-400">Carbon Impact Score</h3>
        <p className={`text-2xl font-bold mt-2 ${getScoreColor(metrics.carbonImpactScore)}`}>
          {metrics.carbonImpactScore.toFixed(0)}{' '}
          <span className="text-sm font-normal text-gray-400">/ 100</span>
        </p>
      </Card>
    </div>
  );
}
