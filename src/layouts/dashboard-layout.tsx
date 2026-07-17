import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/sidebar';
import { Topbar } from '../components/dashboard/topbar';
import { Breadcrumb } from '../components/layout/breadcrumb';
import { Drawer } from '../components/ui/drawer';

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0f1c] to-black font-sans text-slate-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:flex-shrink-0 z-20">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        side="left"
        className="w-72 p-0"
      >
        <Sidebar className="w-full border-r-0" onLinkClick={() => setIsMobileMenuOpen(false)} />
      </Drawer>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden relative">
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 relative overflow-y-auto focus:outline-none scroll-smooth">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 relative z-10">
            <Breadcrumb className="mb-6" />
            <Outlet />
          </div>
        </main>

        {/* Footer could go here if needed, or inside the main scroll area */}
      </div>

      {/* Global AI Copilot Floating Button (Mobile focused, as desktop has it in topbar) */}
      <button className="lg:hidden absolute bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] transition-shadow focus:outline-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-sparkles"
        >
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        </svg>
      </button>
    </div>
  );
}
