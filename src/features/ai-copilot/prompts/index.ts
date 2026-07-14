import { CopilotCapabilities, PromptTemplate } from '../types';

export const PROMPT_TEMPLATES: Record<string, PromptTemplate> = {
  [CopilotCapabilities.EXECUTIVE_MATCH_SUMMARY]: {
    objective:
      'Provide a high-level executive summary of the current stadium operations and health.',
    requiredOutput:
      'Markdown formatted summary including an Overview, Critical Incidents, Resource Status, and Key Recommendations.',
  },
  [CopilotCapabilities.OPERATIONAL_SITUATION_REPORT]: {
    objective:
      'Generate a detailed operational situation report based on all available intelligence modules.',
    requiredOutput:
      'Markdown formatted report breaking down status by module, active alerts, and immediate actions required.',
  },
  DEFAULT: {
    objective: 'Answer the user query based ONLY on the provided operational context.',
    requiredOutput: 'Clear, concise markdown response. Distinguish facts from recommendations.',
  },
};
