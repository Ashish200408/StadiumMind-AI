import { useNavigationEngine } from '../hooks/useNavigationEngine';
import { NavigationSummary } from './NavigationSummary';
import { RouteCards } from './RouteCards';
import { ActiveRouteDetails } from './ActiveRouteDetails';
import { useNavigationStore } from '../store/navigation-store';

export function NavigationDashboard() {
  useNavigationEngine();
  const lastCalculated = useNavigationStore((state) => state.lastCalculated);

  return (
    <div className="w-full h-full p-6 space-y-6 overflow-y-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Navigation Intelligence</h2>
          <p className="text-gray-400">
            Real-time deterministic routing optimized for safety, accessibility, and speed.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Routes updated: {new Date(lastCalculated).toLocaleTimeString()}
        </div>
      </div>

      <NavigationSummary />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RouteCards />
        <ActiveRouteDetails />
      </div>
    </div>
  );
}
