import { create } from 'zustand';
import { ChatMessage, CopilotCapabilities } from '../types';
import { buildPromptPayload } from '../utils/prompt-builder';
import { validatePrompt, AIValidationException } from '../services/guardrail-service';
import { callGeminiStream } from '../services/gemini-service';
import { parseResponse } from '../utils/response-parser';
import { detectIntent } from '../utils/intent-detector';

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
      const intent = detectIntent(content);
      const payload = buildPromptPayload(content, responseMode, intent, capability);

      // Guardrails execution
      validatePrompt(payload.userMessage, content);

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

      // Network execution with true streaming
      await callGeminiStream(
        {
          systemInstruction: payload.systemInstruction,
          messages: messages, // History
          userMessage: payload.userMessage,
        },
        newController.signal,
        (chunk: string) => {
          const parsed = parseResponse(chunk);
          set((state) => ({
            messages: state.messages.map((msg) =>
              msg.id === modelMessageId ? { ...msg, content: parsed } : msg
            ),
          }));
        }
      );

      set({ isStreaming: false, abortController: null });
    } catch (error: any) {
      set({ isStreaming: false });
      if (error.name === 'AbortError') {
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
