import React from 'react';
import { CopilotCapabilities } from '../types';
import { FileText, AlertCircle, Clock } from 'lucide-react';

interface QuickActionsProps {
  onTrigger: (capability: CopilotCapabilities) => void;
  disabled: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onTrigger, disabled }) => {
  return (
    <div className="flex justify-center flex-wrap gap-4 p-5 border-b border-white/10 bg-black/20">
      <button
        onClick={() => onTrigger(CopilotCapabilities.EXECUTIVE_MATCH_SUMMARY)}
        disabled={disabled}
        className="flex items-center space-x-2 px-5 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl transition-all disabled:opacity-50 font-bold text-sm shadow-[0_0_10px_rgba(59,130,246,0.1)]"
      >
        <FileText className="w-4 h-4" />
        <span>Executive Report</span>
      </button>

      <button
        onClick={() => onTrigger(CopilotCapabilities.OPERATIONAL_SITUATION_REPORT)}
        disabled={disabled}
        className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl transition-all disabled:opacity-50 font-bold text-sm shadow-[0_0_10px_rgba(99,102,241,0.1)]"
      >
        <AlertCircle className="w-4 h-4" />
        <span>Situation Report</span>
      </button>

      <button
        onClick={() => onTrigger(CopilotCapabilities.WHAT_CHANGED)}
        disabled={disabled}
        className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl transition-all disabled:opacity-50 font-bold text-sm shadow-[0_0_10px_rgba(16,185,129,0.1)]"
      >
        <Clock className="w-4 h-4" />
        <span>What Changed?</span>
      </button>
    </div>
  );
};
