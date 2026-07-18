import { describe, it, expect, vi } from 'vitest';
import { buildAIContext } from './ai-context-builder';
import { useIntelligenceCoreStore } from '../../intelligence-core/store/intelligence-core-store';

vi.mock('../../intelligence-core/store/intelligence-core-store', () => ({
  useIntelligenceCoreStore: {
    getState: () => ({
      unifiedData: {
        modules: {
          'Crowd Intelligence': {
            id: 'crowd',
            name: 'Crowd Intelligence',
            metrics: {
              attendance: '65000',
            },
            recommendations: [{ message: 'Congestion at Gate B' }],
          },
        },
        globalAlerts: [],
        globalRecommendations: [
          {
            id: 'rec-1',
            type: 'operational',
            message: 'Congestion at Gate B',
            priority: 'high',
            actionable: true,
            timestamp: '',
          },
        ],
        eventTimeline: [],
        timestamp: new Date().toISOString(),
      },
    }),
  },
}));

describe('AI Context Builder', () => {
  it('builds context for Crowd_Intelligence intent', () => {
    const context = buildAIContext('Crowd_Intelligence');
    expect(context).toContain('65000');
    expect(context).toContain('Congestion at Gate B');
  });

  it('builds generalized context for General intent', () => {
    const context = buildAIContext('General');
    expect(typeof context).toBe('string');
  });
});
