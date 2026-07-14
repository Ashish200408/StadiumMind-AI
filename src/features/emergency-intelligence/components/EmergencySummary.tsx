import React from 'react';
import { useEmergencyStore } from '../store/emergency-store';

export const EmergencySummary: React.FC = () => {
  const kpis = useEmergencyStore((state) => state.kpis);

  return (
    <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Emergency KPIs</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Active</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            {kpis.totalActiveIncidents}
          </p>
        </div>
        <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
          <p className="text-sm text-gray-500 dark:text-gray-400">Critical</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {kpis.criticalIncidents}
          </p>
        </div>
        <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg Response</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {kpis.averageResponseTime}m
          </p>
        </div>
        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
          <p className="text-sm text-gray-500 dark:text-gray-400">Resources</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {kpis.resourcesAvailable}
          </p>
        </div>
        <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <p className="text-sm text-gray-500 dark:text-gray-400">Readiness Score</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {kpis.operationalReadinessScore}%
          </p>
        </div>
      </div>
    </div>
  );
};
