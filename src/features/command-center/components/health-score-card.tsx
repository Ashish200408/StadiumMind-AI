import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimulationStore } from '../../simulation/store/simulation-store';
import { calculateHealthScore } from '../utils/health-score';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/components/ui/button';

export function HealthScoreCard({ className }: { className?: string }) {
  // Subscribe to the entire state to recalculate health whenever anything changes
  const state = useSimulationStore();

  // Memoize the health calculation so it only re-runs when the state reference updates
  const health = useMemo(() => calculateHealthScore(state), [state]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Optimal':
        return 'text-green-500';
      case 'Stable':
        return 'text-blue-500';
      case 'Warning':
        return 'text-yellow-500';
      case 'Critical':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const TrendIcon =
    health.trend === 'up' ? TrendingUp : health.trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    health.trend === 'up'
      ? 'text-green-500'
      : health.trend === 'down'
        ? 'text-destructive'
        : 'text-muted-foreground';

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-2 border-b bg-muted/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Command Center Health
          </CardTitle>
          <div className={cn('flex items-center gap-1 text-xs font-medium', trendColor)}>
            <TrendIcon className="h-3 w-3" />
            <span className="capitalize">{health.trend}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="relative flex items-center justify-center h-32 w-32">
            {/* Simple SVG Donut Chart for Score */}
            <svg
              className="absolute inset-0 h-full w-full -rotate-90 transform"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/20"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${health.score * 2.51} 251`}
                className={cn(
                  'transition-all duration-1000 ease-in-out',
                  getStatusColor(health.status)
                )}
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-bold tracking-tighter">
                {Math.round(health.score)}
              </span>
              <span
                className={cn(
                  'text-xs font-medium uppercase tracking-wider',
                  getStatusColor(health.status)
                )}
              >
                {health.status}
              </span>
            </div>
          </div>

          <div className="w-full grid grid-cols-2 gap-2 mt-6">
            <FactorScore label="Crowd Flow" score={health.factors.crowd} />
            <FactorScore label="Transport" score={health.factors.transport} />
            <FactorScore label="Environment" score={health.factors.environment} />
            <FactorScore label="Security" score={health.factors.incidents} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FactorScore({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex flex-col gap-1 p-2 rounded bg-muted/30">
      <div className="flex justify-between items-center text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span
          className={
            score < 70
              ? 'text-destructive font-medium'
              : score < 90
                ? 'text-yellow-500 font-medium'
                : 'text-green-500 font-medium'
          }
        >
          {score}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-muted overflow-hidden rounded-full">
        <div
          className={cn(
            'h-full transition-all duration-500',
            score < 70 ? 'bg-destructive' : score < 90 ? 'bg-yellow-500' : 'bg-green-500'
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
