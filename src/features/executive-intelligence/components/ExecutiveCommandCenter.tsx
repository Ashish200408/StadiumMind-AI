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
import { motion, Variants } from 'framer-motion';
import { Calendar, Users, Cloud, Activity, CheckCircle2, Hexagon } from 'lucide-react';

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
      if (import.meta.env.DEV) console.error(error);
    } finally {
      setIsLoadingExplanation(false);
    }
  };

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8"
    >
      {/* Premium Hero Section */}
      <motion.div
        variants={item}
        className="relative overflow-hidden rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Hexagon className="h-8 w-8 text-cyan-400" />
              <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                Lusail Stadium
              </h1>
            </div>
            <p className="text-slate-300 font-medium tracking-wide flex items-center gap-2 text-lg">
              FIFA World Cup 2026{' '}
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span> Mission
              Control
            </p>
          </div>

          {/* Quick Stats HUD */}
          <div className="flex flex-wrap items-center gap-4 xl:gap-8 bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                <Calendar className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Current Match
                </p>
                <p className="text-sm font-bold text-white">Final: AGR vs SPA</p>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                <Users className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Est. Attendance
                </p>
                <p className="text-sm font-bold text-white">88,966 / 88,966</p>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/30">
                <Cloud className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Weather
                </p>
                <p className="text-sm font-bold text-white">24°C, Clear</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
              <span className="text-sm font-bold text-cyan-400 uppercase tracking-widest">
                Live Monitoring
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span className="text-xs font-bold text-green-400">AI Core Nominal</span>
            </div>
          </div>

          <div className="w-full md:w-auto">
            <DemoScenarioSelector />
          </div>
        </div>
      </motion.div>

      {/* Top Row: Executive Summary & Operational Comparison */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <ExecutiveSummaryCard scores={overallScores} />
        </div>
        <div className="lg:col-span-12">
          <OperationalComparisonPanel comparisons={operationalComparisons} />
        </div>
      </motion.div>

      {/* Middle Row: Decision Support, Explainability, Notifications */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
      </motion.div>

      {/* Bottom Row: Action Priority, Timeline, Reporting */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
      </motion.div>
    </motion.div>
  );
};
