import { StandardizedModule, OverallScores } from '../types';

export const calculateOverallScores = (
  modules: Record<string, StandardizedModule>
): OverallScores => {
  const modArray = Object.values(modules);

  if (modArray.length === 0) {
    return {
      overallStadiumHealth: 100,
      overallOperationalRisk: 0,
      overallConfidence: 100,
      overallReadinessScore: 100,
      overallSustainabilityScore: 100,
      overallAccessibilityScore: 100,
      overallMobilityScore: 100,
      overallSafetyScore: 100,
    };
  }

  const avgScore = (key: keyof StandardizedModule, defaultVal: number) => {
    const sum = modArray.reduce(
      (acc, mod) => acc + (typeof mod[key] === 'number' ? (mod[key] as number) : defaultVal),
      0
    );
    return Math.round(sum / modArray.length);
  };

  const getScoreByModule = (name: string): number => {
    return modules[name]?.healthScore || 100;
  };

  const overallStadiumHealth = avgScore('healthScore', 100);

  let riskScore = 0;
  modArray.forEach((mod) => {
    if (mod.riskLevel === 'Critical') riskScore += 40;
    else if (mod.riskLevel === 'High') riskScore += 25;
    else if (mod.riskLevel === 'Medium') riskScore += 10;
  });
  const overallOperationalRisk = Math.min(100, riskScore);

  const overallConfidence = avgScore('confidenceScore', 100);

  const overallReadinessScore = Math.max(0, 100 - overallOperationalRisk);

  const overallSustainabilityScore = getScoreByModule('Sustainability Intelligence');
  const overallAccessibilityScore = getScoreByModule('Accessibility Intelligence');
  const overallMobilityScore = getScoreByModule('Mobility Intelligence');
  const overallSafetyScore = getScoreByModule('Emergency Intelligence');

  return {
    overallStadiumHealth,
    overallOperationalRisk,
    overallConfidence,
    overallReadinessScore,
    overallSustainabilityScore,
    overallAccessibilityScore,
    overallMobilityScore,
    overallSafetyScore,
  };
};
