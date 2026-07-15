import React from 'react';

interface ConfidenceIndicatorProps {
  score: number;
  explanation?: string;
}

export const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ score, explanation }) => {
  let badgeColor = 'bg-green-500/20 text-green-400 border-green-500/50';
  let barColor = 'bg-green-500';

  if (score < 60) {
    badgeColor = 'bg-red-500/20 text-red-400 border-red-500/50';
    barColor = 'bg-red-500';
  } else if (score < 80) {
    badgeColor = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    barColor = 'bg-yellow-500';
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-300 font-medium">AI Confidence</span>
        <span className={`px-2 py-0.5 rounded-full text-xs border ${badgeColor}`}>{score}%</span>
      </div>

      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-1.5 rounded-full ${barColor} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>

      {explanation && <p className="text-xs text-slate-400 mt-1">{explanation}</p>}
    </div>
  );
};
