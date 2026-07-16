import React from 'react';
import { EmergencySummary } from './EmergencySummary';
import { ActiveIncidentsPanel } from './ActiveIncidentsPanel';
import { EmergencyTimeline } from './EmergencyTimeline';
import { ResponseRecommendationPanel } from './ResponseRecommendationPanel';
import { OperationalRiskCard } from './OperationalRiskCard';
import { EmergencyMapSummary } from './EmergencyMapSummary';
import { ResponseStatusCards } from './ResponseStatusCards';
import { ResourceAvailabilityPanel } from './ResourceAvailabilityPanel';
import { IncidentDependencyVisualizer } from './IncidentDependencyVisualizer';

export const EmergencyDashboard: React.FC = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
          Emergency Response Intelligence
        </h1>
        <p className="text-gray-500 mt-2">
          Continuous monitoring, deterministic threat evaluation, and response orchestration.
        </p>
      </div>

      <EmergencySummary />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActiveIncidentsPanel />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponseRecommendationPanel />
            <OperationalRiskCard />
          </div>

          <ResponseStatusCards />
          <IncidentDependencyVisualizer />
        </div>

        <div className="space-y-6">
          <EmergencyTimeline />
          <ResourceAvailabilityPanel />
          <EmergencyMapSummary />
        </div>
      </div>
    </div>
  );
};
