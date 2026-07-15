import React, { useState } from 'react';
import { useExecutiveIntelligence } from '../hooks/useExecutiveIntelligence';
import { ExecutiveSummaryCard } from './ExecutiveSummaryCard';
import { OperationalComparisonPanel } from './OperationalComparisonPanel';
import { ExecutiveNotifications } from './ExecutiveNotifications';
import { ActionPriorityList } from './ActionPriorityList';
import { ReportGenerator } from './ReportGenerator';
import { ReportHistoryPanel } from './ReportHistoryPanel';
import { ExplainabilityPanel } from './ExplainabilityPanel';
import { DecisionSupportPanel } from './DecisionSupportPanel';
import { DecisionTimeline } from './DecisionTimeline';
import { DemoScenarioSelector } from './DemoScenarioSelector';
import { AIExplanation } from '../types';

export const ExecutiveCommandCenter: React.FC = () => {
  const {
    overallScores,
    globalAlerts,
    reportsHistory,
    operationalComparisons,
    decisionSupportData,
    fetchExplanation,
  } = useExecutiveIntelligence();

  const [explanation, setExplanation] = useState<AIExplanation | null>(null);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);

  const handleRecommendationSelect = async (recommendation: string) => {
    setIsLoadingExplanation(true);
    try {
      const exp = await fetchExplanation(recommendation);
      setExplanation(exp);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header & Demo Scenario */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Executive Command Center</h1>
          <p className="text-slate-400 mt-1">Unified Stadium Intelligence & Operations Copilot</p>
        </div>
        <div className="w-full md:w-auto">
          <DemoScenarioSelector />
        </div>
      </div>

      {/* Top Row: Executive Summary & Operational Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-12">
          <ExecutiveSummaryCard scores={overallScores} />
        </div>
        <div className="lg:col-span-12">
          <OperationalComparisonPanel comparisons={operationalComparisons} />
        </div>
      </div>

      {/* Middle Row: Decision Support, Explainability, Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 h-[500px]">
          <DecisionSupportPanel onRecommendationSelect={handleRecommendationSelect} />
        </div>
        <div className="lg:col-span-4 h-[500px]">
          <ExplainabilityPanel explanation={explanation} isLoading={isLoadingExplanation} />
        </div>
        <div className="lg:col-span-3 h-[500px] flex flex-col gap-6">
          <div className="flex-1">
            <ExecutiveNotifications alerts={globalAlerts} />
          </div>
        </div>
      </div>

      {/* Bottom Row: Action Priority, Timeline, Reporting */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 h-[500px]">
          <ActionPriorityList
            incidents={decisionSupportData?.highestPriorityIncidents || []}
            actions={decisionSupportData?.immediateActions || []}
          />
        </div>
        <div className="lg:col-span-4 h-[500px]">
          <DecisionTimeline />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6 h-[500px]">
          <div className="shrink-0">
            <ReportGenerator />
          </div>
          <div className="flex-1 min-h-0">
            <ReportHistoryPanel reports={reportsHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};
