import { useEffect } from 'react';
import { useSimulationStore } from '../store/simulation-store';
import { simulationEngine } from '../services/simulation-service';

export function useSimulationEngine() {
  const store = useSimulationStore();

  useEffect(() => {
    // If the store says it should be running, ensure the engine is started
    if (store.isRunning) {
      simulationEngine.start();
    } else {
      simulationEngine.stop();
    }

    return () => {
      // Cleanup on unmount if needed, though typically this is a global singleton
      // We don't stop it here if we want the simulation to run in the background
      // globally across page navigation.
    };
  }, [store.isRunning]);

  return {
    ...store,
    // Provide explicit control wrappers if needed
    startSimulation: store.start,
    pauseSimulation: store.pause,
    resumeSimulation: store.resume,
    resetSimulation: store.reset,
    setSpeed: store.setSpeed,
  };
}
