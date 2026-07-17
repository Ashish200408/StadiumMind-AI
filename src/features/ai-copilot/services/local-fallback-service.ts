import { useIntelligenceCoreStore } from '../../intelligence-core/store/intelligence-core-store';

export const generateGracefulFallback = (prompt: string): string => {
  const { unifiedData } = useIntelligenceCoreStore.getState();

  if (!unifiedData) {
    return 'The Unified Intelligence Core is currently initializing. Please standby for operational data.';
  }

  const { overallScores, globalAlerts, globalRecommendations, snapshots } = unifiedData;
  const operationalSnapshot = snapshots?.operationalSnapshot;

  const health = overallScores?.overallStadiumHealth || 0;
  const scenario = operationalSnapshot?.currentScenario || 'Normal Match';

  const mobilityScore = overallScores?.overallMobilityScore || 0;
  const sustainabilityScore = overallScores?.overallSustainabilityScore || 0;
  const accessibilityScore = overallScores?.overallAccessibilityScore || 0;
  const emergencyScore = overallScores?.overallSafetyScore || 0;
  const readinessScore = overallScores?.overallReadinessScore || 0;

  const criticalAlerts = globalAlerts.filter(
    (a) => a.severity === 'Critical' || a.severity === 'High'
  );
  const alertStr =
    criticalAlerts.length > 0
      ? `${criticalAlerts.length} high priority alerts active (e.g., ${criticalAlerts[0].message}).`
      : 'Safety remains stable with no critical incidents.';

  const rec =
    globalRecommendations.length > 0
      ? globalRecommendations[0].action
      : 'Maintain current operational posture.';

  const isReport = prompt.includes('Generate a comprehensive');
  const isSummary = prompt.includes('Provide a strict 2-sentence summary');

  if (isSummary) {
    return `Stadium health is currently ${health}% with the ${scenario} scenario active. ${alertStr}`;
  }

  let fallbackText = `✨ **StadiumMind AI Operations Assistant**\n\n`;

  if (isReport) {
    fallbackText += `### Executive Summary\n`;
    fallbackText += `Current Stadium Health is operating at **${health}%**. The active operational scenario is **${scenario}**.\n\n`;
    fallbackText += `### Key Metrics\n`;
    fallbackText += `- **Overall Readiness**: ${readinessScore}/100\n`;
    fallbackText += `- **Mobility Score**: ${mobilityScore}/100\n`;
    fallbackText += `- **Sustainability Score**: ${sustainabilityScore}/100\n`;
    fallbackText += `- **Accessibility Score**: ${accessibilityScore}/100\n`;
    fallbackText += `- **Emergency & Safety**: ${emergencyScore}/100\n\n`;
    fallbackText += `### Operational Highlights\n`;
    fallbackText += `${alertStr}\n\n`;
    fallbackText += `### Priority Action Items\n`;
    fallbackText += `1. **Recommended action**: ${rec}\n`;
  } else {
    fallbackText += `**Current Stadium Health**: ${health}%\n\n`;
    fallbackText += `**Active Scenario**: ${scenario}\n\n`;
    fallbackText += `**Operational Breakdown**:\n`;
    fallbackText += `- Readiness: ${readinessScore}\n`;
    fallbackText += `- Mobility: ${mobilityScore}\n`;
    fallbackText += `- Sustainability: ${sustainabilityScore}\n`;
    fallbackText += `- Accessibility: ${accessibilityScore}\n`;
    fallbackText += `- Emergency State: ${emergencyScore}\n\n`;
    fallbackText += `**Status**: ${alertStr}\n\n`;
    fallbackText += `**Recommended Action**:\n${rec}`;
  }

  return fallbackText;
};
