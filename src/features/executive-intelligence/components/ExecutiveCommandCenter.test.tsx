import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ExecutiveCommandCenter } from './ExecutiveCommandCenter';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../intelligence-core/store/intelligence-core-store', () => {
  const storeFn = vi.fn(() => ({
    unifiedData: {
      modules: {},
      overallScores: { operationalReadiness: 95, fanExperience: 90, riskLevel: 5 },
      snapshots: { active: 1, pending: 0, resolved: 5 },
      globalAlerts: [],
      globalRecommendations: [],
      eventTimeline: [],
    },
    overallScores: { operationalReadiness: 95, fanExperience: 90, riskLevel: 5 },
    snapshots: { active: 1, pending: 0, resolved: 5 },
  }));

  (storeFn as any).getState = vi.fn(() => ({
    overallScores: { operationalReadiness: 95, fanExperience: 90, riskLevel: 5 },
    snapshots: { active: 1, pending: 0, resolved: 5 },
  }));
  (storeFn as any).subscribe = vi.fn();

  return {
    useIntelligenceCoreStore: storeFn,
    useIntelligenceCoreStoreBase: () => ({
      overallScores: { operationalReadiness: 95, fanExperience: 90, riskLevel: 5 },
      snapshots: { active: 1, pending: 0, resolved: 5 },
    }),
  };
});

describe('ExecutiveCommandCenter', () => {
  it('renders the executive command center with readiness scores', () => {
    // Basic test to see if it renders without crashing
    render(
      <BrowserRouter>
        <ExecutiveCommandCenter />
      </BrowserRouter>
    );
    expect(screen.getByText(/Mission Control/i)).toBeInTheDocument();
  });
});
