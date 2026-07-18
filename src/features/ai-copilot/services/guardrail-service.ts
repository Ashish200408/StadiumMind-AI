export class AIValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIValidationException';
  }
}

export const validatePrompt = (prompt: string, userQuery: string) => {
  // 1. Ensure context is present ONLY IF it's operational. We can skip this check
  // because the new intent detector handles selective context injection.
  // We'll leave the prompt injection check active.

  // 2. Detect and block prompt injection attempts (basic heuristic)
  const injectionKeywords = [
    'ignore previous',
    'system prompt',
    'bypass',
    'override',
    'pretend',
    'you are now',
  ];
  const lowerQuery = userQuery.toLowerCase();

  for (const keyword of injectionKeywords) {
    if (lowerQuery.includes(keyword)) {
      throw new AIValidationException(
        'I cannot fulfill requests that attempt to override operational safety protocols.'
      );
    }
  }

  // 3. Removed off-topic check to allow General Intent (e.g. jokes, trivia, coding)

  return true;
};
