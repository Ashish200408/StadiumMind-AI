import { describe, it, expect } from 'vitest';
import { detectIntent } from './intent-detector';

describe('Intent Detector', () => {
  it('detects Executive intent from "report" or "executive"', () => {
    expect(detectIntent('Generate an executive report for the CEO')).toBe('Executive_Reports');
  });

  it('detects Emergency intent from "fire" or "incident"', () => {
    expect(detectIntent('Show me active incidents')).toBe('Emergency_Response');
  });

  it('defaults to General intent for unrelated queries', () => {
    expect(detectIntent('Write a joke about soccer')).toBe('General');
  });
});
