import { describe, it, expect, vi } from 'vitest';
import { simulationEngine } from './simulation-service';

vi.mock('../../intelligence-core/services/standardization-service', () => ({
  mapCrowdToStandard: vi.fn(),
  mapMobilityToStandard: vi.fn(),
  mapAccessibilityToStandard: vi.fn(),
  mapSustainabilityToStandard: vi.fn(),
  mapEmergencyToStandard: vi.fn(),
  mapNavigationToStandard: vi.fn(),
}));

describe('Simulation Engine', () => {
  it('has start and stop methods and controls the interval', () => {
    expect(typeof simulationEngine.start).toBe('function');
    expect(typeof simulationEngine.stop).toBe('function');

    // Run start
    simulationEngine.start();
    expect((simulationEngine as any).intervalId).not.toBeNull();

    // Run stop
    simulationEngine.stop();
    expect((simulationEngine as any).intervalId).toBeNull();
  });
});
