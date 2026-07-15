import React from 'react';
import { GlobalAlert } from '../../intelligence-core/types';

interface ExecutiveNotificationsProps {
  alerts: GlobalAlert[];
}

export const ExecutiveNotifications: React.FC<ExecutiveNotificationsProps> = ({ alerts }) => {
  const criticalAlerts = alerts.filter((a) => a.severity === 'Critical');
  const recentAlerts = alerts.slice(0, 5); // Show latest 5

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-700/50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-200 flex items-center gap-2">
          <span className="text-xl">🔔</span> Executive Notifications
        </h3>
        {criticalAlerts.length > 0 && (
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white animate-pulse">
            {criticalAlerts.length} Critical
          </span>
        )}
      </div>
      <div className="p-2 overflow-y-auto flex-1">
        {recentAlerts.length === 0 ? (
          <div className="text-center p-4 text-slate-500 text-sm">No new notifications</div>
        ) : (
          <div className="flex flex-col gap-2">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border flex gap-3 items-start ${
                  alert.severity === 'Critical'
                    ? 'bg-red-500/10 border-red-500/30'
                    : alert.severity === 'High'
                      ? 'bg-orange-500/10 border-orange-500/30'
                      : 'bg-slate-800 border-slate-700'
                }`}
              >
                <div
                  className={`mt-0.5 w-2 h-2 rounded-full ${
                    alert.severity === 'Critical'
                      ? 'bg-red-500'
                      : alert.severity === 'High'
                        ? 'bg-orange-500'
                        : 'bg-blue-500'
                  }`}
                />
                <div>
                  <p className="text-sm text-slate-200">{alert.message}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-slate-400">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-xs text-slate-500 capitalize">{alert.moduleSource}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
