import React from 'react';
import { useEmergencyStore } from '../store/emergency-store';

export const ResourceAvailabilityPanel: React.FC = () => {
  const teamStatuses = useEmergencyStore((state) => state.teamStatuses);

  const totalAvailable = teamStatuses.reduce((acc, team) => acc + team.availability, 0);
  const totalCapacity = 39; // initial total
  const utilization = ((totalCapacity - totalAvailable) / totalCapacity) * 100;

  return (
    <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Resource Utilization
      </h2>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600 dark:text-gray-300">Overall Deployment</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {Math.round(utilization)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${utilization > 80 ? 'bg-red-500' : utilization > 50 ? 'bg-orange-500' : 'bg-blue-500'}`}
            style={{ width: `${utilization}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-3">
        {teamStatuses.map((team) => {
          const maxCapacity =
            team.type === 'Medical'
              ? 5
              : team.type === 'Security'
                ? 10
                : team.type === 'Maintenance'
                  ? 4
                  : 20;
          const used = maxCapacity - team.availability;
          const pct = (used / maxCapacity) * 100;
          return (
            <div key={team.id}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">{team.type}</span>
                <span className="text-gray-500">
                  {used} / {maxCapacity} Deployed
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  className="bg-indigo-500 h-1.5 rounded-full"
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
