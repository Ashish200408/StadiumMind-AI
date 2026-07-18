export type AIIntent =
  | 'General'
  | 'Stadium_Operations'
  | 'Executive_Reports'
  | 'Crowd_Intelligence'
  | 'Emergency_Response'
  | 'Navigation'
  | 'Sustainability';

const intentKeywords: Record<AIIntent, string[]> = {
  Stadium_Operations: ['stadium', 'operations', 'metrics', 'match', 'overall', 'status', 'event'],
  Executive_Reports: ['executive', 'report', 'summary', 'briefing', 'stakeholder', 'financial'],
  Crowd_Intelligence: [
    'crowd',
    'congestion',
    'attendance',
    'density',
    'flow',
    'gate',
    'queue',
    'fans',
  ],
  Emergency_Response: [
    'emergency',
    'incident',
    'medical',
    'security',
    'alert',
    'critical',
    'evacuation',
    'risk',
  ],
  Navigation: [
    'navigate',
    'navigation',
    'mobility',
    'transit',
    'parking',
    'transport',
    'directions',
  ],
  Sustainability: ['sustainability', 'energy', 'waste', 'water', 'power', 'eco', 'green', 'carbon'],
  General: [],
};

export const detectIntent = (query: string): AIIntent => {
  const normalizedQuery = query.toLowerCase();

  // Basic programming check to short-circuit as General
  if (
    normalizedQuery.includes('code') ||
    normalizedQuery.includes('python') ||
    normalizedQuery.includes('javascript') ||
    normalizedQuery.includes('react') ||
    normalizedQuery.includes('function') ||
    normalizedQuery.includes('joke') ||
    normalizedQuery.includes('who won') ||
    normalizedQuery.includes('explain machine learning') ||
    normalizedQuery.includes('write ') ||
    normalizedQuery.includes('how to ')
  ) {
    // If it mentions stadium terms as well, we might still classify as operational, but let's be strict for known generic prompts.
    if (!normalizedQuery.includes('stadium') && !normalizedQuery.includes('crowd')) {
      return 'General';
    }
  }

  // Find the intent with the most keyword matches
  let bestIntent: AIIntent = 'General';
  let maxMatches = 0;

  for (const [intent, keywords] of Object.entries(intentKeywords)) {
    if (intent === 'General') continue;

    let matches = 0;
    for (const keyword of keywords) {
      if (normalizedQuery.includes(keyword)) {
        matches++;
      }
    }

    if (matches > maxMatches) {
      maxMatches = matches;
      bestIntent = intent as AIIntent;
    }
  }

  return bestIntent;
};
