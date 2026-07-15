import React from 'react';
import { IncidentItem, ActionItem } from '../types';

interface ActionPriorityListProps {
  incidents: IncidentItem[];
  actions: ActionItem[];
}

export const ActionPriorityList: React.FC<ActionPriorityListProps> = ({ incidents, actions }) => {
  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/80">
        <h3 className="font-semibold text-slate-200">Priority Action List</h3>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
          {incidents.length + actions.length} Items Require Attention
        </span>
      </div>

      <div className="divide-y divide-slate-700/50 max-h-[400px] overflow-y-auto">
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
          <div key={action.id} className="p-4 hover:bg-slate-800/80 transition-colors group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-2 w-2 rounded-full ${action.priority === 'Critical' ? 'bg-red-500' : 'bg-orange-500'}`}
                />
                <h4 className="text-sm font-medium text-slate-200">{action.title}</h4>
              </div>
              <button className="text-xs px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors opacity-0 group-hover:opacity-100">
                Execute
              </button>
            </div>
            <div className="flex gap-2 text-xs text-slate-400">
              <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                {action.department}
              </span>
              <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
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
