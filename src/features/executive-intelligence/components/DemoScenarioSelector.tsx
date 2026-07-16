import React from 'react';
import { useSimulationStore } from '../../simulation/store/simulation-store';
import { Incident } from '../../simulation/types';

export const DemoScenarioSelector: React.FC = () => {
  const { updateIncidents, updateEnvironment, environment, incidents } = useSimulationStore();

  const handleScenarioChange = (scenario: string) => {
    switch (scenario) {
      case 'Normal Match':
        updateIncidents({});
        break;
      case 'High Crowd':
        // Inject a simulated high crowd incident
        updateIncidents({
          ...incidents,
          'sim-crowd-1': {
            id: 'sim-crowd-1',
            type: 'incident',
            category: 'security',
            description: 'Crowd crush risk',
            severity: 'critical',
            status: 'active',
            timestamp: new Date().toISOString(),
            confidence: 0.9,
            location: { lat: 0, lng: 0, name: 'zone-north-1' },
          } as Incident,
        });
        break;
      case 'Emergency':
        updateIncidents({
          ...incidents,
          'sim-emerg-1': {
            id: 'sim-emerg-1',
            type: 'incident',
            category: 'facility',
            description: 'Fire alarm',
            severity: 'critical',
            status: 'active',
            timestamp: new Date().toISOString(),
            confidence: 0.95,
            location: { lat: 0, lng: 0, name: 'zone-south-2' },
          } as Incident,
        });
        break;
      case 'Transport Failure':
        updateIncidents({
          ...incidents,
          'sim-trans-1': {
            id: 'sim-trans-1',
            type: 'incident',
            category: 'facility',
            description: 'Transport delay',
            severity: 'high',
            status: 'active',
            timestamp: new Date().toISOString(),
            confidence: 0.85,
            location: { lat: 0, lng: 0, name: 'station-central' },
          } as Incident,
        });
        break;
      case 'Sustainability Event':
        if (environment) {
          updateEnvironment({
            ...environment,
            temperature: 42, // High heat event
          });
        }
        break;
      case 'Accessibility Incident':
        updateIncidents({
          ...incidents,
          'sim-acc-1': {
            id: 'sim-acc-1',
            type: 'incident',
            category: 'medical',
            description: 'Medical assistance required',
            severity: 'high',
            status: 'active',
            timestamp: new Date().toISOString(),
            confidence: 0.9,
            location: { lat: 0, lng: 0, name: 'gate-a' },
          } as Incident,
        });
        break;
      default:
        break;
    }
  };

  const scenarios = [
    'Normal Match',
    'High Crowd',
    'Emergency',
    'Transport Failure',
    'Sustainability Event',
    'Accessibility Incident',
  ];

  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
      <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        Demo Scenario Selector
      </h3>
      <div className="flex flex-wrap gap-2">
        {scenarios.map((scenario) => (
          <button
            key={scenario}
            onClick={() => handleScenarioChange(scenario)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 transition-colors text-slate-300"
          >
            {scenario}
          </button>
        ))}
      </div>
    </div>
  );
};
