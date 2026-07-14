import React from 'react';
import { useEmergencyStore } from '../store/emergency-store';

export const ResponseRecommendationPanel: React.FC = () => {
  const priorityQueue = useEmergencyStore((state) => state.getPriorityQueue());

  const activeIncident = priorityQueue[0];

  return (
    <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Deterministic Response Recommendations
      </h2>

      {!activeIncident ? (
        <div className="text-center text-gray-500 py-8">
          No active incidents requiring response.
        </div>
      ) : (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Target Incident: {activeIncident.type}
            </h3>
            <p className="text-sm text-gray-500">
              Location: {activeIncident.location} | Severity: {activeIncident.severity}
            </p>
          </div>

          <ul className="space-y-2">
            {activeIncident.recommendedActions.map((action, idx) => (
              <li
                key={idx}
                className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                </div>
                <span className="text-gray-800 dark:text-gray-200 font-medium">{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
