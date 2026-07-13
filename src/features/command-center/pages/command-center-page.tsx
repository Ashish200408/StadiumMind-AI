import React from 'react';
import { HealthScoreCard } from '../components/health-score-card';
import { AlertFeed } from '../components/alert-feed';
import { TimelinePanel } from '../components/timeline-panel';
import { OperationalGrid } from '../components/operational-grid';
import { LiveStatusCard } from '../components/live-status-card';
import { useSimulationStore } from '../../simulation/store/simulation-store';
import { SimulationControls } from '../../simulation/components/simulation-controls';

export function CommandCenterPage() {
  const gates = useSimulationStore((state) => state.gates);
  const crowd = useSimulationStore((state) => state.crowd);

  // Get worst performing gate
  const worstGate = Object.values(gates).reduce((worst, current) => {
    return current.estimatedWaitTime > worst.estimatedWaitTime ? current : worst;
  }, Object.values(gates)[0]);

  // Get highest crowd density zone
  const denseZone = Object.values(crowd).reduce((dense, current) => {
    return current.density > dense.density ? current : dense;
  }, Object.values(crowd)[0]);

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Operations Command Center</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Live overview of stadium metrics powered by Simulation Engine.
          </p>
        </div>

        {/* Simulation Controls embedded for Phase 6 evaluation */}
        <div className="shrink-0">
          <SimulationControls />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Primary Metrics) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <OperationalGrid />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LiveStatusCard
              title="Critical Gate Queue"
              value={`${worstGate?.estimatedWaitTime || 0} min`}
              label={worstGate?.location.name}
              status={worstGate?.estimatedWaitTime > 15 ? 'warning' : 'active'}
              trend={{ value: 12, isPositive: false }}
            />
            <LiveStatusCard
              title="Highest Zone Density"
              value={`${denseZone?.density || 0}%`}
              label={denseZone?.location.name}
              status={
                denseZone?.density > 85 ? 'error' : denseZone?.density > 75 ? 'warning' : 'active'
              }
              trend={{ value: 5, isPositive: false }}
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <TimelinePanel />
          </div>
        </div>

        {/* Right Column (Health & Alerts) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <HealthScoreCard />
          <div className="flex-1 min-h-[400px]">
            <AlertFeed />
          </div>
        </div>
      </div>
    </div>
  );
}
