import { useAccessibilityStore } from '../store/accessibility-store';
import { Card } from '../../../components/ui/card';

export function AccessibilityAlerts() {
  const detections = useAccessibilityStore((state) => state.detections);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'high':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'moderate':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    }
  };

  return (
    <Card
      className="p-6 bg-white/5 backdrop-blur border-white/10 h-full"
      role="region"
      aria-label="Accessibility Alerts"
    >
      <h3 className="text-lg font-semibold text-white mb-4" id="alerts-heading">
        Active Accessibility Alerts
      </h3>
      {detections.length === 0 ? (
        <p className="text-gray-400 text-sm">No accessibility issues detected.</p>
      ) : (
        <ul
          className="space-y-3 max-h-[400px] overflow-y-auto pr-2"
          aria-labelledby="alerts-heading"
        >
          {detections.map((det) => (
            <li
              key={det.id}
              className={`p-3 rounded-lg border flex gap-3 items-start ${getSeverityColor(det.severity)}`}
              role="alert"
            >
              <div className="flex-1">
                <p className="text-sm font-medium">{det.message}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(det.timestamp).toLocaleTimeString()} • {det.type.replace(/_/g, ' ')}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
