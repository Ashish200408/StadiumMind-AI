import { StandardizedModule, ExecutiveSnapshot } from '../types';
import { useSimulationStore } from '../../simulation/store/simulation-store';

export const generateSnapshots = (
  modules: Record<string, StandardizedModule>
): ExecutiveSnapshot => {
  const getMod = (name: string) => modules[name] || null;

  const crowd = getMod('Crowd Intelligence');
  const mobility = getMod('Mobility Intelligence');
  const accessibility = getMod('Accessibility Intelligence');
  const sustainability = getMod('Sustainability Intelligence');
  const emergency = getMod('Emergency Intelligence');

  const currentScenario = (useSimulationStore.getState() as any).currentScenario || 'Normal Match';

  return {
    operationalSnapshot: {
      status: 'Active',
      currentScenario: currentScenario,
      modulesReporting: Object.keys(modules).length,
      criticalAlerts: Object.values(modules)
        .flatMap((m) => m.alerts)
        .filter((a) => a.severity === 'Critical').length,
    },
    crowdSnapshot: crowd
      ? {
          health: crowd.healthScore,
          risk: crowd.riskLevel,
          keyMetrics: crowd.metrics,
        }
      : {},
    mobilitySnapshot: mobility
      ? {
          health: mobility.healthScore,
          risk: mobility.riskLevel,
          keyMetrics: mobility.metrics,
        }
      : {},
    accessibilitySnapshot: accessibility
      ? {
          health: accessibility.healthScore,
          risk: accessibility.riskLevel,
          keyMetrics: accessibility.metrics,
        }
      : {},
    sustainabilitySnapshot: sustainability
      ? {
          health: sustainability.healthScore,
          risk: sustainability.riskLevel,
          keyMetrics: sustainability.metrics,
        }
      : {},
    emergencySnapshot: emergency
      ? {
          health: emergency.healthScore,
          risk: emergency.riskLevel,
          keyMetrics: emergency.metrics,
        }
      : {},
    generatedAt: new Date().toISOString(),
  };
};
