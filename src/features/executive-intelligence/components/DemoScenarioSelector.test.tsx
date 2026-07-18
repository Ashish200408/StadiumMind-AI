import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DemoScenarioSelector } from './DemoScenarioSelector';
import { useSimulationStore } from '../../simulation/store/simulation-store';

describe('DemoScenarioSelector', () => {
  beforeEach(() => {
    useSimulationStore.setState({
      incidents: {},
      environment: {
        temperature: 20,
        humidity: 50,
        weather: 'sunny',
        windSpeed: 10,
        timestamp: new Date().toISOString(),
      } as any,
    });
  });

  it('renders all scenarios', () => {
    render(<DemoScenarioSelector />);
    expect(screen.getByText('Normal Match')).toBeInTheDocument();
    expect(screen.getByText('High Crowd')).toBeInTheDocument();
    expect(screen.getByText('Emergency')).toBeInTheDocument();
  });

  it('injects emergency incidents when Emergency is selected', () => {
    render(<DemoScenarioSelector />);
    fireEvent.click(screen.getByText('Emergency'));

    const state = useSimulationStore.getState();
    expect(state.incidents['sim-emerg-1']).toBeDefined();
    expect(state.incidents['sim-emerg-1'].severity).toBe('critical');
  });

  it('resets incidents when Normal Match is selected', () => {
    render(<DemoScenarioSelector />);
    fireEvent.click(screen.getByText('Emergency'));

    let state = useSimulationStore.getState();
    expect(Object.keys(state.incidents).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByText('Normal Match'));
    state = useSimulationStore.getState();
    expect(Object.keys(state.incidents).length).toBe(0);
  });
});
