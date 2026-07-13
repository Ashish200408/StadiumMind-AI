import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimulationStore } from '../../simulation/store/simulation-store';
import { Clock } from 'lucide-react';
import { cn } from '@/components/ui/button';

export function TimelinePanel({ className }: { className?: string }) {
  // Use a targeted selector to prevent unnecessary re-renders
  const timeline = useSimulationStore((state) => state.timeline);

  const getPhaseDisplay = (phase: string) => {
    switch (phase) {
      case 'pre_match':
        return 'Pre-Match';
      case 'first_half':
        return 'First Half';
      case 'halftime':
        return 'Halftime';
      case 'second_half':
        return 'Second Half';
      case 'post_match':
        return 'Post-Match';
      default:
        return 'Inactive';
    }
  };

  const isLive = timeline.phase === 'first_half' || timeline.phase === 'second_half';

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Match Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center py-2">
          <div className="flex w-full items-center justify-between mb-4 px-4">
            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground uppercase tracking-widest">Home</span>
              <span className="text-4xl font-black">{timeline.homeScore}</span>
            </div>

            <div className="flex flex-col items-center justify-center px-4">
              <div
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2',
                  isLive
                    ? 'bg-red-500/10 text-red-500 animate-pulse'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {getPhaseDisplay(timeline.phase)}
              </div>
              <span className="text-2xl font-mono">
                {timeline.minute > 0 ? `${Math.floor(timeline.minute)}'` : '--'}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-sm text-muted-foreground uppercase tracking-widest">Away</span>
              <span className="text-4xl font-black">{timeline.awayScore}</span>
            </div>
          </div>

          <div className="w-full relative mt-4">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full"></div>

            {/* Timeline Progress */}
            <div
              className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.max(0, Math.min(100, ((timeline.minute + 120) / 240) * 100))}%`,
              }}
            ></div>

            <div className="relative flex justify-between text-[10px] text-muted-foreground uppercase font-medium pt-3">
              <span>-120m</span>
              <span>Kickoff</span>
              <span>HT</span>
              <span>FT</span>
              <span>+120m</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
