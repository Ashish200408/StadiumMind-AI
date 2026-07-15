import React, { useEffect, useState } from 'react';
import { useIntelligenceCoreStore } from '@/features/intelligence-core/store/intelligence-core-store';
import { useSimulation } from '@/features/simulation/hooks/use-simulation';

export const HealthDashboard: React.FC = () => {
  const { unifiedData } = useIntelligenceCoreStore();
  const { isRunning } = useSimulation();

  const [healthStatus, setHealthStatus] = useState({
    buildVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE || 'development',
    firebase: 'checking',
    gemini: 'checking',
    simulation: 'checking',
    intelligence: 'checking',
    lastSync: new Date().toISOString(),
  });

  useEffect(() => {
    // Check Firebase
    const hasFirebase =
      import.meta.env.VITE_FIREBASE_API_KEY &&
      !import.meta.env.VITE_FIREBASE_API_KEY.startsWith('mock-');

    // Check Gemini
    const hasGemini =
      import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY.length > 10;

    setHealthStatus((prev) => ({
      ...prev,
      firebase: hasFirebase ? 'connected' : 'missing config',
      gemini: hasGemini ? 'configured' : 'missing key',
      simulation: isRunning ? 'running' : 'stopped',
      intelligence: Object.keys(unifiedData.modules).length > 0 ? 'active' : 'idle',
      lastSync: new Date().toISOString(),
    }));
  }, [isRunning, unifiedData.modules]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'configured':
      case 'running':
      case 'active':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'missing config':
      case 'missing key':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'stopped':
      case 'idle':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Application Health</h1>
          <p className="text-slate-400">Diagnostic overview of StadiumMind AI systems</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Build Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Version</span>
                <span className="text-slate-200 font-mono">{healthStatus.buildVersion}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Environment</span>
                <span className="text-slate-200 uppercase text-sm tracking-wider">
                  {healthStatus.environment}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Last Sync</span>
                <span className="text-slate-200 font-mono text-sm">
                  {new Date(healthStatus.lastSync).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">External Services</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Firebase</span>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(healthStatus.firebase)} uppercase`}
                >
                  {healthStatus.firebase}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Gemini API</span>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(healthStatus.gemini)} uppercase`}
                >
                  {healthStatus.gemini}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:col-span-2">
            <h2 className="text-lg font-semibold text-white mb-4">Core Systems</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex justify-between items-center bg-slate-950 p-4 rounded-lg border border-slate-800">
                <span className="text-slate-400">Simulation Engine</span>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(healthStatus.simulation)} uppercase`}
                >
                  {healthStatus.simulation}
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-950 p-4 rounded-lg border border-slate-800">
                <span className="text-slate-400">Unified Intelligence</span>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-medium border ${getStatusColor(healthStatus.intelligence)} uppercase`}
                >
                  {healthStatus.intelligence}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
