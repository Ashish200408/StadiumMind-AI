import React from 'react';
import { useExecutiveStore } from '../store/executive-store';

export const ReportsPage: React.FC = () => {
  const reportsHistory = useExecutiveStore((state) => state.reportsHistory);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
          Executive Reports
        </h1>
        <p className="text-gray-500 mt-2">
          View all deterministically generated operational reports and historical summaries.
        </p>
      </div>

      {reportsHistory.length === 0 ? (
        <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-8 border border-white/20 shadow-lg text-center text-gray-500 dark:text-slate-400">
          No reports have been generated yet. Go to the Executive Dashboard to generate one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportsHistory.map((report) => (
            <div
              key={report.id}
              className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg flex flex-col h-full hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                    {report.type} Report
                  </h3>
                  <time className="text-xs text-gray-500 dark:text-slate-400 mt-1 block">
                    {new Date(report.generatedTime).toLocaleString()}
                  </time>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${
                    report.exportStatus === 'Exported'
                      ? 'bg-green-500/20 text-green-400'
                      : report.exportStatus === 'Pending'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {report.exportStatus}
                </span>
              </div>

              <div className="flex-grow">
                <p className="text-sm text-gray-600 dark:text-slate-300 italic mb-4 line-clamp-4">
                  "{report.summary}"
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  Size: {report.reportSizeKb.toFixed(1)} KB
                </span>
                <span className="text-xs text-slate-500">By: {report.generatedBy}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
