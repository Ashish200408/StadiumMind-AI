import React from 'react';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  disabled: boolean;
}

const SUGGESTIONS = [
  'What is happening right now?',
  'Which incidents require immediate attention?',
  'What caused the operational risk to increase?',
  'Summarize the current stadium situation.',
  'How can we improve sustainability?',
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelect, disabled }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 p-6 pt-0">
      {SUGGESTIONS.map((q, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(q)}
          disabled={disabled}
          className="px-4 py-2 text-[11px] font-bold tracking-wider uppercase bg-black/40 hover:bg-white/10 text-slate-300 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/30 rounded-xl transition-all disabled:opacity-50 shadow-sm"
        >
          {q}
        </button>
      ))}
    </div>
  );
};
