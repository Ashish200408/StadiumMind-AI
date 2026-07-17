import React from 'react';
import { useSimulationStore } from '../../simulation/store/simulation-store';
import { Incident } from '../../simulation/types';
import { PlayCircle, Users, AlertOctagon, Bus, Leaf, Accessibility } from 'lucide-react';
import { useState } from 'react';

export const DemoScenarioSelector: React.FC = () => {
  const { updateIncidents, updateEnvironment, environment, incidents } = useSimulationStore();
  const [activeScenario, setActiveScenario] = useState<string>('Normal Match');

  const handleScenarioChange = (scenario: string) => {
    setActiveScenario(scenario);
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
    {
      name: 'Normal Match',
      icon: PlayCircle,
      color: 'text-green-400',
      border: 'hover:border-green-400/50',
      active: 'bg-green-500/20 border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.4)]',
    },
    {
      name: 'High Crowd',
      icon: Users,
      color: 'text-amber-400',
      border: 'hover:border-amber-400/50',
      active: 'bg-amber-500/20 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.4)]',
    },
    {
      name: 'Emergency',
      icon: AlertOctagon,
      color: 'text-red-400',
      border: 'hover:border-red-400/50',
      active: 'bg-red-500/20 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]',
    },
    {
      name: 'Transport Failure',
      icon: Bus,
      color: 'text-purple-400',
      border: 'hover:border-purple-400/50',
      active: 'bg-purple-500/20 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]',
    },
    {
      name: 'Sustainability Event',
      icon: Leaf,
      color: 'text-emerald-400',
      border: 'hover:border-emerald-400/50',
      active: 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)]',
    },
    {
      name: 'Accessibility Incident',
      icon: Accessibility,
      color: 'text-blue-400',
      border: 'hover:border-blue-400/50',
      active: 'bg-blue-500/20 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]',
    },
  ];

  return (
    <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-4 shadow-inner">
      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
        Simulate Event
      </h3>
      <div className="flex flex-wrap gap-2">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          const isActive = activeScenario === scenario.name;
          return (
            <button
              key={scenario.name}
              onClick={() => handleScenarioChange(scenario.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-300 ${
                isActive
                  ? `${scenario.active} text-white`
                  : `bg-slate-900 border-white/5 ${scenario.border} text-slate-300 hover:text-white hover:bg-slate-800`
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-white' : scenario.color}`} />
              {scenario.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
