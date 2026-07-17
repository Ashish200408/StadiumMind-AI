import { AILogMetrics } from '../types';
import { generateGracefulFallback } from './local-fallback-service';

// Simple LRU-ish cache for exact prompts
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_TTL_MS = 60000; // 1 minute

const generateMetricsId = () => `ai-req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

let activeModelCache: string | null = null;

const discoverModel = async (apiKey: string): Promise<string> => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Failed to fetch models: HTTP ${response.status}: ${errorData?.error?.message || 'Unknown API Error'}`
    );
  }

  const data = await response.json();
  if (!data.models || !Array.isArray(data.models)) {
    throw new Error(`Invalid models API response: ${JSON.stringify(data)}`);
  }

  const supportedModels = data.models.filter(
    (m: any) =>
      m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')
  );

  if (supportedModels.length === 0) {
    throw new Error(
      `No models supporting generateContent found. API Response: ${JSON.stringify(data)}`
    );
  }

  // Sort descending by name to prioritize newer versions (e.g. gemini-3.5-flash > gemini-2.5-flash)
  supportedModels.sort((a: any, b: any) => b.name.localeCompare(a.name));

  const flashModels = supportedModels.filter((m: any) => m.name.includes('flash'));

  if (flashModels.length > 0) {
    return flashModels[0].name;
  }

  return supportedModels[0].name;
};

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

  if (!activeModelCache) {
    activeModelCache = await discoverModel(apiKey);
    console.log(`Selected Gemini Model: ${activeModelCache}`);
  }

  let attempt = 0;
  const maxRetries = 3;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/${activeModelCache}:generateContent?key=${apiKey}`,
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

        // Capture specific error from Google if possible
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `HTTP ${response.status}: ${errorData?.error?.message || 'Unknown API Error'}`
        );
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

      if (error.message === 'RateLimit') {
        logErrorMetrics(reqTime, startTime, prompt, 'RateLimit');
        return generateGracefulFallback(prompt);
      }

      attempt++;

      if (attempt >= maxRetries) {
        logErrorMetrics(reqTime, startTime, prompt, error.message);
        return generateGracefulFallback(prompt);
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
