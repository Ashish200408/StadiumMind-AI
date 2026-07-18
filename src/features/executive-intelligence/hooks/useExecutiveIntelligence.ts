import { useState, useCallback, useMemo, useEffect } from 'react';
import { useIntelligenceCoreStore } from '../../intelligence-core/store/intelligence-core-store';
import { useExecutiveStore } from '../store/executive-store';
import {
  generateExecutiveReport,
  getAIExplanation,
  getDecisionSupportInsights,
} from '../services/executive-service';
import {
  ReportType,
  GeneratedReport,
  AIExplanation,
  DecisionSupportData,
  OperationalComparison,
} from '../types';

export const useExecutiveIntelligence = () => {
  const { unifiedData } = useIntelligenceCoreStore();
  const { modules, overallScores, globalAlerts, globalRecommendations, snapshots, eventTimeline } =
    unifiedData;

  const {
    reportsHistory,

    previousScores,
    addReportToHistory,
    updateReportExportStatus,
    setPreviousSnapshot,
  } = useExecutiveStore();

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [decisionSupportData, setDecisionSupportData] = useState<DecisionSupportData | null>(null);
  const [isLoadingDecisionData, setIsLoadingDecisionData] = useState(false);

  // Take a snapshot for comparison every time overallScores changes significantly, or on mount
  useEffect(() => {
    if (overallScores && snapshots) {
      // In a real app, you'd only update previousSnapshot periodically (e.g., every 5 mins).
      // Here we just set it if it doesn't exist to have something to compare against.
      if (!previousScores) {
        setPreviousSnapshot(snapshots, overallScores);
      }
    }
  }, [overallScores, snapshots, previousScores, setPreviousSnapshot]);

  const generateReport = useCallback(
    async (type: ReportType): Promise<GeneratedReport | null> => {
      setIsGeneratingReport(true);
      try {
        const data = {
          modules,
          overallScores,
          globalAlerts,
          globalRecommendations,
          snapshots,
          eventTimeline,
        };
        const report = await generateExecutiveReport(type, data);
        addReportToHistory(report);
        return report;
      } catch (error) {
        if (import.meta.env.DEV) console.error('Report generation failed', error);
        return null;
      } finally {
        setIsGeneratingReport(false);
      }
    },
    [
      modules,
      overallScores,
      globalAlerts,
      globalRecommendations,
      snapshots,
      eventTimeline,
      addReportToHistory,
    ]
  );

  const fetchExplanation = useCallback(
    async (recommendation: string): Promise<AIExplanation> => {
      const data = {
        modules,
        overallScores,
        globalAlerts,
        globalRecommendations,
        snapshots,
        eventTimeline,
      };
      return getAIExplanation(recommendation, data);
    },
    [modules, overallScores, globalAlerts, globalRecommendations, snapshots, eventTimeline]
  );

  const loadDecisionSupport = useCallback(async () => {
    setIsLoadingDecisionData(true);
    try {
      const data = {
        modules,
        overallScores,
        globalAlerts,
        globalRecommendations,
        snapshots,
        eventTimeline,
      };
      const insights = await getDecisionSupportInsights(data);
      setDecisionSupportData(insights);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Failed to load decision support', error);
    } finally {
      setIsLoadingDecisionData(false);
    }
  }, [modules, overallScores, globalAlerts, globalRecommendations, snapshots, eventTimeline]);

  const operationalComparisons = useMemo<OperationalComparison[]>(() => {
    if (!previousScores) return [];

    const compare = (metric: string, curr: number, prev: number): OperationalComparison => {
      let trend: 'Up' | 'Down' | 'Stable' = 'Stable';
      if (curr > prev) trend = 'Up';
      else if (curr < prev) trend = 'Down';

      let status: 'Good' | 'Warning' | 'Critical' = 'Good';
      if (curr < 60) status = 'Critical';
      else if (curr < 80) status = 'Warning';

      return { metric, currentValue: curr, previousValue: prev, trend, status };
    };

    return [
      compare('Health', overallScores.overallStadiumHealth, previousScores.overallStadiumHealth),
      compare('Risk', overallScores.overallOperationalRisk, previousScores.overallOperationalRisk),
      compare('Mobility', overallScores.overallMobilityScore, previousScores.overallMobilityScore),
      compare(
        'Sustainability',
        overallScores.overallSustainabilityScore,
        previousScores.overallSustainabilityScore
      ),
      compare(
        'Accessibility',
        overallScores.overallAccessibilityScore,
        previousScores.overallAccessibilityScore
      ),
    ];
  }, [overallScores, previousScores]);

  return {
    // Current Intelligence Data
    overallScores,
    globalAlerts,
    globalRecommendations,
    eventTimeline,

    // Executive Methods
    generateReport,
    isGeneratingReport,
    fetchExplanation,

    // Decision Support
    loadDecisionSupport,
    decisionSupportData,
    isLoadingDecisionData,

    // Report History
    reportsHistory,
    updateReportExportStatus,

    // Operational Comparisons
    operationalComparisons,
  };
};
