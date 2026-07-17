import React from 'react';
import { OverallScores } from '../../intelligence-core/types';
import { motion } from 'framer-motion';
import {
  Activity,
  ShieldCheck,
  Bus,
  Leaf,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Target,
} from 'lucide-react';

interface ExecutiveSummaryCardProps {
  scores: OverallScores;
}

export const ExecutiveSummaryCard: React.FC<ExecutiveSummaryCardProps> = ({ scores }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/10 border-green-500/30';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-red-400 bg-red-500/10 border-red-500/30';
  };

  const getHealthColor = (score: number) => {
    if (score >= 80)
      return 'text-green-400 border-green-500/50 shadow-[0_0_20px_rgba(74,222,128,0.3)] bg-green-500/10';
    if (score >= 60)
      return 'text-amber-400 border-amber-500/50 shadow-[0_0_20px_rgba(251,191,36,0.3)] bg-amber-500/10';
    return 'text-red-400 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)] bg-red-500/10';
  };

  const metrics = [
    { label: 'Readiness', value: scores.overallReadinessScore, icon: Target, trend: 'up' },
    { label: 'Safety', value: scores.overallSafetyScore, icon: ShieldCheck, trend: 'up' },
    { label: 'Mobility', value: scores.overallMobilityScore, icon: Bus, trend: 'down' },
    { label: 'Sustainability', value: scores.overallSustainabilityScore, icon: Leaf, trend: 'up' },
  ];

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 flex flex-col gap-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Activity className="h-6 w-6 text-cyan-400" />
            Executive Summary
          </h2>
          <p className="text-sm text-slate-400 mt-1 font-medium tracking-wide">
            Real-time stadium operational overview
          </p>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className={`px-8 py-4 rounded-2xl border-2 flex items-center justify-center gap-6 ${getHealthColor(scores.overallStadiumHealth)} relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]" />

          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest font-black opacity-80 mb-1">
              Stadium Health
            </span>
            <div className="flex items-baseline gap-1">
              <motion.span
                key={scores.overallStadiumHealth}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-black tracking-tighter"
              >
                {Math.round(scores.overallStadiumHealth)}
              </motion.span>
              <span className="text-2xl font-bold opacity-50">%</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={kpi.label}
              className={`p-6 rounded-2xl border ${getScoreColor(kpi.value)} relative overflow-hidden group hover:shadow-[0_0_20px_currentColor] transition-all duration-300`}
            >
              {/* Soft background glow */}
              <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                <Icon className="h-24 w-24" />
              </div>

              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-bold uppercase tracking-wider opacity-80 flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {kpi.label}
                  </span>
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 opacity-60" />
                  ) : (
                    <TrendingDown className="h-4 w-4 opacity-60" />
                  )}
                </div>

                <div className="flex items-baseline gap-1">
                  <motion.span
                    key={kpi.value}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-black"
                  >
                    {Math.round(kpi.value)}
                  </motion.span>
                  <span className="text-lg font-bold opacity-50">/100</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-slate-400" />
          <span className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Operational Risk Level
          </span>
        </div>
        <div className="flex items-center gap-4 flex-1 w-full sm:max-w-md">
          <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden border border-white/5 shadow-inner relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scores.overallOperationalRisk}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`absolute top-0 left-0 h-full ${scores.overallOperationalRisk > 60 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : scores.overallOperationalRisk > 30 ? 'bg-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]'}`}
            />
          </div>
          <span className="text-lg font-black text-white min-w-[3rem] text-right">
            {Math.round(scores.overallOperationalRisk)}%
          </span>
        </div>
      </div>
    </div>
  );
};
