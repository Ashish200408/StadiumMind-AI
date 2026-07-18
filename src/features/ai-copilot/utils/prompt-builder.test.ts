import { describe, it, expect } from 'vitest';
import { buildPromptPayload } from './prompt-builder';

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
});
