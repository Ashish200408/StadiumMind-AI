import React, { useState, useEffect } from 'react';
import { Sparkles, X, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

export function GuidedOnboarding() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem('stadiumMindOnboardingSeen');
    if (!hasSeen) {
      // Small delay to let the app load
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('stadiumMindOnboardingSeen', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(6,182,212,0.15)] relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 mb-4">
          <Sparkles className="h-6 w-6" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Welcome to StadiumMind AI</h2>
        <p className="text-slate-300 mb-4">
          The ultimate AI-powered command center for the FIFA World Cup 2026.
        </p>

        <ul className="space-y-3 mb-6 text-sm text-slate-400">
          <li className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-cyan-400" />
            <span>
              <strong>6 Intelligence Engines:</strong> Crowd, Mobility, Navigation, Emergency,
              Accessibility, Sustainability.
            </span>
          </li>
          <li className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-cyan-400" />
            <span>
              <strong>AI Copilot:</strong> Ask operational queries anytime.
            </span>
          </li>
          <li className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-cyan-400" />
            <span>
              <strong>Explainable AI:</strong> Every decision shows confidence, reasoning, and
              predicted impact.
            </span>
          </li>
        </ul>

        <div className="bg-cyan-950/40 p-4 rounded-xl border border-cyan-500/20 mb-6">
          <p className="text-sm text-cyan-100 font-medium text-center">
            To instantly see the platform in action, click the <strong>"Demo Mode"</strong> dropdown
            in the top navigation bar and select <strong>"Match Start"</strong>.
          </p>
        </div>

        <Button onClick={handleClose} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white">
          Get Started
        </Button>
      </div>
    </div>
  );
}
