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
    timestamp: new Date().toISOString(),
    overallScores: data.overallScores,
    currentDemoScenario:
      (data.snapshots as any)?.operationalSnapshot?.currentScenario || 'Normal Match',
    crowdIntelligence: data.modules['Crowd Intelligence']?.metrics || {},
    navigationIntelligence: data.modules['Navigation Intelligence']?.metrics || {},
    mobilityIntelligence: data.modules['Mobility Intelligence']?.metrics || {},
    accessibilityIntelligence: data.modules['Accessibility Intelligence']?.metrics || {},
    sustainabilityIntelligence: data.modules['Sustainability Intelligence']?.metrics || {},
    activeAlerts: criticalHighAlerts,
    otherAlertsSummary: lowerAlertsSummary,
    topRecommendations: topRecommendations,
    recentEvents,
    executiveSummary: data.snapshots,
  };

  return JSON.stringify(compressed);
};
