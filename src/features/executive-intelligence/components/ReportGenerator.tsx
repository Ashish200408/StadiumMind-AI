import React, { useState } from 'react';
import { useExecutiveIntelligence } from '../hooks/useExecutiveIntelligence';
import { ReportType } from '../types';

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
    <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-6">
      <h3 className="font-semibold text-slate-200 mb-4">Generate Executive Report</h3>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">Report Type</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ReportType)}
            disabled={isGeneratingReport}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
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
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGeneratingReport ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating via AI...
            </>
          ) : (
            <>
              <span className="text-lg">✨</span> Generate Report
            </>
          )}
        </button>

        <p className="text-xs text-slate-500 mt-2">
          Reports are generated deterministically using real-time Unified Intelligence data and
          Gemini Operations Copilot.
        </p>
      </div>
    </div>
  );
};
