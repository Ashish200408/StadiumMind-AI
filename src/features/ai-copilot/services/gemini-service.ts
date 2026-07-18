import { AILogMetrics } from '../types';

const generateMetricsId = () => `ai-req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const PREFERRED_MODELS = [
  'models/gemini-3.5-flash',
  'models/gemini-flash-latest',
  'models/gemini-pro-latest',
  'models/gemini-3.1-flash-lite',
  'models/gemini-3.1-pro-preview',
];

export interface ActiveModelInfo {
  name: string;
  supportedMethods: string[];
}

let activeModelCache: ActiveModelInfo | null = null;
let knownModelsCache: any[] = [];
export const blacklistedModels = new Set<string>();

const discoverModel = async (apiKey: string): Promise<ActiveModelInfo> => {
  const envModel = import.meta.env.VITE_GEMINI_MODEL;

  if (knownModelsCache.length === 0) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
      );
      if (response.ok) {
        const data = await response.json();
        const rawModels = data.models || [];

        knownModelsCache = rawModels.filter((m: any) => {
          if (!m.supportedGenerationMethods?.includes('generateContent')) return false;

          const name = m.name.toLowerCase();

          // Do not filter out explicitly preferred models
          if (PREFERRED_MODELS.includes(m.name)) return true;

          if (
            name.includes('preview') ||
            name.includes('image') ||
            name.includes('tts') ||
            name.includes('embedding') ||
            name.includes('robotics') ||
            name.includes('computer-use') ||
            name.includes('omni')
          ) {
            return false;
          }
          return true;
        });
      }
    } catch (e) {
      console.warn('Failed to fetch models list, will fallback to default preferred model', e);
    }
  }

  const findModelInfo = (modelName: string): ActiveModelInfo | null => {
    const modelData = knownModelsCache.find((m) => m.name === modelName);
    if (modelData) {
      return {
        name: modelName,
        supportedMethods: modelData.supportedGenerationMethods || ['generateContent'],
      };
    }
    return null;
  };

  if (envModel && !blacklistedModels.has(envModel)) {
    console.log(`Selected Gemini Model (from env): ${envModel}`);
    return (
      findModelInfo(envModel) || {
        name: envModel,
        supportedMethods: ['generateContent', 'streamGenerateContent'],
      }
    );
  }

  const supportedModelNames = knownModelsCache.map((m: any) => m.name);
  if (supportedModelNames.length > 0) {
    console.log('Supported Models:', supportedModelNames.join(', '));
  }

  for (const model of PREFERRED_MODELS) {
    if (blacklistedModels.has(model)) continue;

    if (supportedModelNames.includes(model)) {
      const info = findModelInfo(model)!;
      console.log(`Selected Gemini Model: ${info.name}`);
      return info;
    } else if (knownModelsCache.length > 0) {
      console.log(`Failed Model: ${model}`);
      console.log(`Reason: Model not found in supported models list.`);
    }
  }

  // Fallback to any stable flash model
  const stableFlash = knownModelsCache.find(
    (m: any) => m.name.includes('flash') && !blacklistedModels.has(m.name)
  );
  if (stableFlash) {
    console.log(`Selected Gemini Model (stable fallback): ${stableFlash.name}`);
    return {
      name: stableFlash.name,
      supportedMethods: stableFlash.supportedGenerationMethods || ['generateContent'],
    };
  }

  // Final fallback skipping blacklist if possible
  const defaultFallback =
    PREFERRED_MODELS.find((m) => !blacklistedModels.has(m)) || PREFERRED_MODELS[0];
  console.log(`Selected Gemini Model (default fallback): ${defaultFallback}`);
  return { name: defaultFallback, supportedMethods: ['generateContent', 'streamGenerateContent'] };
};

export interface GeminiStreamPayload {
  systemInstruction: string;
  messages: { role: 'user' | 'model'; content: string }[];
  userMessage: string;
}

export const callGeminiStream = async (
  payload: GeminiStreamPayload,
  signal: AbortSignal,
  onChunk: (text: string) => void
): Promise<string> => {
  const reqTime = new Date().toISOString();
  const startTime = performance.now();

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not configured in environment variables.');
  }

  if (!activeModelCache) {
    activeModelCache = await discoverModel(apiKey);
  }

  let attempt = 0;
  const maxRetries = 3;
  let endpointMode: 'stream' | 'standard' = activeModelCache.supportedMethods.includes(
    'streamGenerateContent'
  )
    ? 'stream'
    : 'standard';

  while (attempt < maxRetries) {
    try {
      const contents = payload.messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));
      contents.push({ role: 'user', parts: [{ text: payload.userMessage }] });

      const requestUrl =
        endpointMode === 'stream'
          ? `https://generativelanguage.googleapis.com/v1beta/${activeModelCache!.name}:streamGenerateContent?alt=sse&key=${apiKey}`
          : `https://generativelanguage.googleapis.com/v1beta/${activeModelCache!.name}:generateContent?key=${apiKey}`;

      console.log('Gemini API Request:', {
        selectedModel: activeModelCache!.name,
        supportedMethods: activeModelCache!.supportedMethods,
        chosenEndpoint: endpointMode,
      });

      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: payload.systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.2,
          },
        }),
        signal,
      });

      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch (e) {
          // ignore parsing error
        }

        const errorMessage = errorData?.error?.message || 'Unknown API Error';

        console.error('Gemini API Error:', {
          selectedModel: activeModelCache!.name,
          requestUrl: requestUrl.replace(apiKey, 'REDACTED'),
          httpStatus: response.status,
          geminiErrorMessage: errorMessage,
          responseBody: errorData,
          retryCount: attempt,
          fallbackUsed: false,
        });

        if (response.status === 401) {
          throw new Error('Invalid API Key: Unauthorized.');
        } else if (response.status === 403) {
          throw new Error('Permission Denied: Ensure the API key has the correct scope.');
        } else if (response.status === 404) {
          const isDeprecated = errorMessage.includes('no longer available to new users');

          if (isDeprecated) {
            console.log(`Rejected Model: ${activeModelCache!.name}`);
            console.log(
              `Reason: Model is deprecated or no longer available to new users (HTTP 404).`
            );
            blacklistedModels.add(activeModelCache!.name);
            activeModelCache = null;

            // Re-discover ignoring the blacklisted model
            const nextInfo = await discoverModel(apiKey);
            console.log(`Next fallback model: ${nextInfo.name}`);
            activeModelCache = nextInfo;
            endpointMode = nextInfo.supportedMethods.includes('streamGenerateContent')
              ? 'stream'
              : 'standard';
            attempt++;
            continue;
          }

          if (endpointMode === 'stream') {
            console.log(`Endpoint 404 for streamGenerateContent. Falling back to generateContent.`);
            endpointMode = 'standard';
            attempt++;
            continue; // Try again with standard endpoint
          }

          console.log(`Rejected Model: ${activeModelCache!.name}`);
          console.log(`Reason: Model not found (HTTP 404).`);
          blacklistedModels.add(activeModelCache!.name); // Treat any 404 as unavailable to avoid loops
          activeModelCache = null;

          const nextInfo = await discoverModel(apiKey);
          console.log(`Next fallback model: ${nextInfo.name}`);
          activeModelCache = nextInfo;
          endpointMode = nextInfo.supportedMethods.includes('streamGenerateContent')
            ? 'stream'
            : 'standard';
          attempt++;
          continue;
        } else if (response.status === 429) {
          throw new Error('Gemini API quota exceeded.');
        } else if (response.status >= 500) {
          throw new Error(`Internal API Error (HTTP ${response.status}): ${errorMessage}`);
        } else {
          throw new Error(`HTTP ${response.status}: ${errorMessage}`);
        }
      }

      let fullText = '';

      if (endpointMode === 'standard') {
        const data = await response.json();
        console.log('Gemini API Standard Response:', {
          selectedModel: activeModelCache!.name,
          supportedMethods: activeModelCache!.supportedMethods,
          chosenEndpoint: endpointMode,
          httpStatus: response.status,
          responseBody: data,
        });
        if (data.candidates && data.candidates.length > 0) {
          fullText = data.candidates[0].content?.parts?.[0]?.text || '';
          onChunk(fullText); // Single chunk update
        } else {
          throw new Error('No candidates returned from Gemini');
        }
      } else {
        if (!response.body) {
          throw new Error('No response body from stream');
        }

        console.log('Gemini API Stream Response:', {
          selectedModel: activeModelCache!.name,
          supportedMethods: activeModelCache!.supportedMethods,
          chosenEndpoint: endpointMode,
          httpStatus: response.status,
          responseBody: '<streaming>',
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim();
              if (!dataStr) continue;
              try {
                const data = JSON.parse(dataStr);
                if (data.candidates && data.candidates.length > 0) {
                  const textChunk = data.candidates[0].content?.parts?.[0]?.text || '';
                  fullText += textChunk;
                  onChunk(fullText);
                }
              } catch (e) {
                console.warn('Error parsing SSE chunk:', e);
              }
            }
          }
        }
      }

      logMetrics({
        id: generateMetricsId(),
        requestTimestamp: reqTime,
        responseTimestamp: new Date().toISOString(),
        processingTimeMs: performance.now() - startTime,
        promptSizeBytes: new Blob([JSON.stringify(contents)]).size,
        responseSizeBytes: new Blob([fullText]).size,
        cacheHit: false,
      });

      return fullText;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw error;
      }

      if (
        error.message.includes('Invalid API Key') ||
        error.message.includes('Permission Denied') ||
        error.message.includes('Model Not Found') ||
        error.message.includes('Gemini API quota exceeded') ||
        error.message.includes('Internal API Error') ||
        error.message.includes('HTTP ')
      ) {
        logErrorMetrics(reqTime, startTime, payload.userMessage, error.message);
        throw error;
      }

      console.error('Gemini API Network/Generic Error:', {
        selectedModel: activeModelCache?.name,
        errorMessage: error.message,
        retryCount: attempt,
        fallbackUsed: false,
      });

      attempt++;

      if (attempt >= maxRetries) {
        logErrorMetrics(reqTime, startTime, payload.userMessage, error.message);
        throw new Error(`Network Failure or Unexpected Error: ${error.message}`);
      }

      await new Promise((res) => setTimeout(res, Math.pow(2, attempt) * 1000));
    }
  }

  throw new Error('Unexpected execution path in GeminiService');
};

export const callGemini = async (prompt: string, signal?: AbortSignal): Promise<string> => {
  const payload: GeminiStreamPayload = {
    systemInstruction: 'You are an intelligent operational assistant.',
    messages: [],
    userMessage: prompt,
  };

  // Create a dummy signal if none provided
  const abortController = new AbortController();
  const activeSignal = signal || abortController.signal;

  let result = '';
  await callGeminiStream(payload, activeSignal, (chunk) => {
    result = chunk; // callGeminiStream accumulates the full text and passes it to onChunk
  });

  return result;
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
