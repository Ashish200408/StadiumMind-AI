import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useSimulationStore } from '../../simulation/store/simulation-store';
import { Users, Bus, Zap, Droplets, Thermometer, Trash2 } from 'lucide-react';
import { cn } from '@/components/ui/button';

export function OperationalGrid({ className }: { className?: string }) {
  const crowd = useSimulationStore((state) => state.crowd);
  const transport = useSimulationStore((state) => state.transport);
  const resources = useSimulationStore((state) => state.resources);
  const env = useSimulationStore((state) => state.environment);

  // Calculate aggregates
  const totalCrowd = Object.values(crowd).reduce((acc, z) => acc + z.currentCount, 0);
  const avgDensity =
    Object.values(crowd).reduce((acc, z) => acc + z.density, 0) / (Object.keys(crowd).length || 1);

  const totalParking = Object.values(transport).find((t) => t.mode === 'parking')?.occupancy || 0;

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 gap-4', className)}>
      <MiniStatCard
        title="Total Crowd"
        value={totalCrowd.toLocaleString()}
        icon={<Users className="h-4 w-4" />}
        status={avgDensity > 80 ? 'warning' : 'optimal'}
        subtext={`${Math.round(avgDensity)}% Avg Density`}
      />
      <MiniStatCard
        title="Parking Occupancy"
        value={`${totalParking.toFixed(1)}%`}
        icon={<Bus className="h-4 w-4" />}
        status={totalParking > 90 ? 'critical' : totalParking > 75 ? 'warning' : 'optimal'}
        subtext="North & South Lots"
      />
      <MiniStatCard
        title="Energy Load"
        value={`${resources?.energyUsage.toLocaleString()} kW`}
        icon={<Zap className="h-4 w-4" />}
        status={resources && resources.energyUsage > 8500 ? 'warning' : 'optimal'}
        subtext="Main Grid"
      />
      <MiniStatCard
        title="Temperature"
        value={`${env?.temperature}°C`}
        icon={<Thermometer className="h-4 w-4" />}
        status={env && env.temperature > 32 ? 'warning' : 'optimal'}
        subtext={env?.weather || 'Sunny'}
      />
      <MiniStatCard
        title="Water Usage"
        value={`${(resources?.waterConsumption || 0) / 1000}k L`}
        icon={<Droplets className="h-4 w-4" />}
        status="optimal"
        subtext="Cumulative"
      />
      <MiniStatCard
        title="Waste Level"
        value={`${resources?.wasteLevel}%`}
        icon={<Trash2 className="h-4 w-4" />}
        status={resources && resources.wasteLevel > 80 ? 'critical' : 'optimal'}
        subtext="Capacity"
      />
    </div>
  );
}

function MiniStatCard({
  title,
  value,
  icon,
  status,
  subtext,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  status: 'optimal' | 'warning' | 'critical';
  subtext: string;
}) {
  const statusColor =
    status === 'critical'
      ? 'text-destructive'
      : status === 'warning'
        ? 'text-yellow-500'
        : 'text-green-500';

  return (
    <Card>
      <CardContent className="p-4 flex flex-col justify-center">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-muted-foreground truncate">{title}</span>
          <div className={statusColor}>{icon}</div>
        </div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="text-[10px] text-muted-foreground mt-1 truncate">{subtext}</div>
      </CardContent>
    </Card>
  );
}
