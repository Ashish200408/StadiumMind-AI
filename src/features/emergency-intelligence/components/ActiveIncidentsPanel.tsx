import React, { useMemo } from 'react';
import { useEmergencyStore } from '../store/emergency-store';

export const ActiveIncidentsPanel: React.FC = () => {
  const incidents = useEmergencyStore((state) => state.incidents);
  const getPriorityQueue = useEmergencyStore((state) => state.getPriorityQueue);
  const priorityQueue = useMemo(() => getPriorityQueue(), [incidents, getPriorityQueue]);

  return (
    <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Active Incidents (Priority Queue)
      </h2>

      {priorityQueue.length === 0 ? (
        <div className="text-center p-8 text-gray-500">No active incidents.</div>
      ) : (
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {priorityQueue.map((incident) => (
            <div
              key={incident.id}
              className={`p-4 rounded-lg border ${
                incident.severity === 'Critical'
                  ? 'bg-red-500/10 border-red-500/30'
                  : incident.severity === 'High'
                    ? 'bg-orange-500/10 border-orange-500/30'
                    : incident.severity === 'Medium'
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-blue-500/10 border-blue-500/30'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {incident.type} Emergency
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Location: {incident.location}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className="px-2 py-1 text-xs rounded-full bg-black/10 dark:bg-white/10 font-medium">
                    {incident.escalationLevel}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-black/10 dark:bg-white/10 font-medium">
                    {incident.lifecycleState}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Time: {new Date(incident.timestamp).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
