import { useSustainabilityStore } from '../store/sustainability-store';
import { Card } from '../../../components/ui/card';
import { RecommendationPriority } from '../types';

export function SustainabilityRecommendations() {
  const recommendations = useSustainabilityStore((state) => state.recommendations);

  const getPriorityColor = (priority: RecommendationPriority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-green-500/20 text-green-400 border-green-500/50';
    }
  };

  return (
    <Card
      className="p-6 bg-white/5 backdrop-blur border-white/10 h-full"
      role="region"
      aria-label="Sustainability Recommendations"
    >
      <h3 className="text-lg font-semibold text-white mb-4" id="sust-recommendations-heading">
        Sustainability Recommendations
      </h3>
      {recommendations.length === 0 ? (
        <p className="text-gray-400 text-sm">Environmental metrics are nominal.</p>
      ) : (
        <ul className="space-y-3" aria-labelledby="sust-recommendations-heading">
          {recommendations.map((rec) => (
            <li key={rec.id} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}>
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold text-sm">{rec.title}</span>
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/20"
                  aria-label={`Priority: ${rec.priority}`}
                >
                  {rec.priority}
                </span>
              </div>
              <p className="text-sm mt-1">{rec.description}</p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
