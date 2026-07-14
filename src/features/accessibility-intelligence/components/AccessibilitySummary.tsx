import { useAccessibilityStore } from '../store/accessibility-store';
import { Card } from '../../../components/ui/card';

export function AccessibilitySummary() {
  const metrics = useAccessibilityStore((state) => state.metrics);

  const getScoreColor = (score: number) => {
    if (score > 80) return 'text-green-400';
    if (score > 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      role="region"
      aria-label="Accessibility Metrics Summary"
    >
      <Card
        className="p-4 bg-white/5 backdrop-blur border-white/10 text-white"
        role="article"
        aria-label="Overall Accessibility Score"
      >
        <h3 className="text-sm font-medium text-gray-400">Accessibility Score</h3>
        <p className={`text-2xl font-bold mt-2 ${getScoreColor(metrics.accessibilityScore)}`}>
          {metrics.accessibilityScore.toFixed(0)}{' '}
          <span className="text-sm font-normal text-gray-400">/ 100</span>
        </p>
      </Card>

      <Card
        className="p-4 bg-white/5 backdrop-blur border-white/10 text-white"
        role="article"
        aria-label="Travel Difficulty Score"
      >
        <h3 className="text-sm font-medium text-gray-400">Travel Difficulty</h3>
        <p
          className={`text-2xl font-bold mt-2 ${getScoreColor(100 - metrics.travelDifficultyScore)}`}
        >
          {metrics.travelDifficultyScore.toFixed(0)}{' '}
          <span className="text-sm font-normal text-gray-400">/ 100</span>
        </p>
      </Card>

      <Card
        className="p-4 bg-white/5 backdrop-blur border-white/10 text-white"
        role="article"
        aria-label="Lift Availability"
      >
        <h3 className="text-sm font-medium text-gray-400">Lift Availability</h3>
        <div className="flex items-end mt-2 gap-2">
          <p className={`text-2xl font-bold ${getScoreColor(metrics.liftAvailability)}`}>
            {metrics.liftAvailability.toFixed(0)}%
          </p>
        </div>
      </Card>

      <Card
        className="p-4 bg-white/5 backdrop-blur border-white/10 text-white"
        role="article"
        aria-label="Accessible Route Availability"
      >
        <h3 className="text-sm font-medium text-gray-400">Route Availability</h3>
        <p
          className={`text-2xl font-bold mt-2 ${getScoreColor(metrics.accessibleRouteAvailability)}`}
        >
          {metrics.accessibleRouteAvailability.toFixed(0)}%
        </p>
      </Card>
    </div>
  );
}
