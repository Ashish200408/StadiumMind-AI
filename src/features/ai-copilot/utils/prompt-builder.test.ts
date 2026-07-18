import { describe, it, expect, vi } from 'vitest';
import { buildPromptPayload } from './prompt-builder';
import { PROMPT_TEMPLATES } from '../prompts';
import { useIntelligenceCoreStore } from '../../intelligence-core/store/intelligence-core-store';
import { CopilotCapabilities } from '../types';

describe('Prompt Builder', () => {
  it('builds a prompt payload with xml isolation and response mode', () => {
    const payload = buildPromptPayload(
      'What is the status of Gate B?',
      'Executive Summary',
      'General'
    );

    // Should inject response mode
    expect(payload.systemInstruction).toContain('Executive Summary');

    // Should inject user input inside <user_input> tags
    expect(payload.userMessage).toContain('<user_input>');
    expect(payload.userMessage).toContain('What is the status of Gate B?');
    expect(payload.userMessage).toContain('</user_input>');
  });

  it('escapes html tags in the user query for XSS protection', () => {
    const payload = buildPromptPayload('<script>alert(1)</script>', 'Detailed Analysis', 'General');

    expect(payload.userMessage).not.toContain('<script>');
    expect(payload.userMessage).toContain('&lt;script&gt;');
  });

  it('builds a prompt payload including AI context', () => {
    // Mock the store so buildAIContext actually returns something
    vi.spyOn(useIntelligenceCoreStore, 'getState').mockReturnValue({
      unifiedData: {
        timestamp: 'now',
        overallScores: {},
        globalAlerts: [
          {
            id: '1',
            title: 'Test Alert',
            severity: 'High',
            type: 'Incident',
            message: 'Test',
            timestamp: 'now',
          },
        ],
        globalRecommendations: [],
        eventTimeline: [],
        modules: {
          emergency: {
            activeIncidents: [
              {
                id: '1',
                title: 'Test',
                type: 'Medical',
                severity: 'High',
                status: 'Active',
                location: 'Gate A',
                timestamp: 'now',
              },
            ],
            resourceDeployments: [],
            criticalAlerts: [],
          },
        },
      },
    } as any);

    const payload = buildPromptPayload(
      'Help',
      'Detailed Analysis',
      'Emergency_Response',
      CopilotCapabilities.EMERGENCY_EXPLANATION
    );

    // Should inject context
    expect(payload.userMessage).toContain('# Operational Context');
    expect(payload.userMessage).toContain('# User Request');
    expect(payload.systemInstruction).toContain(PROMPT_TEMPLATES.DEFAULT.objective);

    vi.restoreAllMocks();
  });
});
