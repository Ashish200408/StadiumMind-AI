import React from 'react';
import { CopilotCapabilities } from '../types';

interface QuickActionsProps {
  onTrigger: (capability: CopilotCapabilities) => void;
  disabled: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onTrigger, disabled }) => {
  return (
    <div className="flex justify-center space-x-4 p-4 border-b border-gray-800 bg-gray-900">
      <button
        onClick={() => onTrigger(CopilotCapabilities.EXECUTIVE_MATCH_SUMMARY)}
        disabled={disabled}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
        <span>Executive Report</span>
      </button>

      <button
        onClick={() => onTrigger(CopilotCapabilities.OPERATIONAL_SITUATION_REPORT)}
        disabled={disabled}
        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors disabled:opacity-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>Situation Report</span>
      </button>

      <button
        onClick={() => onTrigger(CopilotCapabilities.WHAT_CHANGED)}
        disabled={disabled}
        className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors disabled:opacity-50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <span>What Changed?</span>
      </button>
    </div>
  );
};
