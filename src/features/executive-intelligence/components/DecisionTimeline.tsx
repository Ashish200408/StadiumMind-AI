import React from 'react';
import { useExecutiveIntelligence } from '../hooks/useExecutiveIntelligence';
import { Clock, AlertTriangle, AlertCircle, Sparkles, CheckCircle2, History } from 'lucide-react';

export const DecisionTimeline: React.FC = () => {
  const { eventTimeline } = useExecutiveIntelligence();

  if (!eventTimeline || eventTimeline.length === 0) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 flex flex-col items-center justify-center min-h-[300px] shadow-lg">
        <History className="h-12 w-12 text-slate-500 mb-4 opacity-50" />
        <p className="text-slate-400 font-medium">No operational events recorded yet.</p>
      </div>
    );
  }

  // Sort timeline newest first
  const sortedTimeline = [...eventTimeline].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden flex flex-col h-full shadow-lg">
      <div className="p-5 border-b border-white/10 bg-black/20 flex items-center gap-2">
        <Clock className="h-5 w-5 text-cyan-400" />
        <h3 className="font-bold text-white tracking-wide">Decision & Event Timeline</h3>
      </div>

      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="absolute left-8 top-6 bottom-6 w-px bg-white/10 z-0"></div>

        <div className="flex flex-col gap-6 relative z-10">
          {sortedTimeline.map((event) => {
            let Icon = AlertCircle;
            let colorClass = 'bg-slate-800 border-slate-600 text-slate-400';

            if (event.severity === 'Critical') {
              Icon = AlertTriangle;
              colorClass =
                'bg-red-500/20 border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]';
            } else if (event.severity === 'Warning') {
              Icon = AlertCircle;
              colorClass =
                'bg-amber-500/20 border-amber-500/50 text-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]';
            } else if (
              event.eventType.includes('AI') ||
              event.eventType.includes('RECOMMENDATION')
            ) {
              Icon = Sparkles;
              colorClass =
                'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)]';
            } else if (event.eventType.includes('ACTION')) {
              Icon = CheckCircle2;
              colorClass =
                'bg-green-500/20 border-green-500/50 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]';
            }

            return (
              <div key={event.id} className="flex gap-4 items-start group">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 shrink-0 ${colorClass} transition-transform group-hover:scale-110`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 bg-black/40 p-4 rounded-xl border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-slate-200">{event.description}</span>
                    <span className="text-xs text-slate-500 font-mono shrink-0 ml-2 mt-0.5">
                      {new Date(event.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-black/50 text-slate-400 border border-white/5">
                      {event.moduleSource}
                    </span>
                    <span className="px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider bg-black/50 text-slate-400 border border-white/5">
                      {event.eventType}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
