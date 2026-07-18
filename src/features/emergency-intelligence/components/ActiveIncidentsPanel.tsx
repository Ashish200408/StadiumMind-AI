import React, { useMemo } from 'react';
import { useEmergencyStore } from '../store/emergency-store';
import { AlertTriangle, Clock, MapPin, Activity, ShieldAlert } from 'lucide-react';

export const ActiveIncidentsPanel: React.FC = () => {
  const getPriorityQueue = useEmergencyStore((state) => state.getPriorityQueue);
  const priorityQueue = useMemo(() => getPriorityQueue(), [getPriorityQueue]);

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="w-10 h-10 rounded-full bg-red-950 border border-red-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]">
          <AlertTriangle className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white tracking-wide">Active Incidents</h2>
          <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
            Priority Queue
          </p>
        </div>
      </div>

      {priorityQueue.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-black/20 rounded-2xl border border-white/5">
          <ShieldAlert className="w-12 h-12 mb-3 opacity-20" />
          <span className="font-medium text-cyan-400">
            Launch Demo Mode above to simulate a live FIFA World Cup stadium environment.
          </span>
        </div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 flex-1">
          {priorityQueue.map((incident) => {
            const isCritical = incident.severity === 'Critical';
            const isHigh = incident.severity === 'High';
            const isMedium = incident.severity === 'Medium';

            return (
              <div
                key={incident.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCritical
                    ? 'bg-red-500/10 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-[pulse_2s_infinite]'
                    : isHigh
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : isMedium
                        ? 'bg-yellow-500/10 border-yellow-500/30'
                        : 'bg-blue-500/10 border-blue-500/30'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-start">
                    <div
                      className={`mt-1 p-2 rounded-lg ${isCritical ? 'bg-red-500/20 text-red-400' : isHigh ? 'bg-orange-500/20 text-orange-400' : isMedium ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3
                        className={`font-black text-lg tracking-wide ${isCritical ? 'text-red-400' : isHigh ? 'text-orange-400' : 'text-white'}`}
                      >
                        {incident.type} Emergency
                      </h3>
                      <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3 h-3 text-slate-500" /> {incident.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-3 py-1 text-[10px] rounded-md font-black uppercase tracking-wider border ${isCritical ? 'bg-red-500/20 border-red-500/30 text-red-300' : 'bg-black/40 border-white/10 text-slate-300'}`}
                    >
                      {incident.escalationLevel}
                    </span>
                    <span className="px-3 py-1 text-[10px] rounded-md font-black uppercase tracking-wider bg-black/40 border border-white/10 text-slate-300 flex items-center gap-1">
                      <Activity className="w-3 h-3" /> {incident.lifecycleState}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-white/10 flex justify-between items-center mt-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />{' '}
                    {new Date(incident.timestamp).toLocaleTimeString()}
                  </p>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${isCritical ? 'text-red-400' : isHigh ? 'text-orange-400' : isMedium ? 'text-yellow-400' : 'text-blue-400'}`}
                  >
                    {incident.severity} Priority
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
