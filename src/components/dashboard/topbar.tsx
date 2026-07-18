import React from 'react';
import {
  Bell,
  Search,
  Globe,
  Moon,
  Sun,
  Menu,
  Sparkles,
  LogOut,
  User,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../contexts/auth-context';
import { Dropdown, DropdownItem, DropdownLabel, DropdownSeparator } from '../ui/dropdown';
import { Avatar } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

interface TopbarProps {
  onMenuClick?: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  // Using a mock theme state since theme provider isn't fully integrated here for this phase
  const [isDark, setIsDark] = React.useState(true);

  const handleSignOut = async () => {
    await signOut();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-30 flex h-20 shrink-0 items-center gap-4 border-b border-white/10 bg-slate-900/40 backdrop-blur-xl px-4 sm:px-6 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMenuClick}
        className="lg:hidden rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white transition-colors focus:outline-none"
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </button>

      {/* Global Search */}
      <div className="flex flex-1 items-center gap-4">
        <form className="hidden sm:flex relative w-full max-w-md items-center">
          <Search className="absolute left-3 h-5 w-5 text-cyan-500/50" />
          <input
            type="search"
            placeholder="Search resources, reports, or ask AI..."
            className="w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-4 py-2.5 text-sm text-white shadow-inner placeholder:text-slate-500 transition-all focus:border-cyan-500/50 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
          <div className="absolute right-2 flex items-center">
            <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 font-mono text-[10px] font-medium text-slate-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </form>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* AI Copilot Quick Action */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ROUTES.AI_COMMAND)}
          className="hidden sm:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          <Sparkles className="h-4 w-4 animate-pulse" />
          <span className="font-semibold tracking-wide">Copilot</span>
        </Button>

        {/* Language Selector (UI Only) */}
        <Dropdown
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <Globe className="h-5 w-5" />
              <span className="sr-only">Language</span>
            </Button>
          }
        >
          <DropdownItem>English (US)</DropdownItem>
          <DropdownItem>Spanish</DropdownItem>
          <DropdownItem>French</DropdownItem>
        </Dropdown>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setIsDark(!isDark)}
        >
          {isDark ? (
            <Moon className="h-5 w-5 text-muted-foreground" />
          ) : (
            <Sun className="h-5 w-5 text-muted-foreground" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Notification Center */}
        <Dropdown
          trigger={
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-2.5 w-2.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse" />
              <span className="sr-only">Notifications</span>
            </Button>
          }
        >
          <DropdownLabel>Notifications</DropdownLabel>
          <DropdownSeparator />
          <div className="max-h-80 overflow-y-auto w-64 p-2 text-sm text-center text-muted-foreground">
            No new notifications
          </div>
        </Dropdown>

        {/* User Profile */}
        <Dropdown
          trigger={
            <button
              aria-label="User profile menu"
              className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Avatar fallback={user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'} />
            </button>
          }
        >
          <div className="px-4 py-3 flex flex-col gap-1">
            <p className="text-sm font-medium leading-none">{user?.displayName || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            <div className="mt-2">
              <Badge variant="secondary" className="text-[10px] uppercase">
                {user?.role}
              </Badge>
            </div>
          </div>
          <DropdownSeparator />
          <DropdownItem onClick={() => navigate(ROUTES.PROFILE)}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownItem>
          <DropdownItem onClick={() => navigate(ROUTES.SETTINGS)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
