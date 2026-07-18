import { describe, it, expect, beforeEach } from 'vitest';
import { useIntelligenceStore } from './intelligence-store';

describe('Crowd Intelligence Store', () => {
  beforeEach(() => {
    useIntelligenceStore.setState({
      metrics: {
        congestionScore: 0,
        queuePressure: 0,
        gateUtilization: 0,
        crowdFlowTrend: 'stable',
        waitingTimeEstimate: 0,
        safeCapacityPercentage: 100,
        riskLevel: 'low',
        confidenceScore: 100,
      },
      detections: [],
      recommendations: [],
    });
  });

  it('updates metrics correctly', () => {
    const store = useIntelligenceStore.getState();
    store.updateIntelligence(
      {
        congestionScore: 50,
        queuePressure: 30,
        gateUtilization: 60,
        crowdFlowTrend: 'increasing',
        waitingTimeEstimate: 10,
        safeCapacityPercentage: 80,
        riskLevel: 'low' as any,
        confidenceScore: 95,
      },
      [],
      [{ id: '1', timestamp: '123', action: 'Open gate' } as any]
    );

    const updated = useIntelligenceStore.getState();
    expect(updated.metrics.congestionScore).toBe(50);
    expect(updated.recommendations.length).toBe(1);
  });
});
