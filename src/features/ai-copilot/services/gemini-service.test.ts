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

  it('throws an error on 401 Unauthorized', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'dummy-key');

    // Mock discoverModel fetch
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

    // Mock the generateContent fetch to fail with 401
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: () => Promise.resolve({ error: { message: 'Invalid API key' } }),
    });

    const payload: GeminiStreamPayload = {
      userMessage: 'Hello',
      systemInstruction: 'Test',
      messages: [],
    };
    const abortController = new AbortController();

    await expect(callGeminiStream(payload, abortController.signal, vi.fn())).rejects.toThrow(
      'Invalid API Key: Unauthorized.'
    );
  });

  it('parses streamed data chunks correctly', async () => {
    vi.stubEnv('VITE_GEMINI_API_KEY', 'dummy-key');

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          models: [
            {
              name: 'models/gemini-3.5-flash',
              supportedGenerationMethods: ['streamGenerateContent'],
            },
          ],
        }),
    });

    const encoder = new TextEncoder();
    const chunk1 = encoder.encode(
      'data: {"candidates": [{"content": {"parts": [{"text": "Hello "}]}}]}\n'
    );
    const chunk2 = encoder.encode(
      'data: {"candidates": [{"content": {"parts": [{"text": "World"}]}}]}\n'
    );

    let chunkIndex = 0;
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => ({
          read: vi.fn().mockImplementation(() => {
            if (chunkIndex === 0) {
              chunkIndex++;
              return Promise.resolve({ done: false, value: chunk1 });
            }
            if (chunkIndex === 1) {
              chunkIndex++;
              return Promise.resolve({ done: false, value: chunk2 });
            }
            return Promise.resolve({ done: true });
          }),
          releaseLock: vi.fn(),
        }),
      },
    });

    const payload: GeminiStreamPayload = {
      userMessage: 'Hi',
      systemInstruction: 'Test',
      messages: [],
    };
    const abortController = new AbortController();
    const onChunk = vi.fn();

    const result = await callGeminiStream(payload, abortController.signal, onChunk);

    expect(onChunk).toHaveBeenCalledWith('Hello ');
    expect(onChunk).toHaveBeenCalledWith('Hello World');
    expect(result).toBe('Hello World');
  });
});
