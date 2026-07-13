import React from 'react';
import { cn } from './button';

export type StatusType = 'online' | 'offline' | 'warning' | 'processing' | 'unknown';

interface StatusChipProps {
  status: StatusType;
  label?: string;
  className?: string;
}

export function StatusChip({ status, label, className }: StatusChipProps) {
  const statusConfig = {
    online: {
      dot: 'bg-green-500',
      bg: 'bg-green-500/10',
      text: 'text-green-700 dark:text-green-400',
      defaultLabel: 'Online',
    },
    offline: {
      dot: 'bg-gray-500',
      bg: 'bg-gray-500/10',
      text: 'text-gray-700 dark:text-gray-400',
      defaultLabel: 'Offline',
    },
    warning: {
      dot: 'bg-yellow-500',
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-700 dark:text-yellow-400',
      defaultLabel: 'Warning',
    },
    processing: {
      dot: 'bg-blue-500 animate-pulse',
      bg: 'bg-blue-500/10',
      text: 'text-blue-700 dark:text-blue-400',
      defaultLabel: 'Processing',
    },
    unknown: {
      dot: 'bg-muted-foreground',
      bg: 'bg-muted',
      text: 'text-muted-foreground',
      defaultLabel: 'Unknown',
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} aria-hidden="true" />
      {label || config.defaultLabel}
    </div>
  );
}
