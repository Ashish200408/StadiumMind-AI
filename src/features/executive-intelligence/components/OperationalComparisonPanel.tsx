import React from 'react';
import { OperationalComparison } from '../types';
import { ArrowUpRight, ArrowDownRight, Minus, BarChart2 } from 'lucide-react';

interface OperationalComparisonPanelProps {
  comparisons: OperationalComparison[];
}

export const OperationalComparisonPanel: React.FC<OperationalComparisonPanelProps> = ({
  comparisons,
}) => {
  if (!comparisons || comparisons.length === 0) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 text-center text-slate-500 shadow-lg">
        <p className="font-medium">No previous operational snapshot available for comparison.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-lg">
      <div className="p-5 border-b border-white/10 bg-black/20 flex items-center gap-2">
        <BarChart2 className="h-5 w-5 text-cyan-400" />
        <h3 className="font-bold text-white tracking-wide">
          Operational Comparison <span className="text-slate-400 font-normal">(vs. Previous)</span>
        </h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {comparisons.map((comp) => {
            const isUpGood = [
              'Health',
              'Readiness',
              'Safety',
              'Mobility',
              'Sustainability',
              'Accessibility',
            ].includes(comp.metric);
            const isDownGood = ['Risk'].includes(comp.metric);

            let trendColor = 'text-slate-500 bg-slate-500/10 border-slate-500/30';
            let TrendIcon = Minus;

            if (comp.trend === 'Up') {
              trendColor = isUpGood
                ? 'text-green-400 bg-green-500/10 border-green-500/30'
                : 'text-red-400 bg-red-500/10 border-red-500/30';
              TrendIcon = ArrowUpRight;
            } else if (comp.trend === 'Down') {
              trendColor = isDownGood
                ? 'text-green-400 bg-green-500/10 border-green-500/30'
                : 'text-red-400 bg-red-500/10 border-red-500/30';
              TrendIcon = ArrowDownRight;
            }

            const isCurrentValid = Number.isFinite(comp.currentValue);
            const isPreviousValid = Number.isFinite(comp.previousValue);
            const canComputeDiff = isCurrentValid && isPreviousValid;
            const diff = canComputeDiff
              ? Math.abs(comp.currentValue - comp.previousValue).toFixed(1)
              : '--';
            const displayValue = isCurrentValid ? Math.round(comp.currentValue) : '--';

            return (
              <div
                key={comp.metric}
                className="p-4 bg-black/40 rounded-2xl border border-white/5 flex flex-col items-center text-center gap-2 hover:bg-white/5 transition-colors group"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-cyan-400 transition-colors">
                  {comp.metric}
                </span>
                <div className="flex items-end gap-3">
                  <span className="text-3xl font-black text-white">{displayValue}</span>
                  {comp.trend !== 'Stable' && (
                    <span
                      className={`px-2 py-1 rounded-md text-[10px] font-black tracking-wider flex items-center gap-1 border mb-1.5 ${trendColor}`}
                    >
                      <TrendIcon className="h-3 w-3" /> {diff}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
