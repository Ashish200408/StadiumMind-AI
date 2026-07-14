import { StandardizedModule, GlobalRecommendation } from '../types';

export const mergeRecommendations = (
  modules: Record<string, StandardizedModule>
): GlobalRecommendation[] => {
  const merged: Map<string, GlobalRecommendation> = new Map();

  Object.values(modules).forEach((mod) => {
    mod.recommendations.forEach((action) => {
      if (merged.has(action)) {
        const existing = merged.get(action)!;
        if (!existing.moduleSource.includes(mod.moduleName)) {
          existing.moduleSource.push(mod.moduleName);
        }
      } else {
        merged.set(action, {
          id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          moduleSource: [mod.moduleName],
          action,
          priorityRank: 99, // placeholder, will be sorted
        });
      }
    });
  });

  const recommendations = Array.from(merged.values());

  // Prioritize based on number of modules suggesting it and emergency keywords
  recommendations.sort((a, b) => {
    // If it's an emergency action, prioritize heavily
    const isAEmergency = /dispatch|evacuate|emergency|escalate/i.test(a.action);
    const isBEmergency = /dispatch|evacuate|emergency|escalate/i.test(b.action);

    if (isAEmergency && !isBEmergency) return -1;
    if (!isAEmergency && isBEmergency) return 1;

    // Sort by frequency (module count)
    return b.moduleSource.length - a.moduleSource.length;
  });

  // Assign final rank
  recommendations.forEach((rec, index) => {
    rec.priorityRank = index + 1;
  });

  return recommendations;
};
