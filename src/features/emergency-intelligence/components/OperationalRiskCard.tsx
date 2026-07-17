import React, { useMemo } from 'react';
import { useEmergencyStore } from '../store/emergency-store';

export const OperationalRiskCard: React.FC = () => {
  const metrics = useEmergencyStore((state) => state.metrics);
  const incidents = useEmergencyStore((state) => state.incidents);
  const getPriorityQueue = useEmergencyStore((state) => state.getPriorityQueue);
  const priorityQueue = useMemo(() => getPriorityQueue(), [incidents, getPriorityQueue]);

  const riskScore = metrics.operationalRiskScore;
  const activeIncident = priorityQueue[0];

  return (
    <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          Operational Risk Score
        </h2>
        <p className="text-sm text-gray-500 mb-6">Aggregated risk across all active incidents</p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`${riskScore > 75 ? 'text-red-500' : riskScore > 50 ? 'text-orange-500' : riskScore > 25 ? 'text-yellow-500' : 'text-green-500'}`}
              strokeDasharray={`${riskScore}, 100`}
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{riskScore}</span>
          </div>
        </div>
      </div>

      {activeIncident && activeIncident.operationalImpact && (
        <div className="mt-6 space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Highest Impact Areas (Top Incident)</h3>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-300">Crowd</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {activeIncident.operationalImpact.crowdOperations}%
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-300">Mobility</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {activeIncident.operationalImpact.mobility}%
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-300">Accessibility</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {activeIncident.operationalImpact.accessibility}%
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-300">Sustainability</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {activeIncident.operationalImpact.sustainability}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
