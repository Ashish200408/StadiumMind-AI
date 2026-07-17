import React from 'react';
import { IncidentItem, ActionItem } from '../types';
import { AlertCircle, Zap } from 'lucide-react';
interface ActionPriorityListProps {
  incidents: IncidentItem[];
  actions: ActionItem[];
}

export const ActionPriorityList: React.FC<ActionPriorityListProps> = ({ incidents, actions }) => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-lg h-full flex flex-col">
      <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
        <h3 className="font-bold text-white tracking-wide flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-400" />
          Priority Action List
        </h3>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)] animate-pulse">
          {incidents.length + actions.length} Items Require Attention
        </span>
      </div>

      <div className="divide-y divide-white/5 flex-1 overflow-y-auto custom-scrollbar">
        {incidents.map((incident) => (
          <div key={incident.id} className="p-4 hover:bg-slate-800/80 transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                <h4 className="text-sm font-medium text-slate-200">{incident.title}</h4>
              </div>
              <span className="text-xs text-slate-400">
                {new Date(incident.time).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-900 text-slate-400 border border-slate-700">
                Incident
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                {incident.severity}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {incident.status}
              </span>
            </div>
          </div>
        ))}

        {actions.map((action) => (
          <div key={action.id} className="p-5 hover:bg-white/5 transition-colors group">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-1.5 rounded-full ${action.priority === 'Critical' ? 'bg-red-500/20 border border-red-500/50 text-red-400' : 'bg-orange-500/20 border border-orange-500/50 text-orange-400'}`}
                >
                  <Zap className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-bold text-white">{action.title}</h4>
              </div>
              <button className="text-xs font-bold px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all opacity-0 group-hover:opacity-100">
                Execute
              </button>
            </div>
            <div className="flex gap-2 text-[10px] font-bold tracking-wider uppercase text-slate-400 ml-10">
              <span className="bg-black/40 px-2 py-1 rounded border border-white/5">
                {action.department}
              </span>
              <span className="bg-black/40 px-2 py-1 rounded border border-white/5">
                Impact: {action.estimatedImpact}
              </span>
            </div>
          </div>
        ))}

        {incidents.length === 0 && actions.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-sm">
            No priority actions required at this time.
          </div>
        )}
      </div>
    </div>
  );
};
