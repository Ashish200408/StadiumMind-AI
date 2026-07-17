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
      className={cn(
        'flex flex-col h-full bg-slate-900/60 backdrop-blur-xl border-r border-white/10 w-64 text-slate-300 shadow-[4px_0_24px_rgba(0,0,0,0.5)]',
        className
      )}
    >
      <div className="flex items-center justify-center h-20 border-b border-white/10 px-4 shrink-0 bg-gradient-to-b from-black/20 to-transparent">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
          <BrainCircuit className="h-7 w-7 text-cyan-400" />
          <span>
            StadiumMind <span className="text-cyan-400">AI</span>
          </span>
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
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group',
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-50 shadow-[inset_0_0_20px_rgba(6,182,212,0.2)] border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                  )
                }
              >
                {/* Active glow line */}
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,1)]" />
                    )}
                    <Icon
                      className={cn(
                        'h-5 w-5 shrink-0 transition-colors',
                        isActive ? 'text-cyan-400' : 'group-hover:text-cyan-300'
                      )}
                    />
                    <span className="relative z-10">{link.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10 shrink-0 bg-black/20">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-800/50 p-3 shadow-inner">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] relative">
            <span className="font-bold text-sm">AI</span>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-200">Copilot Active</span>
            <span className="text-xs font-medium text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]">
              System Nominal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
