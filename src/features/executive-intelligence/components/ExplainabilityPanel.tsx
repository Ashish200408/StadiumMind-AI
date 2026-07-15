import React from 'react';
import { AIExplanation } from '../types';
import { ConfidenceIndicator } from './ConfidenceIndicator';

interface ExplainabilityPanelProps {
  explanation: AIExplanation | null;
  isLoading: boolean;
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({
  explanation,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400">Generating explainability insights...</p>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <span className="text-4xl mb-3 opacity-50">🤖</span>
        <h3 className="text-lg font-semibold text-slate-300">Explainable AI</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-2">
          Select a recommendation or action to view the AI's reasoning, supporting data, and
          confidence metrics.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-700/50 bg-slate-800/80 flex justify-between items-center">
        <h3 className="font-semibold text-slate-200 flex items-center gap-2">
          <span className="text-blue-400">✧</span> AI Explainability
        </h3>
      </div>

      <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-5">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Target Recommendation
          </span>
          <p className="text-slate-200 mt-1 font-medium bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
            {explanation.recommendation}
          </p>
        </div>

        <ConfidenceIndicator score={explanation.confidence} />

        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            AI Reasoning
          </span>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
            {explanation.reasoning}
          </p>
        </div>

        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Supporting Operational Data
          </span>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.entries(explanation.supportingData).map(([key, value]) => (
              <div
                key={key}
                className="bg-slate-900/50 p-2 rounded border border-slate-700/30 flex justify-between items-center"
              >
                <span className="text-xs text-slate-400 truncate mr-2">{key}</span>
                <span className="text-sm font-medium text-slate-200">{value}</span>
              </div>
            ))}
            {Object.keys(explanation.supportingData).length === 0 && (
              <div className="col-span-2 text-xs text-slate-500 italic p-2">
                No specific quantitative data cited.
              </div>
            )}
          </div>
        </div>

        {(explanation.relatedAlertIds.length > 0 ||
          explanation.relatedTimelineEventIds.length > 0) && (
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Context References
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {explanation.relatedAlertIds.map((id) => (
                <span
                  key={id}
                  className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-xs"
                >
                  Alert: {id}
                </span>
              ))}
              {explanation.relatedTimelineEventIds.map((id) => (
                <span
                  key={id}
                  className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-xs"
                >
                  Event: {id}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
