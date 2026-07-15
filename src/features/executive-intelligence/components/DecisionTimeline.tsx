import React from 'react';
import { useExecutiveIntelligence } from '../hooks/useExecutiveIntelligence';

export const DecisionTimeline: React.FC = () => {
  const { eventTimeline } = useExecutiveIntelligence();

  if (!eventTimeline || eventTimeline.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6 text-center text-slate-500 min-h-[300px] flex items-center justify-center">
        No operational events recorded yet.
      </div>
    );
  }

  // Sort timeline newest first
  const sortedTimeline = [...eventTimeline].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-700/50 bg-slate-800/80">
        <h3 className="font-semibold text-slate-200">Decision & Event Timeline</h3>
      </div>

      <div className="p-6 flex-1 overflow-y-auto relative">
        <div className="absolute left-8 top-6 bottom-6 w-px bg-slate-700/50 z-0"></div>

        <div className="flex flex-col gap-6 relative z-10">
          {sortedTimeline.map((event) => {
            let icon = '•';
            let colorClass = 'bg-slate-800 border-slate-600 text-slate-400';

            if (event.severity === 'Critical') {
              icon = '🚨';
              colorClass = 'bg-red-500/20 border-red-500/50 text-red-400';
            } else if (event.severity === 'Warning') {
              icon = '⚠';
              colorClass = 'bg-amber-500/20 border-amber-500/50 text-amber-400';
            } else if (
              event.eventType.includes('AI') ||
              event.eventType.includes('RECOMMENDATION')
            ) {
              icon = '✨';
              colorClass = 'bg-blue-500/20 border-blue-500/50 text-blue-400';
            } else if (event.eventType.includes('ACTION')) {
              icon = '✓';
              colorClass = 'bg-green-500/20 border-green-500/50 text-green-400';
            }

            return (
              <div key={event.id} className="flex gap-4 items-start">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] shadow-sm z-10 mt-1 shrink-0 ${colorClass}`}
                >
                  {icon}
                </div>
                <div className="flex-1 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 hover:bg-slate-800/80 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-slate-200">{event.description}</span>
                    <span className="text-xs text-slate-500 shrink-0 ml-2">
                      {new Date(event.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-400">
                      {event.moduleSource}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-400">
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
