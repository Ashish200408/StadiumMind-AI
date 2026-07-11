import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Settings, Activity } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border h-full flex flex-col transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">StadiumMind</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          <li>
            <Link
              to={ROUTES.HOME}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground"
            >
              <Home className="mr-3 h-5 w-5 text-muted-foreground" />
              Home
            </Link>
          </li>
          <li>
            <Link
              to={ROUTES.DASHBOARD}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground"
            >
              <Activity className="mr-3 h-5 w-5 text-muted-foreground" />
              Dashboard
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-foreground cursor-pointer">
          <Settings className="mr-3 h-5 w-5 text-muted-foreground" />
          Settings
        </div>
      </div>
    </aside>
  );
}
