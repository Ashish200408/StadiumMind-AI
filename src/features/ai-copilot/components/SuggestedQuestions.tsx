import React, { useState, useEffect } from 'react';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  disabled: boolean;
}

const ALL_SUGGESTIONS = [
  '🏟 Assess current stadium readiness',
  '👥 Predict crowd congestion for the next 20 minutes',
  '🚨 Analyze active incidents',
  '📊 Generate executive operational briefing',
  '🚌 Optimize transport operations',
  '🚑 Recommend emergency response actions',
  '♿ Review accessibility performance',
  '🌱 Analyze sustainability metrics',
  '👮 Recommend security deployment',
  '🙋 Optimize volunteer allocation',
  '📋 Generate end-of-match operational report',
  '⚽ Compare all available simulation scenarios',
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelect, disabled }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Pick 4 random suggestions on mount
    const shuffled = [...ALL_SUGGESTIONS].sort(() => 0.5 - Math.random());
    setSuggestions(shuffled.slice(0, 4));

    // Rotate every 15 seconds
    const interval = setInterval(() => {
      const newShuffled = [...ALL_SUGGESTIONS].sort(() => 0.5 - Math.random());
      setSuggestions(newShuffled.slice(0, 4));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 p-6 pt-0 animate-fade-in">
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-2">
        <span className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse"></span>
        Suggested Operational Commands
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {suggestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(q.substring(2))} // Remove icon for prompt
            disabled={disabled}
            className="px-4 py-2.5 text-xs font-semibold bg-black/40 hover:bg-white/10 text-slate-300 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/30 rounded-xl transition-all disabled:opacity-50 shadow-sm flex items-center gap-2"
          >
            <span>{q.substring(0, 2)}</span>
            <span>{q.substring(2)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
