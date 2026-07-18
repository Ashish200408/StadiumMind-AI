import { callGemini } from '../../ai-copilot/services/gemini-service';
import { IntentAgentResponse } from '../types';
export const resolveNavigationIntent = async (
  userInput: string,
  availableNodeNames: string[]
): Promise<IntentAgentResponse> => {
  const systemInstruction = `You are an Intent Agent for MetLife Stadium navigation.
Your job is to parse a fan's natural language query into a structured JSON response.

Available node names for origins/destinations: ${availableNodeNames.join(', ')}

Valid targetAmenityType values: 'zone' | 'entrance' | 'exit' | 'food_court' | 'washroom' | 'medical' | 'parking' | 'transport' | 'emergency_exit'

Determine the following from the user input:
1. startNodeId (string | null): The exact node ID or name matching the user's location. If ambiguous, set to null.
2. targetNodeId (string | null): The exact node ID or name matching the user's destination. Set to null if they asked for a general amenity.
3. targetAmenityType (NodeType | null): The type of amenity requested (e.g. 'washroom', 'food_court'). Set to null if they specified an exact location.
4. accessibilityRequired (boolean): True if they mentioned wheelchairs, stairs, elevators, accessible, etc.
5. language (string): The language of the query (e.g. 'English', 'Spanish').
6. isAmbiguous (boolean): True if you cannot confidently determine the origin.
7. clarifyingQuestion (string): A short question to ask the user if isAmbiguous is true.

Respond ONLY with valid JSON matching this interface:
{
  "startNodeId": string | null,
  "targetNodeId": string | null,
  "targetAmenityType": string | null,
  "accessibilityRequired": boolean,
  "language": string,
  "isAmbiguous": boolean,
  "clarifyingQuestion": string | undefined
}`;

  try {
    const prompt = `System: ${systemInstruction}\n\nUser: ${userInput}\n\nJSON Output:`;
    const responseText = await callGemini(prompt);

    // Extract JSON block if it's wrapped in markdown
    let jsonStr = responseText.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```/g, '').trim();
    }

    const parsed = JSON.parse(jsonStr) as IntentAgentResponse;
    return parsed;
  } catch (error) {
    console.error('Failed to parse intent', error);
    // Fallback response
    return {
      startNodeId: null,
      targetNodeId: null,
      targetAmenityType: null,
      accessibilityRequired: false,
      language: 'English',
      isAmbiguous: true,
      clarifyingQuestion:
        'I am sorry, I did not understand that. Could you tell me where you are and where you would like to go?',
    };
  }
};
