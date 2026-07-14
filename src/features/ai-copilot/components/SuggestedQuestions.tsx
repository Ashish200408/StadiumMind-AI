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
    <div className="flex flex-wrap gap-2 p-4 pt-0">
      {SUGGESTIONS.map((q, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(q)}
          disabled={disabled}
          className="px-3 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-full transition-colors disabled:opacity-50"
        >
          {q}
        </button>
      ))}
    </div>
  );
};
