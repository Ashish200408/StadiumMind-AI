import { create } from 'zustand';
import { ChatMessage, CopilotCapabilities } from '../types';
import { buildPrompt } from '../utils/prompt-builder';
import { validatePrompt, AIValidationException } from '../services/guardrail-service';
import { callGemini } from '../services/gemini-service';
import { parseResponse } from '../utils/response-parser';

interface ConversationState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  abortController: AbortController | null;

  sendMessage: (content: string, capability?: CopilotCapabilities) => Promise<void>;
  clearConversation: () => void;
}

export const useConversationManager = create<ConversationState>((set, get) => ({
  messages: [],
  isLoading: false,
  error: null,
  abortController: null,

  sendMessage: async (content: string, capability?: CopilotCapabilities) => {
    const { abortController } = get();

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
      const prompt = buildPrompt(content, capability);

      // Guardrails execution
      validatePrompt(prompt, content);

      // Network execution
      const rawResponse = await callGemini(prompt, newController.signal);

      // Parsing execution
      const parsedResponse = parseResponse(rawResponse);

      const modelMessage: ChatMessage = {
        id: `msg-model-${Date.now()}`,
        role: 'model',
        content: parsedResponse,
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        messages: [...state.messages, modelMessage],
        isLoading: false,
        abortController: null,
      }));
    } catch (error: any) {
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
    set({ messages: [], error: null, isLoading: false, abortController: null });
  },
}));
