import { useMobilityEngine } from '../hooks/useMobilityEngine';
import { MobilitySummary } from './MobilitySummary';
import { MobilityAlerts } from './MobilityAlerts';
import { MobilityRecommendations } from './MobilityRecommendations';
import { useMobilityStore } from '../store/mobility-store';

export function MobilityDashboard() {
  useMobilityEngine();
  const lastUpdated = useMobilityStore((state) => state.lastUpdated);
  const metrics = useMobilityStore((state) => state.metrics);

  return (
    <div className="w-full h-full p-6 space-y-6 overflow-y-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Mobility Intelligence</h2>
          <p className="text-gray-400">
            Optimizing fan transit and parking based on real-time stadium metrics.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            Last synced: {new Date(lastUpdated).toLocaleTimeString()}
          </p>
          <div className="mt-2 text-xs font-medium text-gray-400 bg-black/30 px-3 py-1 rounded-full inline-block border border-white/5">
            ETA:{' '}
            {new Date(metrics.estimatedArrivalTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>

      <MobilitySummary />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MobilityAlerts />
        <MobilityRecommendations />
      </div>
    </div>
  );
}
