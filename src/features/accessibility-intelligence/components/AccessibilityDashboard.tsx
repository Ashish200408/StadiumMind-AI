import { useAccessibilityEngine } from '../hooks/useAccessibilityEngine';
import { AccessibilitySummary } from './AccessibilitySummary';
import { AccessibilityAlerts } from './AccessibilityAlerts';
import { AccessibilityRecommendations } from './AccessibilityRecommendations';
import { useAccessibilityStore } from '../store/accessibility-store';

export function AccessibilityDashboard() {
  useAccessibilityEngine();
  const lastUpdated = useAccessibilityStore((state) => state.lastUpdated);

  return (
    <div
      className="w-full h-full p-6 space-y-6 overflow-y-auto"
      role="main"
      aria-label="Accessibility Intelligence Dashboard"
    >
      <div className="flex justify-between items-end border-b border-white/10 pb-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2" tabIndex={0}>
            Accessibility Intelligence
          </h2>
          <p className="text-gray-400">
            Continuous evaluation of stadium accessibility for all visitor needs.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500" aria-live="polite">
            Last synced: {new Date(lastUpdated).toLocaleTimeString()}
          </p>
        </div>
      </div>

      <AccessibilitySummary />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AccessibilityAlerts />
        <AccessibilityRecommendations />
      </div>
    </div>
  );
}
