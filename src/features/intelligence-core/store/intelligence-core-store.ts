import { create } from 'zustand';
import {
  UnifiedIntelligence,
  StandardizedModule,
  OverallScores,
  GlobalAlert,
  GlobalRecommendation,
  ExecutiveSnapshot,
  GlobalEvent,
} from '../types';

interface IntelligenceCoreState {
  unifiedData: UnifiedIntelligence;

  // Actions
  updateModule: (moduleName: string, moduleData: StandardizedModule) => void;
  updateOverallScores: (scores: OverallScores) => void;
  updateGlobalAlerts: (alerts: GlobalAlert[]) => void;
  updateGlobalRecommendations: (recommendations: GlobalRecommendation[]) => void;
  updateSnapshots: (snapshots: ExecutiveSnapshot) => void;
  updateEventTimeline: (events: GlobalEvent[]) => void;
  updateUnifiedData: (data: Partial<UnifiedIntelligence>) => void;
}

const initialScores: OverallScores = {
  overallStadiumHealth: 0,
  overallOperationalRisk: 0,
  overallConfidence: 0,
  overallReadinessScore: 0,
  overallSustainabilityScore: 0,
  overallAccessibilityScore: 0,
  overallMobilityScore: 0,
  overallSafetyScore: 0,
};

export const useIntelligenceCoreStore = create<IntelligenceCoreState>((set) => ({
  unifiedData: {
    modules: {},
    overallScores: initialScores,
    globalAlerts: [],
    globalRecommendations: [],
    snapshots: null,
    eventTimeline: [],
  },

  updateModule: (moduleName, moduleData) =>
    set((state) => ({
      unifiedData: {
        ...state.unifiedData,
        modules: {
          ...state.unifiedData.modules,
          [moduleName]: moduleData,
        },
      },
    })),

  updateOverallScores: (scores) =>
    set((state) => ({
      unifiedData: {
        ...state.unifiedData,
        overallScores: scores,
      },
    })),

  updateGlobalAlerts: (alerts) =>
    set((state) => ({
      unifiedData: {
        ...state.unifiedData,
        globalAlerts: alerts,
      },
    })),

  updateGlobalRecommendations: (recommendations) =>
    set((state) => ({
      unifiedData: {
        ...state.unifiedData,
        globalRecommendations: recommendations,
      },
    })),

  updateSnapshots: (snapshots) =>
    set((state) => ({
      unifiedData: {
        ...state.unifiedData,
        snapshots,
      },
    })),

  updateEventTimeline: (events) =>
    set((state) => ({
      unifiedData: {
        ...state.unifiedData,
        eventTimeline: events,
      },
    })),

  updateUnifiedData: (data) =>
    set((state) => ({
      unifiedData: {
        ...state.unifiedData,
        ...data,
      },
    })),
}));
