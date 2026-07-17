import React, { useState } from 'react';
import { useExecutiveIntelligence } from '../hooks/useExecutiveIntelligence';
import { ReportType } from '../types';
import { FilePlus2, Sparkles, Wand2 } from 'lucide-react';

export const ReportGenerator: React.FC = () => {
  const { generateReport, isGeneratingReport } = useExecutiveIntelligence();
  const [selectedType, setSelectedType] = useState<ReportType>('Executive Match Report');

  const reportTypes: ReportType[] = [
    'Executive Match Report',
    'Stadium Operations Report',
    'Incident Report',
    'Emergency Response Report',
    'Crowd Intelligence Report',
    'Mobility Report',
    'Accessibility Report',
    'Sustainability Report',
    'Volunteer Briefing',
    'Shift Handover Report',
    'Match Completion Report',
  ];

  const handleGenerate = async () => {
    await generateReport(selectedType);
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-lg">
      <h3 className="font-bold text-white tracking-wide mb-6 flex items-center gap-2">
        <FilePlus2 className="h-5 w-5 text-cyan-400" /> Generate Executive Report
      </h3>

      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Report Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ReportType)}
            disabled={isGeneratingReport}
            className="w-full bg-black/40 border border-white/10 text-white font-medium rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all disabled:opacity-50 shadow-inner"
          >
            {reportTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGeneratingReport}
          className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGeneratingReport ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating via AI Core...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Generate Report
            </>
          )}
        </button>

        <p className="text-[10px] text-slate-500 mt-2 font-medium flex gap-2 items-start leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
          <Wand2 className="h-4 w-4 shrink-0 text-cyan-500/50" />
          Reports are generated deterministically using real-time Unified Intelligence data and
          Gemini Operations Copilot.
        </p>
      </div>
    </div>
  );
};
