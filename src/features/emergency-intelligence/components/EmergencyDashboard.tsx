import React from 'react';
import { ShieldAlert } from 'lucide-react';
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
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="mb-10 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-950 border border-red-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)]">
          <ShieldAlert className="w-7 h-7 text-red-400" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Emergency Response Intelligence
          </h1>
          <p className="text-slate-400 mt-1 font-medium tracking-wide">
            Continuous monitoring, deterministic threat evaluation, and response orchestration.
          </p>
        </div>
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
