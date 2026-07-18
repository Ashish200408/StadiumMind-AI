import { describe, it, expect, vi, beforeEach } from 'vitest';
import { callGeminiStream, GeminiStreamPayload } from './gemini-service';

// Ensure fetch is always a mocked function
global.fetch = vi.fn();

describe('Gemini Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws an error if no API key is found', async () => {
    // Override env for this test
    vi.stubEnv('VITE_GEMINI_API_KEY', '');
    const payload: GeminiStreamPayload = {
      userMessage: 'Hello',
      systemInstruction: 'Test',
      messages: [],
    };
    const abortController = new AbortController();

    await expect(callGeminiStream(payload, abortController.signal, vi.fn())).rejects.toThrow(
      'VITE_GEMINI_API_KEY is not configured in environment variables.'
    );
  });

  it('attempts to call the Gemini API via fetch', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'dummy-key');

    // Mock the discoverModel fetch
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          models: [
            {
              name: 'models/gemini-3.5-flash',
              supportedGenerationMethods: ['generateContent', 'streamGenerateContent'],
            },
          ],
        }),
    });

    // Mock the actual generateContent fetch
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => ({
          read: vi.fn().mockResolvedValueOnce({ done: true }),
          releaseLock: vi.fn(),
        }),
      },
    });

    const payload: GeminiStreamPayload = {
      userMessage: 'Hello',
      systemInstruction: 'Test',
      messages: [],
    };

    const abortController = new AbortController();
    const onChunk = vi.fn();

    await callGeminiStream(payload, abortController.signal, onChunk);

    // fetch should be called twice: once for discover, once for streamGenerateContent
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
