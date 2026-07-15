import React from 'react';
import { OperationalComparison } from '../types';

interface OperationalComparisonPanelProps {
  comparisons: OperationalComparison[];
}

export const OperationalComparisonPanel: React.FC<OperationalComparisonPanelProps> = ({
  comparisons,
}) => {
  if (!comparisons || comparisons.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 text-center text-slate-500">
        No previous operational snapshot available for comparison.
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="p-4 border-b border-slate-700/50 bg-slate-800/80">
        <h3 className="font-semibold text-slate-200">Operational Comparison (vs. Previous)</h3>
      </div>
      <div className="p-4">
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

            let trendColor = 'text-slate-400';
            let trendIcon = '—';

            if (comp.trend === 'Up') {
              trendColor = isUpGood ? 'text-green-400' : 'text-red-400';
              trendIcon = '▲';
            } else if (comp.trend === 'Down') {
              trendColor = isDownGood ? 'text-green-400' : 'text-red-400';
              trendIcon = '▼';
            }

            const diff = Math.abs(comp.currentValue - comp.previousValue).toFixed(1);

            return (
              <div
                key={comp.metric}
                className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/30 flex flex-col items-center text-center gap-1"
              >
                <span className="text-xs font-medium text-slate-400">{comp.metric}</span>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-slate-200">
                    {Math.round(comp.currentValue)}
                  </span>
                  {comp.trend !== 'Stable' && (
                    <span className={`text-xs font-bold ${trendColor} flex items-center mb-1`}>
                      {trendIcon} {diff}
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
