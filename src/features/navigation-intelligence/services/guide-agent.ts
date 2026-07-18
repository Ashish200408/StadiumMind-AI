import { callGemini } from '../../ai-copilot/services/gemini-service';
import { CalculatedRoute, GuideAgentResponse } from '../types';

export const generateRouteExplanation = async (
  route: CalculatedRoute,
  language: string
): Promise<GuideAgentResponse> => {
  const systemInstruction = `You are a Guide Agent for MetLife Stadium navigation.
Your job is to take a calculated route (a list of nodes and times) and generate a natural language, conversational, turn-by-turn route explanation in the requested language.
Do not hallucinate directions (e.g. "turn left", "go down the stairs") unless it makes sense based on the node types, but keep it friendly and helpful.

The route details:
- Total Time: ${route.totalTime} seconds
- Route Type: ${route.type}

Segments:
${route.segments.map((s, i) => `${i + 1}. ${s.nodeName} (${s.type})`).join('\n')}

Requested Language: ${language}

Return a valid JSON object matching:
{
  "routeExplanation": string,
  "language": string
}
`;

  try {
    const prompt = `System: ${systemInstruction}\n\nJSON Output:`;
    const responseText = await callGemini(prompt);

    let jsonStr = responseText.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```/g, '').trim();
    }

    const parsed = JSON.parse(jsonStr) as GuideAgentResponse;
    return parsed;
  } catch (error) {
    console.error('Failed to generate route explanation', error);
    // Fallback response
    return {
      routeExplanation: 'Follow the highlighted path on the map to reach your destination.',
      language: 'English',
    };
  }
};
