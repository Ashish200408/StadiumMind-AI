import { useIntelligenceEngine } from '../hooks/useIntelligenceEngine';
import { MetricsCards } from './MetricsCards';
import { RecommendationPanel } from './RecommendationPanel';
import { DetectionsList } from './DetectionsList';
import { useIntelligenceStore } from '../store/intelligence-store';

export function CrowdIntelligenceDashboard() {
  // Initialize the intelligence engine (subscribes to simulation)
  useIntelligenceEngine();

  const lastAnalyzed = useIntelligenceStore((state) => state.lastAnalyzed);

  return (
    <div className="w-full h-full p-6 space-y-6 overflow-y-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Crowd Intelligence Engine</h2>
          <p className="text-gray-400">
            Real-time deterministic analysis of stadium conditions and crowd flow.
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date(lastAnalyzed).toLocaleTimeString()}
        </div>
      </div>

      <MetricsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DetectionsList />
        <RecommendationPanel />
      </div>
    </div>
  );
}
