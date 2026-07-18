import { describe, it, expect, beforeEach } from 'vitest';
import { useIntelligenceCoreStore } from './intelligence-core-store';

describe('Intelligence Core Store', () => {
  beforeEach(() => {
    // Reset state before each test
    useIntelligenceCoreStore.setState({
      unifiedData: {
        modules: {},
        overallScores: {
          overallStadiumHealth: 0,
          overallOperationalRisk: 0,
          overallConfidence: 0,
          overallReadinessScore: 0,
          overallSustainabilityScore: 0,
          overallAccessibilityScore: 0,
          overallMobilityScore: 0,
          overallSafetyScore: 0,
        },
        globalAlerts: [],
        globalRecommendations: [],
        snapshots: null,
        eventTimeline: [],
      },
    });
  });

  it('updates a module', () => {
    const store = useIntelligenceCoreStore.getState();
    const mockModule = {
      moduleName: 'Crowd Intelligence',
      healthScore: 90,
      riskLevel: 'Low' as const,
      confidenceScore: 95,
      status: 'Active' as const,
      metrics: { attendance: 80000 },
      recommendations: [],
      alerts: [],
      lastUpdated: new Date().toISOString(),
    };

    store.updateModule('Crowd Intelligence', mockModule);

    const updatedState = useIntelligenceCoreStore.getState();
    expect(updatedState.unifiedData.modules['Crowd Intelligence']).toEqual(mockModule);
  });

  it('updates overall scores', () => {
    const store = useIntelligenceCoreStore.getState();
    const scores = {
      overallStadiumHealth: 85,
      overallOperationalRisk: 10,
      overallConfidence: 99,
      overallReadinessScore: 95,
      overallSustainabilityScore: 80,
      overallAccessibilityScore: 90,
      overallMobilityScore: 75,
      overallSafetyScore: 100,
    };

    store.updateOverallScores(scores);

    const updatedState = useIntelligenceCoreStore.getState();
    expect(updatedState.unifiedData.overallScores).toEqual(scores);
  });

  it('updates global alerts and recommendations', () => {
    const store = useIntelligenceCoreStore.getState();
    const alert = {
      id: 'alert-1',
      moduleSource: 'Mobility',
      severity: 'High' as const,
      priority: 2,
      message: 'Test alert',
      timestamp: new Date().toISOString(),
    };
    const rec = {
      id: 'rec-1',
      moduleSource: ['Mobility'],
      action: 'Test action',
      priorityRank: 1,
    };

    store.updateGlobalAlerts([alert]);
    store.updateGlobalRecommendations([rec]);

    const updatedState = useIntelligenceCoreStore.getState();
    expect(updatedState.unifiedData.globalAlerts).toHaveLength(1);
    expect(updatedState.unifiedData.globalRecommendations).toHaveLength(1);
  });
});
