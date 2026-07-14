import { useIntelligenceCoreStore } from '../store/intelligence-core-store';
import { calculateOverallScores } from './health-score-engine';
import { mergeAlerts } from './alert-merging-service';
import { mergeRecommendations } from './recommendation-engine';
import { generateSnapshots } from './snapshot-generator';
import { mergeTimelines } from './timeline-merger';
import {
  mapCrowdToStandard,
  mapMobilityToStandard,
  mapAccessibilityToStandard,
  mapSustainabilityToStandard,
  mapEmergencyToStandard,
} from './standardization-service';

export const triggerAggregation = () => {
  const store = useIntelligenceCoreStore.getState();

  // 1. Standardize all modules
  const modules = {
    'Crowd Intelligence': mapCrowdToStandard(),
    'Mobility Intelligence': mapMobilityToStandard(),
    'Accessibility Intelligence': mapAccessibilityToStandard(),
    'Sustainability Intelligence': mapSustainabilityToStandard(),
    'Emergency Intelligence': mapEmergencyToStandard(),
  };

  // Update modules in store
  Object.values(modules).forEach((mod) => {
    store.updateModule(mod.moduleName, mod);
  });

  // 2. Orchestrate Calculations (Health Score Engine)
  const overallScores = calculateOverallScores(modules);
  store.updateOverallScores(overallScores);

  // 3. Orchestrate Alert Merging
  const globalAlerts = mergeAlerts(modules);
  store.updateGlobalAlerts(globalAlerts);

  // 4. Orchestrate Recommendations
  const globalRecommendations = mergeRecommendations(modules);
  store.updateGlobalRecommendations(globalRecommendations);

  // 5. Orchestrate Snapshots
  const snapshots = generateSnapshots(modules);
  store.updateSnapshots(snapshots);

  // 6. Orchestrate Event Timeline
  const globalTimeline = mergeTimelines();
  store.updateEventTimeline(globalTimeline);
};
