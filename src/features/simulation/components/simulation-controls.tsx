import React from 'react';
import { useSimulation } from '../hooks/use-simulation';
import { Play, Pause, RotateCcw, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SimulationControls() {
  const { isRunning, startSimulation, pauseSimulation, resetSimulation, speed, setSpeed } =
    useSimulation();

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card p-2 shadow-sm">
      <div className="flex items-center gap-1 border-r pr-2">
        {!isRunning ? (
          <Button variant="ghost" size="icon" onClick={startSimulation} title="Start / Resume">
            <Play className="h-4 w-4 text-green-500" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={pauseSimulation} title="Pause">
            <Pause className="h-4 w-4 text-amber-500" />
          </Button>
        )}

        <Button variant="ghost" size="icon" onClick={resetSimulation} title="Reset">
          <RotateCcw className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <div className="flex items-center gap-1 pl-1">
        <Button
          variant={speed === 1 ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setSpeed(1)}
          className="text-xs h-8 px-2"
        >
          1x
        </Button>
        <Button
          variant={speed === 5 ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setSpeed(5)}
          className="text-xs h-8 px-2"
        >
          5x
        </Button>
        <Button
          variant={speed === 10 ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setSpeed(10)}
          className="text-xs h-8 px-2"
        >
          <FastForward className="h-3 w-3 mr-1" />
          10x
        </Button>
      </div>

      <div className="ml-auto text-xs font-mono text-muted-foreground px-2">
        {isRunning ? (
          <span className="text-green-500 flex items-center gap-1">
            <span className="animate-pulse h-1.5 w-1.5 bg-green-500 rounded-full"></span> Live
          </span>
        ) : (
          'Paused'
        )}
      </div>
    </div>
  );
}
