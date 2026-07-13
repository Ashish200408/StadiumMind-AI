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
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4 sm:px-6 shadow-sm">
      {/* Mobile Menu Toggle */}
      <button
        onClick={onMenuClick}
        className="lg:hidden rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open menu</span>
      </button>

      {/* Global Search */}
      <div className="flex flex-1 items-center gap-4">
        <form className="hidden sm:flex relative w-full max-w-md items-center">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search resources, reports, or ask AI..."
            className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <div className="absolute right-2 flex items-center">
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
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
          className="hidden sm:flex items-center gap-2 text-primary hover:text-primary hover:bg-primary/10"
        >
          <Sparkles className="h-4 w-4" />
          <span>Copilot</span>
        </Button>

        {/* Language Selector (UI Only) */}
        <Dropdown
          trigger={
            <Button variant="ghost" size="icon" className="rounded-full">
              <Globe className="h-5 w-5 text-muted-foreground" />
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
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-destructive" />
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
            <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
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
