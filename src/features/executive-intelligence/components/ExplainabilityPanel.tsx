import React from 'react';
import { AIExplanation } from '../types';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { Bot, Sparkles, Network, Link as LinkIcon, Database, Target } from 'lucide-react';

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
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center min-h-[300px] shadow-lg">
        <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-6" />
        <p className="text-slate-400 font-medium tracking-wide">
          Generating explainability insights...
        </p>
      </div>
    );
  }

  if (!explanation) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center min-h-[300px] text-center shadow-lg">
        <Bot className="h-16 w-16 text-cyan-500/30 mb-6" />
        <h3 className="text-xl font-black text-white tracking-tight">Explainable AI</h3>
        <p className="text-sm text-slate-400 max-w-sm mt-3 leading-relaxed">
          Select a recommendation or action to view the AI's reasoning, supporting data, and
          confidence metrics.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden flex flex-col h-full shadow-lg">
      <div className="p-5 border-b border-white/10 bg-black/20 flex justify-between items-center">
        <h3 className="font-bold text-white tracking-wide flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-cyan-400" /> AI Explainability
        </h3>
      </div>

      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-6">
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
            <Target className="h-3 w-3" /> Target Recommendation
          </span>
          <p className="text-white mt-1 font-medium bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner leading-relaxed">
            {explanation.recommendation}
          </p>
        </div>

        <ConfidenceIndicator score={explanation.confidence} />

        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
            <Network className="h-3 w-3" /> AI Reasoning
          </span>
          <p className="text-sm text-slate-300 mt-1 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
            {explanation.reasoning}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
            <Database className="h-3 w-3" /> Supporting Operational Data
          </span>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {Object.entries(explanation.supportingData).map(([key, value]) => (
              <div
                key={key}
                className="bg-white/5 p-3 rounded-xl border border-white/10 flex flex-col gap-1 justify-center transition-colors hover:bg-white/10"
              >
                <span className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-wider">
                  {key}
                </span>
                <span className="text-sm font-black text-white">{value}</span>
              </div>
            ))}
            {Object.keys(explanation.supportingData).length === 0 && (
              <div className="col-span-2 text-xs font-medium text-slate-500 p-3 bg-black/20 rounded-xl border border-white/5">
                No specific quantitative data cited.
              </div>
            )}
          </div>
        </div>

        {(explanation.relatedAlertIds.length > 0 ||
          explanation.relatedTimelineEventIds.length > 0) && (
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
              <LinkIcon className="h-3 w-3" /> Context References
            </span>
            <div className="flex flex-wrap gap-2 mt-2">
              {explanation.relatedAlertIds.map((id) => (
                <span
                  key={id}
                  className="px-3 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                >
                  Alert: {id}
                </span>
              ))}
              {explanation.relatedTimelineEventIds.map((id) => (
                <span
                  key={id}
                  className="px-3 py-1 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]"
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
