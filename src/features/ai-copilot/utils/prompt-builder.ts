import { buildAIContext } from './ai-context-builder';
import { SYSTEM_PROMPT } from '../prompts/system-prompt';
import { PROMPT_TEMPLATES } from '../prompts';
import { CopilotCapabilities } from '../types';
import { AIIntent } from './intent-detector';

export interface PromptPayload {
  systemInstruction: string;
  userMessage: string;
}

export const buildPromptPayload = (
  query: string,
  responseMode: 'Executive Summary' | 'Detailed Analysis',
  intent: AIIntent,
  capability?: CopilotCapabilities
): PromptPayload => {
  const context = buildAIContext(intent);

  const template = capability ? PROMPT_TEMPLATES[capability] : PROMPT_TEMPLATES.DEFAULT;

  const systemInstruction = `
${SYSTEM_PROMPT}

# Objective
${template?.objective || PROMPT_TEMPLATES.DEFAULT.objective}

# Required Output
${template?.requiredOutput || PROMPT_TEMPLATES.DEFAULT.requiredOutput}

# Response Mode
The user has requested the response to be in **${responseMode}** mode. Adapt your depth accordingly.
`.trim();

  let userMessage = query;

  if (context) {
    userMessage = `
# Operational Context
${context}

# User Request
${query}
    `.trim();
  }

  return { systemInstruction, userMessage };
};
