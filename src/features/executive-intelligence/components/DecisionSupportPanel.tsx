import React, { useEffect } from 'react';
import { useExecutiveIntelligence } from '../hooks/useExecutiveIntelligence';

interface DecisionSupportPanelProps {
  onRecommendationSelect?: (recommendation: string) => void;
}

export const DecisionSupportPanel: React.FC<DecisionSupportPanelProps> = ({
  onRecommendationSelect,
}) => {
  const { decisionSupportData, isLoadingDecisionData, loadDecisionSupport, globalRecommendations } =
    useExecutiveIntelligence();

  useEffect(() => {
    // Only load if not loaded yet, this prevents duplicate Gemini requests on re-renders
    if (!decisionSupportData && !isLoadingDecisionData && globalRecommendations.length > 0) {
      loadDecisionSupport();
    }
  }, [decisionSupportData, isLoadingDecisionData, globalRecommendations, loadDecisionSupport]);

  if (isLoadingDecisionData || !decisionSupportData) {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400">Analyzing unified data for decision support...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-700/50 bg-slate-800/80">
        <h3 className="font-semibold text-slate-200">Decision Support</h3>
      </div>

      <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-6">
        {/* Top Recommendations */}
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <span className="text-blue-400">★</span> Top 5 Recommended Actions
          </h4>
          <div className="flex flex-col gap-2">
            {decisionSupportData.topRecommendedActions.slice(0, 5).map((action) => (
              <div
                key={action.id}
                onClick={() => onRecommendationSelect?.(action.title)}
                className="p-3 bg-slate-900/50 border border-slate-700/50 rounded-lg hover:border-blue-500/50 cursor-pointer transition-colors group"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-slate-200 group-hover:text-blue-400 transition-colors">
                    {action.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${
                      action.priority === 'Critical'
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : action.priority === 'High'
                          ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {action.priority}
                  </span>
                </div>
                <div className="flex gap-3 text-xs text-slate-500">
                  <span>{action.department}</span>
                  <span>Impact: {action.estimatedImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Risks */}
        <div>
          <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <span className="text-amber-400">⚠</span> Operational Risks
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {decisionSupportData.operationalRisks.map((risk) => (
              <div
                key={risk.id}
                className="p-2.5 bg-amber-500/5 border border-amber-500/20 rounded-lg flex flex-col gap-1"
              >
                <span className="text-sm text-slate-300">{risk.description}</span>
                <div className="flex gap-2 text-xs">
                  <span className="text-slate-400">
                    Likelihood:{' '}
                    <span className="text-amber-400 font-medium">{risk.likelihood}</span>
                  </span>
                  <span className="text-slate-400">
                    Impact: <span className="text-amber-400 font-medium">{risk.impact}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Constraints */}
        {decisionSupportData.resourceConstraints.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <span className="text-purple-400">◎</span> Resource Constraints
            </h4>
            <div className="flex flex-col gap-2">
              {decisionSupportData.resourceConstraints.map((constraint) => (
                <div
                  key={constraint.id}
                  className="p-3 bg-slate-900/50 border border-slate-700/50 rounded-lg flex justify-between items-center"
                >
                  <span className="text-sm text-slate-300">{constraint.resource}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${constraint.status === 'Critical' ? 'bg-red-500' : 'bg-amber-500'}`}
                        style={{
                          width: `${Math.min(100, (constraint.currentLevel / constraint.threshold) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {constraint.currentLevel} / {constraint.threshold}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
