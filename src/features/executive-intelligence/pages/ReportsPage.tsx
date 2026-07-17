import React from 'react';
import { useExecutiveStore } from '../store/executive-store';
import { FileText, Download, User, HardDrive } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const reportsHistory = useExecutiveStore((state) => state.reportsHistory);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="mb-10 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
          <FileText className="w-7 h-7 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Executive Reports</h1>
          <p className="text-slate-400 mt-1 font-medium tracking-wide">
            View all deterministically generated operational reports and historical summaries.
          </p>
        </div>
      </div>

      {reportsHistory.length === 0 ? (
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-lg text-center text-slate-500 flex flex-col items-center gap-4">
          <FileText className="w-12 h-12 opacity-50" />
          <p className="font-medium">
            No reports have been generated yet. Go to the Executive Dashboard to generate one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportsHistory.map((report) => (
            <div
              key={report.id}
              className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-lg flex flex-col h-full hover:bg-white/5 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">
                    {report.type} Report
                  </h3>
                  <time className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mt-2 block">
                    {new Date(report.generatedTime).toLocaleString()}
                  </time>
                </div>
                <span
                  className={`px-3 py-1 rounded-md text-[10px] uppercase font-black tracking-wider border flex items-center gap-1 ${
                    report.exportStatus === 'Exported'
                      ? 'bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                      : report.exportStatus === 'Pending'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(251,191,36,0.2)]'
                        : 'bg-black/40 text-slate-400 border-white/10'
                  }`}
                >
                  {report.exportStatus === 'Exported' && <Download className="w-3 h-3" />}
                  {report.exportStatus}
                </span>
              </div>

              <div className="flex-grow bg-black/40 rounded-2xl p-5 border border-white/5 shadow-inner">
                <p className="text-sm text-slate-300 leading-relaxed italic line-clamp-5">
                  "{report.summary}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center px-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 flex items-center gap-1.5">
                  <HardDrive className="w-3 h-3 text-slate-400" /> {report.reportSizeKb.toFixed(1)}{' '}
                  KB
                </span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-slate-400" /> {report.generatedBy}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
