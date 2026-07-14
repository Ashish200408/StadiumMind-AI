import React from 'react';
import { useEmergencyStore } from '../store/emergency-store';

export const ResponseStatusCards: React.FC = () => {
  const teamStatuses = useEmergencyStore((state) => state.teamStatuses);

  return (
    <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Response Team Status
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {teamStatuses.map((team) => (
          <div key={team.id} className="bg-white/5 border border-white/10 p-4 rounded-lg">
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">{team.type}</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Available:</span>
                <span className="font-medium text-gray-900 dark:text-gray-200">
                  {team.availability} units
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Assignment:</span>
                <span className="font-medium text-gray-900 dark:text-gray-200 truncate ml-2">
                  {team.currentAssignment !== 'None'
                    ? team.currentAssignment.substring(0, 8) + '...'
                    : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ETA:</span>
                <span className="font-medium text-gray-900 dark:text-gray-200">
                  {team.estimatedResponseTime} min
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
