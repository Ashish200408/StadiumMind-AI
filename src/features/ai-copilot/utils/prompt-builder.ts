import { buildAIContext } from './ai-context-builder';
import { SYSTEM_PROMPT } from '../prompts/system-prompt';
import { PROMPT_TEMPLATES } from '../prompts';
import { CopilotCapabilities, ChatMessage } from '../types';

export const buildPrompt = (
  query: string,
  messages: ChatMessage[],
  responseMode: 'Executive Summary' | 'Detailed Analysis',
  capability?: CopilotCapabilities
): string => {
  const context = buildAIContext();

  const template = capability ? PROMPT_TEMPLATES[capability] : PROMPT_TEMPLATES.DEFAULT;

  const recentMessages = messages.slice(-6); // Keep last 3 turns to fit context
  const memoryStr =
    recentMessages.length > 0
      ? recentMessages
          .map((m) => `${m.role === 'user' ? 'User' : 'Copilot'}: ${m.content}`)
          .join('\n\n')
      : 'No prior conversation.';

  const prompt = `
${SYSTEM_PROMPT}

# Objective
${template?.objective || PROMPT_TEMPLATES.DEFAULT.objective}

# Required Output
${template?.requiredOutput || PROMPT_TEMPLATES.DEFAULT.requiredOutput}

# Response Mode
The user has requested the response to be in **${responseMode}** mode. Adapt your depth accordingly.

# Operational Context (Unified Intelligence Layer)
${context || 'No operational data available.'}

# Session Memory (Recent Conversation)
${memoryStr}

# User Request
${query}
`;

  return prompt;
};
