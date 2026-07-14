export class AIValidationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIValidationException';
  }
}

export const validatePrompt = (prompt: string, userQuery: string) => {
  // 1. Ensure context is present (not empty or just "No operational data")
  if (!prompt.includes('scores') && prompt.includes('No operational data available')) {
    throw new AIValidationException("I don't have enough operational data to answer confidently.");
  }

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

  // 3. Prevent unsupported requests outside stadium operations (basic heuristic)
  const offTopicKeywords = ['write a poem', 'tell me a joke', 'recipe', 'code a', 'how to hack'];
  for (const keyword of offTopicKeywords) {
    if (lowerQuery.includes(keyword)) {
      throw new AIValidationException(
        'I am strictly an Operational Decision Support Assistant for the stadium. I cannot assist with that request.'
      );
    }
  }

  return true;
};
