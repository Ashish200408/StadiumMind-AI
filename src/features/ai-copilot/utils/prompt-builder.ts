import { buildAIContext } from './ai-context-builder';
import { SYSTEM_PROMPT } from '../prompts/system-prompt';
import { PROMPT_TEMPLATES } from '../prompts';
import { CopilotCapabilities } from '../types';

export const buildPrompt = (query: string, capability?: CopilotCapabilities): string => {
  const context = buildAIContext();

  const template = capability ? PROMPT_TEMPLATES[capability] : PROMPT_TEMPLATES.DEFAULT;

  const prompt = `
${SYSTEM_PROMPT}

# Objective
${template?.objective || PROMPT_TEMPLATES.DEFAULT.objective}

# Required Output
${template?.requiredOutput || PROMPT_TEMPLATES.DEFAULT.requiredOutput}

# Operational Context (Unified Intelligence Layer)
${context || 'No operational data available.'}

# User Request
${query}
`;

  return prompt;
};
