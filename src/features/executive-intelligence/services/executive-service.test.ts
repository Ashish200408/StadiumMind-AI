import { describe, it, expect, vi } from 'vitest';
import {
  generateExecutiveReport,
  getAIExplanation,
  getDecisionSupportInsights,
} from './executive-service';
import { UnifiedIntelligence } from '../../intelligence-core/types';

vi.mock('../../ai-copilot/services/gemini-service', () => ({
  callGemini: vi.fn().mockImplementation((prompt: string) => {
    if (prompt.includes('Provide a JSON response with the following structure exactly')) {
      return Promise.resolve(
        JSON.stringify({ recommendation: 'Test Recommendation', confidence: 95 })
      );
    }
    return Promise.resolve(JSON.stringify({ topRecommendedActions: [] }));
  }),
}));

describe('Executive Service', () => {
  const mockUnifiedData: UnifiedIntelligence = {
    modules: {},
    overallScores: {
      overallStadiumHealth: 90,
      overallOperationalRisk: 20,
      overallConfidence: 95,
      overallReadinessScore: 92,
      overallSustainabilityScore: 85,
      overallAccessibilityScore: 90,
      overallMobilityScore: 88,
      overallSafetyScore: 99,
    },
    globalAlerts: [
      {
        id: '1',
        moduleSource: 'Emergency',
        severity: 'Critical',
        priority: 1,
        message: 'Fire alarm at Gate A',
        timestamp: new Date().toISOString(),
      },
    ],
    globalRecommendations: [],
    snapshots: null,
    eventTimeline: [],
  };

  it('generates an executive report cleanly', async () => {
    const report = await generateExecutiveReport('Daily Operations' as any, mockUnifiedData);
    expect(report.type).toBe('Daily Operations');
    expect(report.generatedTime).toBeDefined();
    expect(report.content).toBeDefined();
    expect(report.summary).toBeDefined();
  });

  it('gets AI explanation with fallback on error', async () => {
    const explanation = await getAIExplanation('Test Recommendation', mockUnifiedData);
    expect(explanation.recommendation).toBe('Test Recommendation');
    expect(explanation.confidence).toBeDefined();
  });

  it('gets decision support insights cleanly', async () => {
    const support = await getDecisionSupportInsights(mockUnifiedData);
    expect(support.topRecommendedActions).toBeDefined();
  });
});
