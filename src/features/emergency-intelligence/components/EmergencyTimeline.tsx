import React from 'react';
import { useEmergencyStore } from '../store/emergency-store';

export const EmergencyTimeline: React.FC = () => {
  const eventLogs = useEmergencyStore((state) => state.eventLogs);

  // Get last 20 events, reversed
  const recentEvents = [...eventLogs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20);

  return (
    <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Structured Event Log
      </h2>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
        {recentEvents.map((log) => (
          <div
            key={log.id}
            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}
            >
              <span className="text-xs font-bold">{log.severity.charAt(0)}</span>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 p-4 rounded border border-white/10 shadow">
              <div className="flex items-center justify-between space-x-2 mb-1">
                <div className="font-bold text-gray-900 dark:text-slate-100">{log.action}</div>
                <time className="font-caveat font-medium text-indigo-500">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </time>
              </div>
              <div className="text-sm text-gray-600 dark:text-slate-300">
                {log.details || log.stateTransition}
              </div>
              <div className="text-xs text-gray-400 mt-2">
                Module: {log.module} | Incident ID: {log.incidentId.substring(0, 8)}...
              </div>
            </div>
          </div>
        ))}
        {recentEvents.length === 0 && (
          <div className="text-center text-gray-500 py-4">No events logged.</div>
        )}
      </div>
    </div>
  );
};
