import React from 'react';
import { useEmergencyStore } from '../store/emergency-store';

export const IncidentDependencyVisualizer: React.FC = () => {
  const correlatedIncidents = useEmergencyStore((state) => state.correlatedIncidents);

  return (
    <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Multi-Incident Correlation Engine
      </h2>

      {correlatedIncidents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No correlated incidents detected.</div>
      ) : (
        <div className="space-y-4">
          {correlatedIncidents.map((corr) => (
            <div
              key={corr.id}
              className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg"
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded">
                  Correlated
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(corr.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-900 dark:text-gray-100 font-medium mb-1">
                Root: Incident {corr.primaryIncidentId.substring(0, 8)}...
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                "{corr.correlationReason}"
              </p>
              <div className="mt-2 text-xs text-gray-500">
                Combined Risk:{' '}
                <span className="font-bold text-red-500">{corr.combinedSeverity}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
