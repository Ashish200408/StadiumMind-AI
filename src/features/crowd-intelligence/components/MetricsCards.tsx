import { useIntelligenceStore } from '../store/intelligence-store';
import { Card } from '../../../components/ui/card';

export function MetricsCards() {
  const metrics = useIntelligenceStore((state) => state.metrics);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'moderate':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return '↗️';
      case 'decreasing':
        return '↘️';
      default:
        return '➡️';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 bg-white/5 backdrop-blur border-white/10 text-white">
        <h3 className="text-sm font-medium text-gray-400">Risk Indicator</h3>
        <p className={`text-2xl font-bold uppercase mt-2 ${getRiskColor(metrics.riskLevel)}`}>
          {metrics.riskLevel}
        </p>
      </Card>

      <Card className="p-4 bg-white/5 backdrop-blur border-white/10 text-white">
        <h3 className="text-sm font-medium text-gray-400">Congestion Score</h3>
        <div className="flex items-end mt-2 gap-2">
          <p className="text-2xl font-bold">{metrics.congestionScore.toFixed(0)}</p>
          <span className="text-sm text-gray-400 mb-1">/ 100</span>
          <span className="ml-auto text-xl" title="Trend">
            {getTrendIcon(metrics.crowdFlowTrend)}
          </span>
        </div>
      </Card>

      <Card className="p-4 bg-white/5 backdrop-blur border-white/10 text-white">
        <h3 className="text-sm font-medium text-gray-400">Avg Wait Time</h3>
        <div className="flex items-end mt-2 gap-2">
          <p className="text-2xl font-bold">{metrics.waitingTimeEstimate.toFixed(1)}</p>
          <span className="text-sm text-gray-400 mb-1">min</span>
        </div>
      </Card>

      <Card className="p-4 bg-white/5 backdrop-blur border-white/10 text-white">
        <h3 className="text-sm font-medium text-gray-400">Gate Utilization</h3>
        <div className="flex items-end mt-2 gap-2">
          <p className="text-2xl font-bold">{metrics.gateUtilization.toFixed(0)}</p>
          <span className="text-sm text-gray-400 mb-1">%</span>
        </div>
      </Card>
    </div>
  );
}
