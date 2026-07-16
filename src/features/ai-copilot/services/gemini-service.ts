import { AILogMetrics } from '../types';

// Simple LRU-ish cache for exact prompts
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL_MS = 60000; // 1 minute

const generateMetricsId = () => `ai-req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const callGemini = async (prompt: string, signal?: AbortSignal): Promise<string> => {
  const reqTime = new Date().toISOString();
  const startTime = performance.now();

  const cacheKey = btoa(encodeURIComponent(prompt)).substring(0, 250);
  const cached = responseCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    logMetrics({
      id: generateMetricsId(),
      requestTimestamp: reqTime,
      responseTimestamp: new Date().toISOString(),
      processingTimeMs: performance.now() - startTime,
      promptSizeBytes: new Blob([prompt]).size,
      responseSizeBytes: new Blob([cached.response]).size,
      cacheHit: true,
    });
    return cached.response;
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured in environment variables.');
  }

  let attempt = 0;
  const maxRetries = 3;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2, // Low temperature for factual operational reporting
            },
          }),
          signal,
        }
      );

      if (response.status === 429) {
        throw new Error('RateLimit');
      }

      if (!response.ok) {
        if (response.status === 400 || response.status === 403) {
          throw new Error('InvalidKeyOrRequest');
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No candidates returned from Gemini');
      }

      const text = data.candidates[0].content.parts[0].text;

      responseCache.set(cacheKey, { response: text, timestamp: Date.now() });

      logMetrics({
        id: generateMetricsId(),
        requestTimestamp: reqTime,
        responseTimestamp: new Date().toISOString(),
        processingTimeMs: performance.now() - startTime,
        promptSizeBytes: new Blob([prompt]).size,
        responseSizeBytes: new Blob([text]).size,
        cacheHit: false,
      });

      return text;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw error;
      }

      if (error.message === 'InvalidKeyOrRequest') {
        logErrorMetrics(reqTime, startTime, prompt, 'InvalidKeyOrRequest');
        throw new Error('Invalid or expired Gemini API key. Please contact system administrator.');
      }

      attempt++;

      if (attempt >= maxRetries) {
        logErrorMetrics(reqTime, startTime, prompt, error.message);
        throw new Error(
          'Failed to communicate with AI Service after multiple attempts. Please try again later.'
        );
      }

      // Exponential backoff
      await new Promise((res) => setTimeout(res, Math.pow(2, attempt) * 1000));
    }
  }

  throw new Error('Unexpected execution path in GeminiService');
};

import { logger } from '../../../utils/logger';

const logMetrics = (metrics: AILogMetrics) => {
  logger.log(
    'gemini_request',
    `Gemini API Request: ${metrics.cacheHit ? 'Cache Hit' : 'Cache Miss'}`,
    metrics
  );
};

const logErrorMetrics = (reqTime: string, startTime: number, prompt: string, errorCat: string) => {
  logMetrics({
    id: generateMetricsId(),
    requestTimestamp: reqTime,
    responseTimestamp: new Date().toISOString(),
    processingTimeMs: performance.now() - startTime,
    promptSizeBytes: new Blob([prompt]).size,
    responseSizeBytes: 0,
    cacheHit: false,
    errorCategory: errorCat,
  });
};
