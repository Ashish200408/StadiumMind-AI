import { create } from 'zustand';
import { GeneratedReport } from '../types';
import { ExecutiveSnapshot, OverallScores } from '../../intelligence-core/types';

interface ExecutiveState {
  reportsHistory: GeneratedReport[];
  previousSnapshot: ExecutiveSnapshot | null;
  previousScores: OverallScores | null;
  addReportToHistory: (report: GeneratedReport) => void;
  updateReportExportStatus: (id: string, status: GeneratedReport['exportStatus']) => void;
  setPreviousSnapshot: (snapshot: ExecutiveSnapshot, scores: OverallScores) => void;
}

export const useExecutiveStore = create<ExecutiveState>((set) => ({
  reportsHistory: [],
  previousSnapshot: null,
  previousScores: null,
  addReportToHistory: (report) =>
    set((state) => ({ reportsHistory: [report, ...state.reportsHistory] })),
  updateReportExportStatus: (id, status) =>
    set((state) => ({
      reportsHistory: state.reportsHistory.map((r) =>
        r.id === id ? { ...r, exportStatus: status } : r
      ),
    })),
  setPreviousSnapshot: (snapshot, scores) =>
    set({ previousSnapshot: snapshot, previousScores: scores }),
}));
