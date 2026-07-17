import { create } from 'zustand';
import { ChatMessage, CopilotCapabilities } from '../types';
import { buildPrompt } from '../utils/prompt-builder';
import { validatePrompt, AIValidationException } from '../services/guardrail-service';
import { callGemini } from '../services/gemini-service';
import { parseResponse } from '../utils/response-parser';

interface ConversationState {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  responseMode: 'Executive Summary' | 'Detailed Analysis';
  error: string | null;
  abortController: AbortController | null;

  setResponseMode: (mode: 'Executive Summary' | 'Detailed Analysis') => void;
  sendMessage: (content: string, capability?: CopilotCapabilities) => Promise<void>;
  clearConversation: () => void;
}

export const useConversationManager = create<ConversationState>((set, get) => ({
  messages: [],
  isLoading: false,
  isStreaming: false,
  responseMode: 'Executive Summary',
  error: null,
  abortController: null,

  setResponseMode: (mode) => set({ responseMode: mode }),

  sendMessage: async (content: string, capability?: CopilotCapabilities) => {
    const { abortController, messages, responseMode } = get();

    // Abort previous if still loading
    if (abortController) {
      abortController.abort();
    }

    const newController = new AbortController();

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      content: capability ? `[${capability}] ${content}` : content,
      timestamp: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
      abortController: newController,
    }));

    try {
      const prompt = buildPrompt(content, get().messages, responseMode, capability);

      // Guardrails execution
      validatePrompt(prompt, content);

      // Network execution
      const rawResponse = await callGemini(prompt, newController.signal);

      // Parsing execution
      const parsedResponse = parseResponse(rawResponse);

      const modelMessageId = `msg-model-${Date.now()}`;

      // Setup empty message for streaming
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: modelMessageId,
            role: 'model',
            content: '',
            timestamp: new Date().toISOString(),
          },
        ],
        isLoading: false,
        isStreaming: true,
      }));

      // Simulate streaming (word by word)
      const words = parsedResponse.split(' ');
      let currentContent = '';

      for (let i = 0; i < words.length; i++) {
        if (newController.signal.aborted) {
          break;
        }
        currentContent += (i > 0 ? ' ' : '') + words[i];

        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === modelMessageId ? { ...msg, content: currentContent } : msg
          ),
        }));

        // Dynamic delay based on word length for natural feel (avg 20-50ms per word)
        await new Promise((r) => setTimeout(r, 20 + Math.random() * 30));
      }

      set({ isStreaming: false, abortController: null });
    } catch (error: any) {
      set({ isStreaming: false });
      if (error.name === 'AbortError') {
        // Silently ignore aborts
        return;
      }

      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof AIValidationException) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      set({
        isLoading: false,
        error: errorMessage,
        abortController: null,
      });
    }
  },

  clearConversation: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
    }
    set({ messages: [], error: null, isLoading: false, isStreaming: false, abortController: null });
  },
}));
