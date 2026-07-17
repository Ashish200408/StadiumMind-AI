import React, { useMemo } from 'react';
import { useEmergencyStore } from '../store/emergency-store';

export const EmergencyMapSummary: React.FC = () => {
  const incidents = useEmergencyStore((state) => state.incidents);
  const getPriorityQueue = useEmergencyStore((state) => state.getPriorityQueue);
  const priorityQueue = useMemo(() => getPriorityQueue(), [incidents, getPriorityQueue]);

  return (
    <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg min-h-[300px] flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Spatial Emergency Summary
      </h2>

      <div className="flex-grow flex items-center justify-center bg-gray-200 dark:bg-gray-700/50 rounded-lg relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #000 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        ></div>

        {priorityQueue.length === 0 ? (
          <p className="text-gray-500 z-10">No spatial hazards detected.</p>
        ) : (
          <div className="z-10 text-center w-full p-4">
            <p className="text-sm font-bold mb-4 text-gray-700 dark:text-gray-300">
              Hazard Zones Identified
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {priorityQueue.map((inc) => (
                <span
                  key={inc.id}
                  className={`px-3 py-1 text-xs rounded-full shadow-sm text-white font-medium ${
                    inc.severity === 'Critical'
                      ? 'bg-red-500'
                      : inc.severity === 'High'
                        ? 'bg-orange-500'
                        : inc.severity === 'Medium'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                  }`}
                >
                  {inc.location}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-6">
              (Map integration disabled per requirements)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
