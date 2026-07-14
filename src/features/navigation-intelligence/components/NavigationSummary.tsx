import { useNavigationStore } from '../store/navigation-store';
import { Card } from '../../../components/ui/card';

export function NavigationSummary() {
  const recommendations = useNavigationStore((state) => state.recommendations);
  const activeRoute = useNavigationStore((state) => state.activeRoute);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 bg-white/5 backdrop-blur border-white/10 text-white">
        <h3 className="text-sm font-medium text-gray-400">Total Recommendations</h3>
        <p className="text-2xl font-bold mt-2">{recommendations.length}</p>
      </Card>

      <Card className="p-4 bg-white/5 backdrop-blur border-white/10 text-white">
        <h3 className="text-sm font-medium text-gray-400">Active Route Type</h3>
        <p className="text-xl font-bold uppercase mt-2">
          {activeRoute ? activeRoute.type.replace('_', ' ') : 'None'}
        </p>
      </Card>

      <Card className="p-4 bg-white/5 backdrop-blur border-white/10 text-white">
        <h3 className="text-sm font-medium text-gray-400">Avg Route Time</h3>
        <div className="flex items-end mt-2 gap-2">
          <p className="text-2xl font-bold">
            {activeRoute ? Math.round(activeRoute.totalTime / 60) : 0}
          </p>
          <span className="text-sm text-gray-400 mb-1">min</span>
        </div>
      </Card>

      <Card className="p-4 bg-white/5 backdrop-blur border-white/10 text-white">
        <h3 className="text-sm font-medium text-gray-400">Accessibility Score</h3>
        <div className="flex items-end mt-2 gap-2">
          <p className="text-2xl font-bold">{activeRoute ? activeRoute.accessibilityScore : 100}</p>
          <span className="text-sm text-gray-400 mb-1">/ 100</span>
        </div>
      </Card>
    </div>
  );
}
