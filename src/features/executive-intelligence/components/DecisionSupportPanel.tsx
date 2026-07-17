import React, { useEffect } from 'react';
import { useExecutiveIntelligence } from '../hooks/useExecutiveIntelligence';
import { Target, Star, AlertTriangle, Database } from 'lucide-react';

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
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center min-h-[300px] shadow-lg">
        <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-6" />
        <p className="text-slate-400 font-medium">Analyzing unified data for decision support...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden flex flex-col h-full shadow-lg">
      <div className="p-5 border-b border-white/10 bg-black/20 flex items-center gap-2">
        <Target className="h-5 w-5 text-cyan-400" />
        <h3 className="font-bold text-white tracking-wide">Decision Support</h3>
      </div>

      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-8">
        {/* Top Recommendations */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <Star className="h-4 w-4 text-cyan-400" /> Top Recommended Actions
          </h4>
          <div className="flex flex-col gap-3">
            {decisionSupportData.topRecommendedActions.slice(0, 5).map((action) => (
              <div
                key={action.id}
                onClick={() => onRecommendationSelect?.(action.title)}
                className="p-4 bg-black/40 border border-white/5 rounded-xl hover:border-cyan-500/50 hover:bg-white/5 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">
                    {action.title}
                  </span>
                  <span
                    className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-black tracking-wider border ${
                      action.priority === 'Critical'
                        ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                        : action.priority === 'High'
                          ? 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]'
                          : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                    }`}
                  >
                    {action.priority}
                  </span>
                </div>
                <div className="flex gap-3 text-[10px] font-bold tracking-wider uppercase text-slate-500">
                  <span>{action.department}</span>
                  <span>Impact: {action.estimatedImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Risks */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" /> Operational Risks
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {decisionSupportData.operationalRisks.map((risk) => (
              <div
                key={risk.id}
                className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex flex-col gap-2 hover:bg-amber-500/10 transition-colors"
              >
                <span className="text-sm font-medium text-slate-300">{risk.description}</span>
                <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
                  <span className="text-slate-500">
                    Likelihood: <span className="text-amber-400">{risk.likelihood}</span>
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
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Database className="h-4 w-4 text-purple-400" /> Resource Constraints
            </h4>
            <div className="flex flex-col gap-3">
              {decisionSupportData.resourceConstraints.map((constraint) => (
                <div
                  key={constraint.id}
                  className="p-4 bg-black/40 border border-white/5 rounded-xl flex justify-between items-center"
                >
                  <span className="text-sm font-medium text-slate-300">{constraint.resource}</span>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden shadow-inner border border-white/5">
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
