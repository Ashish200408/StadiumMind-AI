import { UnifiedIntelligence } from '../../intelligence-core/types';

export const compressContext = (data: UnifiedIntelligence): string => {
  // 1. Remove duplicate metrics (relying on overallScores)
  const scores = data.overallScores;

  // 2. Prioritize Critical and High severity alerts
  const criticalHighAlerts = data.globalAlerts.filter(
    (a) => a.severity === 'Critical' || a.severity === 'High'
  );
  const lowerAlerts = data.globalAlerts.filter(
    (a) => a.severity !== 'Critical' && a.severity !== 'High'
  );

  // Summarize lower severity alerts
  const lowerAlertsSummary =
    lowerAlerts.length > 0
      ? `${lowerAlerts.length} lower severity alerts active.`
      : 'No lower severity alerts.';

  // 3. Keep only the most recent timeline events (last 10)
  const recentEvents = data.eventTimeline.slice(0, 10);

  // 4. Extract Recommendations (top 5)
  const topRecommendations = data.globalRecommendations.slice(0, 5);

  const compressed = {
    scores,
    criticalAlerts: criticalHighAlerts,
    otherAlerts: lowerAlertsSummary,
    recentEvents,
    topRecommendations,
    snapshots: data.snapshots,
  };

  return JSON.stringify(compressed);
};
