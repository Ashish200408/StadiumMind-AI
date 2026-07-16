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
  mapNavigationToStandard,
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
    'Navigation Intelligence': mapNavigationToStandard(),
  };

  // 2. Orchestrate Calculations (Health Score Engine)
  const overallScores = calculateOverallScores(modules);

  // 3. Orchestrate Alert Merging
  const globalAlerts = mergeAlerts(modules);

  // 4. Orchestrate Recommendations
  const globalRecommendations = mergeRecommendations(modules);

  // 5. Orchestrate Snapshots
  const snapshots = generateSnapshots(modules);

  // 6. Orchestrate Event Timeline
  const globalTimeline = mergeTimelines();

  // Update all data at once to prevent multiple re-renders
  store.updateUnifiedData({
    modules,
    overallScores,
    globalAlerts,
    globalRecommendations,
    snapshots,
    eventTimeline: globalTimeline,
  });
};
