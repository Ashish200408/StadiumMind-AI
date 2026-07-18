import { UnifiedIntelligence } from '../../intelligence-core/types';
import { AIIntent } from '../utils/intent-detector';

export const compressContext = (
  data: UnifiedIntelligence,
  intent: AIIntent = 'General'
): string => {
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

  const compressed: any = {
    timestamp: new Date().toISOString(),
    overallScores: data.overallScores,
    currentDemoScenario:
      (data.snapshots as any)?.operationalSnapshot?.currentScenario || 'Normal Match',
    activeAlerts: criticalHighAlerts,
    otherAlertsSummary: lowerAlertsSummary,
    topRecommendations: topRecommendations,
    recentEvents,
  };

  if (intent === 'Stadium_Operations' || intent === 'Executive_Reports') {
    compressed.executiveSummary = data.snapshots;
    compressed.crowdIntelligence = data.modules['Crowd Intelligence']?.metrics || {};
    compressed.navigationIntelligence = data.modules['Navigation Intelligence']?.metrics || {};
    compressed.mobilityIntelligence = data.modules['Mobility Intelligence']?.metrics || {};
    compressed.accessibilityIntelligence =
      data.modules['Accessibility Intelligence']?.metrics || {};
    compressed.sustainabilityIntelligence =
      data.modules['Sustainability Intelligence']?.metrics || {};
  } else if (intent === 'Crowd_Intelligence') {
    compressed.crowdIntelligence = data.modules['Crowd Intelligence']?.metrics || {};
  } else if (intent === 'Navigation') {
    compressed.navigationIntelligence = data.modules['Navigation Intelligence']?.metrics || {};
    compressed.mobilityIntelligence = data.modules['Mobility Intelligence']?.metrics || {};
  } else if (intent === 'Sustainability') {
    compressed.sustainabilityIntelligence =
      data.modules['Sustainability Intelligence']?.metrics || {};
  } else if (intent === 'Emergency_Response') {
    // Already includes alerts which is main for emergency, but we can add specific metrics if they existed
  }

  return JSON.stringify(compressed);
};
