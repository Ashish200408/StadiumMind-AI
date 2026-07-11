import React from 'react';
import { Bell, Menu, User } from 'lucide-react';

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 sm:px-6 z-10 sticky top-0">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="mr-4 p-2 rounded-md hover:bg-muted text-muted-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open sidebar</span>
        </button>
        <div className="hidden sm:block">{/* Breadcrumbs or Page Title could go here */}</div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-muted text-muted-foreground relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border border-background"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}
