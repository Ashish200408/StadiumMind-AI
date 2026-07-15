import React from 'react';
import { OverallScores } from '../../intelligence-core/types';

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
      return 'text-green-400 border-green-500/50 shadow-[0_0_15px_rgba(74,222,128,0.2)]';
    if (score >= 60)
      return 'text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]';
    return 'text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
  };

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Executive Summary</h2>
          <p className="text-sm text-slate-400">Real-time stadium operational overview</p>
        </div>
        <div
          className={`px-4 py-2 rounded-xl border-2 flex flex-col items-center justify-center ${getHealthColor(scores.overallStadiumHealth)} bg-slate-900`}
        >
          <span className="text-xs uppercase tracking-wider font-bold mb-1">Stadium Health</span>
          <span className="text-3xl font-black">{Math.round(scores.overallStadiumHealth)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Readiness', value: scores.overallReadinessScore },
          { label: 'Safety', value: scores.overallSafetyScore },
          { label: 'Mobility', value: scores.overallMobilityScore },
          { label: 'Sustainability', value: scores.overallSustainabilityScore },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className={`p-4 rounded-lg border ${getScoreColor(kpi.value)} flex flex-col gap-1`}
          >
            <span className="text-xs font-semibold uppercase opacity-80">{kpi.label}</span>
            <span className="text-2xl font-bold">{Math.round(kpi.value)}</span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-700/50 flex justify-between items-center">
        <span className="text-sm text-slate-400">Operational Risk Level</span>
        <div className="flex items-center gap-3">
          <div className="w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${scores.overallOperationalRisk > 60 ? 'bg-red-500' : scores.overallOperationalRisk > 30 ? 'bg-amber-500' : 'bg-green-500'}`}
              style={{ width: `${scores.overallOperationalRisk}%` }}
            />
          </div>
          <span className="text-sm font-bold text-slate-200">
            {Math.round(scores.overallOperationalRisk)}%
          </span>
        </div>
      </div>
    </div>
  );
};
