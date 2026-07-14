import { useNavigationStore } from '../store/navigation-store';
import { Card } from '../../../components/ui/card';

export function RouteCards() {
  const recommendations = useNavigationStore((state) => state.recommendations);
  const setActiveRoute = useNavigationStore((state) => state.setActiveRoute);

  return (
    <Card className="p-6 bg-white/5 backdrop-blur border-white/10 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Route Recommendations</h3>
      {recommendations.length === 0 ? (
        <p className="text-gray-400 text-sm">No optimal routes currently required.</p>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className={`p-4 rounded-lg border cursor-pointer hover:bg-white/10 transition-colors ${
                rec.type === 'emergency_exit'
                  ? 'border-red-500/50 bg-red-500/10 text-red-400'
                  : 'border-blue-500/30 bg-blue-500/5 text-blue-200'
              }`}
              onClick={() => rec.route && setActiveRoute(rec.route)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold">{rec.title}</span>
                <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-black/30">
                  {rec.type.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-sm opacity-90 mb-2">{rec.description}</p>
              {rec.route && (
                <div className="flex gap-4 text-xs font-medium opacity-70">
                  <span>⏱️ {Math.round(rec.route.totalTime / 60)} min</span>
                  <span>🚶 {rec.route.segments.length} steps</span>
                  <span>🛡️ Safety: {rec.route.safetyScore}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
