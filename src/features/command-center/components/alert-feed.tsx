import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSimulationStore } from '../../simulation/store/simulation-store';
import { AlertCircle, ShieldAlert, Thermometer, Users } from 'lucide-react';
import { cn } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Severity } from '../../simulation/types';

interface AlertItem {
  id: string;
  title: string;
  timestamp: string;
  severity: Severity;
  category: string;
  location: string;
  icon: React.ElementType;
}

export function AlertFeed({ className }: { className?: string }) {
  const state = useSimulationStore();

  // Synthesize alerts from various state parts
  const alerts = useMemo(() => {
    const items: AlertItem[] = [];

    // Incidents are direct alerts
    Object.values(state.incidents).forEach((inc) => {
      if (inc.status !== 'resolved') {
        items.push({
          id: inc.id,
          title: inc.description,
          timestamp: inc.timestamp,
          severity: inc.severity,
          category: inc.category,
          location: inc.location.name,
          icon: inc.category === 'security' ? ShieldAlert : AlertCircle,
        });
      }
    });

    // Crowd alerts
    Object.values(state.crowd).forEach((zone) => {
      if (zone.density > 85) {
        items.push({
          id: `alert-crowd-${zone.id}`,
          title: `High Crowd Density (${zone.density}%)`,
          timestamp: zone.timestamp,
          severity: zone.density > 95 ? 'critical' : 'high',
          category: 'crowd',
          location: zone.location.name,
          icon: Users,
        });
      }
    });

    // Environment alerts
    if (state.environment && state.environment.temperature > 35) {
      items.push({
        id: `alert-env-temp`,
        title: `Extreme Temperature (${state.environment.temperature}°C)`,
        timestamp: state.environment.timestamp,
        severity: state.environment.temperature > 40 ? 'critical' : 'high',
        category: 'environment',
        location: state.environment.location.name,
        icon: Thermometer,
      });
    }

    // Sort by timestamp (newest first)
    return items
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }, [state]);

  const getSeverityStyle = (severity: Severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20';
      case 'low':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className={cn('flex flex-col h-full', className)}>
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Active Alerts
          </div>
          {alerts.length > 0 && (
            <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
              {alerts.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="divide-y">
          <AnimatePresence initial={false}>
            {alerts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center text-sm text-muted-foreground"
              >
                No active alerts. System nominal.
              </motion.div>
            ) : (
              alerts.map((alert) => {
                const Icon = alert.icon;
                return (
                  <motion.div
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'p-4 flex gap-3 items-start hover:bg-muted/50 transition-colors border-l-4',
                      alert.severity === 'critical'
                        ? 'border-l-destructive'
                        : alert.severity === 'high'
                          ? 'border-l-orange-500'
                          : alert.severity === 'medium'
                            ? 'border-l-yellow-500'
                            : 'border-l-blue-500'
                    )}
                  >
                    <div
                      className={cn('mt-0.5 p-1.5 rounded-full', getSeverityStyle(alert.severity))}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-semibold truncate">{alert.title}</p>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {new Date(alert.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground truncate">
                          {alert.location}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-medium opacity-70">
                          {alert.category}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}
