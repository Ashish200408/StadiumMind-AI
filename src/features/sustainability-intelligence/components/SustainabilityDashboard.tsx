import { SustainabilitySummary } from './SustainabilitySummary';
import { EnvironmentalAlerts } from './EnvironmentalAlerts';
import { SustainabilityRecommendations } from './SustainabilityRecommendations';
import { useSustainabilityStore } from '../store/sustainability-store';

export function SustainabilityDashboard() {
  const lastUpdated = useSustainabilityStore((state) => state.lastUpdated);

  return (
    <div
      className="w-full h-full p-6 space-y-6 overflow-y-auto"
      role="main"
      aria-label="Sustainability Intelligence Dashboard"
    >
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2" tabIndex={0}>
            Sustainability Intelligence
          </h2>
          <p className="text-gray-400">
            Continuous evaluation of environmental impact and resource efficiency.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500" aria-live="polite">
            Last synced: {new Date(lastUpdated).toLocaleTimeString()}
          </p>
        </div>
      </div>

      <SustainabilitySummary />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnvironmentalAlerts />
        <SustainabilityRecommendations />
      </div>
    </div>
  );
}
