import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/components/ui/button';

export interface LiveStatusCardProps {
  title: string;
  value: string | number;
  label?: string;
  icon?: React.ReactNode;
  status?: 'active' | 'warning' | 'error' | 'resolved';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function LiveStatusCard({
  title,
  value,
  label,
  icon,
  status = 'active',
  trend,
  className,
}: LiveStatusCardProps) {
  const getStatusColor = (s: string) => {
    switch (s) {
      case 'active':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-destructive';
      case 'resolved':
        return 'bg-blue-500';
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card className={cn('overflow-hidden relative', className)}>
      {/* Top thin border indicating status */}
      <div className={cn('absolute top-0 left-0 right-0 h-1', getStatusColor(status))} />

      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-sm font-medium flex items-center justify-between text-muted-foreground">
          {title}
          {icon && <div className={cn('text-muted-foreground')}>{icon}</div>}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col">
          <div className="text-3xl font-bold tracking-tight">{value}</div>

          <div className="flex items-center gap-2 mt-1">
            {status !== 'active' && (
              <span
                className={cn(
                  'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                  status === 'error'
                    ? 'bg-destructive/10 text-destructive'
                    : status === 'warning'
                      ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500'
                      : 'bg-muted text-muted-foreground'
                )}
              >
                {status}
              </span>
            )}

            {label && <span className="text-xs text-muted-foreground">{label}</span>}

            {trend && (
              <span
                className={cn(
                  'text-xs font-medium flex items-center ml-auto',
                  trend.isPositive ? 'text-green-500' : 'text-destructive'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
