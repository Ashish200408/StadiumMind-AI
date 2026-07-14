import { StandardizedModule, GlobalAlert } from '../types';

export const mergeAlerts = (modules: Record<string, StandardizedModule>): GlobalAlert[] => {
  const allAlerts: GlobalAlert[] = [];

  Object.values(modules).forEach((mod) => {
    if (mod.alerts) {
      allAlerts.push(...mod.alerts);
    }
  });

  // Sort by Severity -> Priority -> Timestamp
  const severityWeight = {
    Critical: 1,
    High: 2,
    Medium: 3,
    Low: 4,
  };

  allAlerts.sort((a, b) => {
    if (severityWeight[a.severity] !== severityWeight[b.severity]) {
      return severityWeight[a.severity] - severityWeight[b.severity];
    }
    if (a.priority !== b.priority) {
      return a.priority - b.priority;
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return allAlerts;
};
