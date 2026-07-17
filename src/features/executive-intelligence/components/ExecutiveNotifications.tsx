import React from 'react';
import { GlobalAlert } from '../../intelligence-core/types';
import { BellRing, ShieldAlert, AlertCircle, Info } from 'lucide-react';

interface ExecutiveNotificationsProps {
  alerts: GlobalAlert[];
}

export const ExecutiveNotifications: React.FC<ExecutiveNotificationsProps> = ({ alerts }) => {
  const criticalAlerts = alerts.filter((a) => a.severity === 'Critical');
  const recentAlerts = alerts.slice(0, 5); // Show latest 5

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden flex flex-col h-full shadow-lg">
      <div className="p-5 border-b border-white/10 bg-black/20 flex justify-between items-center">
        <h3 className="font-bold text-white tracking-wide flex items-center gap-2">
          <BellRing className="h-5 w-5 text-cyan-400" />
          Executive Notifications
        </h3>
        {criticalAlerts.length > 0 && (
          <span className="px-3 py-1 rounded-full text-[10px] uppercase font-black bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            {criticalAlerts.length} Critical
          </span>
        )}
      </div>
      <div className="p-4 overflow-y-auto custom-scrollbar flex-1">
        {recentAlerts.length === 0 ? (
          <div className="text-center p-8 text-slate-500 text-sm font-medium">
            No new notifications
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentAlerts.map((alert) => {
              const Icon =
                alert.severity === 'Critical'
                  ? ShieldAlert
                  : alert.severity === 'High'
                    ? AlertCircle
                    : Info;
              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border flex gap-4 items-start transition-all hover:bg-white/5 ${
                    alert.severity === 'Critical'
                      ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                      : alert.severity === 'High'
                        ? 'bg-orange-500/10 border-orange-500/30'
                        : 'bg-black/40 border-white/5'
                  }`}
                >
                  <div
                    className={`mt-0.5 p-1.5 rounded-lg border flex-shrink-0 ${
                      alert.severity === 'Critical'
                        ? 'bg-red-500/20 text-red-400 border-red-500/50'
                        : alert.severity === 'High'
                          ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200 leading-snug">
                      {alert.message}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase bg-black/40 px-2 py-1 rounded border border-white/5">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase bg-black/40 px-2 py-1 rounded border border-white/5">
                        {alert.moduleSource}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
