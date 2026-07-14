import { useIntelligenceStore } from '../store/intelligence-store';
import { Card } from '../../../components/ui/card';
import { RecommendationPriority } from '../types';

export function RecommendationPanel() {
  const recommendations = useIntelligenceStore((state) => state.recommendations);

  const getPriorityColor = (priority: RecommendationPriority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    }
  };

  return (
    <Card className="p-6 bg-white/5 backdrop-blur border-white/10 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">AI Recommendations</h3>
      {recommendations.length === 0 ? (
        <p className="text-gray-400 text-sm">No critical recommendations at this time.</p>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div key={rec.id} className={`p-3 rounded-lg border ${getPriorityColor(rec.priority)}`}>
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {rec.actionType.replace('_', ' ')}
                </span>
                <span className="text-xs font-medium uppercase px-2 py-0.5 rounded bg-black/20">
                  {rec.priority}
                </span>
              </div>
              <p className="text-sm font-medium">{rec.message}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
