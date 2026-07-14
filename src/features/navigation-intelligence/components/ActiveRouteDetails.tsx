import { useNavigationStore } from '../store/navigation-store';
import { Card } from '../../../components/ui/card';

export function ActiveRouteDetails() {
  const activeRoute = useNavigationStore((state) => state.activeRoute);

  return (
    <Card className="p-6 bg-white/5 backdrop-blur border-white/10 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Active Route Details</h3>
      {!activeRoute ? (
        <p className="text-gray-400 text-sm">Select a route recommendation to view its details.</p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="p-3 bg-black/20 rounded">
              <p className="text-gray-400 mb-1">Total Time</p>
              <p className="font-medium text-white">
                {Math.round(activeRoute.totalTime / 60)} mins
              </p>
            </div>
            <div className="p-3 bg-black/20 rounded">
              <p className="text-gray-400 mb-1">Avg Congestion</p>
              <p className="font-medium text-white">{activeRoute.averageCongestion.toFixed(0)}%</p>
            </div>
          </div>

          <h4 className="font-medium text-white text-sm mb-2">Turn-by-turn Navigation</h4>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 relative">
            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-blue-500/30"></div>
            {activeRoute.segments.map((segment, index) => (
              <div key={index} className="flex gap-4 relative z-10 items-start">
                <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-slate-900 flex-shrink-0 mt-0.5"></div>
                <div className="flex-1 pb-4">
                  <p className="text-sm font-medium text-blue-100">{segment.nodeName}</p>
                  {index < activeRoute.segments.length - 1 && (
                    <p className="text-xs text-gray-400 mt-1">
                      Proceed {Math.round(segment.timeToNext / 60)} min • Congestion:{' '}
                      {segment.congestionToNext}%
                    </p>
                  )}
                  {index === activeRoute.segments.length - 1 && (
                    <p className="text-xs text-green-400 mt-1">Arrive at destination</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
