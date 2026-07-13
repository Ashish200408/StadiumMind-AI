import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BrainCircuit,
  Users,
  Navigation,
  Bus,
  Accessibility,
  Leaf,
  AlertTriangle,
  FileBarChart,
  Settings,
} from 'lucide-react';
import { cn } from '../ui/button';

// eslint-disable-next-line react-refresh/only-export-components
export const SIDEBAR_LINKS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Command Center', href: '/ai-command', icon: BrainCircuit },
  { name: 'Crowd Intelligence', href: '/crowd', icon: Users },
  { name: 'Smart Navigation', href: '/navigation', icon: Navigation },
  { name: 'Transport', href: '/transport', icon: Bus },
  { name: 'Accessibility', href: '/accessibility', icon: Accessibility },
  { name: 'Sustainability', href: '/sustainability', icon: Leaf },
  { name: 'Emergency Response', href: '/emergency', icon: AlertTriangle },
  { name: 'Reports', href: '/reports', icon: FileBarChart },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

export function Sidebar({ className, onLinkClick }: SidebarProps) {
  return (
    <div
      className={cn('flex flex-col h-full bg-card border-r w-64 text-card-foreground', className)}
    >
      <div className="flex items-center justify-center h-16 border-b px-4 shrink-0">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
          <BrainCircuit className="h-6 w-6" />
          <span>StadiumMind AI</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {SIDEBAR_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.name}
                to={link.href}
                onClick={onLinkClick}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                {link.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t shrink-0">
        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
            <span className="font-semibold text-sm">AI</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Copilot Active</span>
            <span className="text-xs text-green-500">System Nominal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
