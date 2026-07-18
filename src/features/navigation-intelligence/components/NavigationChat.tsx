import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { resolveNavigationIntent } from '../services/intent-agent';
import { generateRouteExplanation } from '../services/guide-agent';
import { calculateRoute } from '../services/routing-service';
import { initializeStadiumGraph } from '../services/graph-service';
import { Send, Map, Loader2 } from 'lucide-react';

export const NavigationChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; text: string }[]>(
    []
  );

  // In a real app, this graph would come from a global store or context
  const [graph] = useState(() => initializeStadiumGraph());

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setChatHistory((prev) => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const nodeNames = Object.values(graph.nodes).map((n) => n.name);
      const intent = await resolveNavigationIntent(userMessage, nodeNames);

      if (intent.isAmbiguous && intent.clarifyingQuestion) {
        setChatHistory((prev) => [
          ...prev,
          { role: 'assistant', text: intent.clarifyingQuestion! },
        ]);
        setLoading(false);
        return;
      }

      // Find the start node ID if name was returned instead of ID, or fallback to entrance_main
      let startNodeId = 'entrance_main';
      if (intent.startNodeId) {
        const matchingNode = Object.values(graph.nodes).find(
          (n) => n.id === intent.startNodeId || n.name === intent.startNodeId
        );
        if (matchingNode) startNodeId = matchingNode.id;
      }

      // Find target node ID based on ID, Name, or Amenity Type
      let targetNodeId: string | null = null;
      if (intent.targetNodeId) {
        const matchingNode = Object.values(graph.nodes).find(
          (n) => n.id === intent.targetNodeId || n.name === intent.targetNodeId
        );
        if (matchingNode) targetNodeId = matchingNode.id;
      } else if (intent.targetAmenityType) {
        // Find nearest amenity of that type
        // For simplicity in this chat interface, just find the first one
        const matchingNode = Object.values(graph.nodes).find(
          (n) => n.type === intent.targetAmenityType
        );
        if (matchingNode) targetNodeId = matchingNode.id;
      }

      if (!targetNodeId) {
        setChatHistory((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: "I couldn't identify your destination. Could you be more specific?",
          },
        ]);
        setLoading(false);
        return;
      }

      const route = calculateRoute(
        startNodeId,
        targetNodeId,
        graph.nodes,
        graph.edges,
        'shortest',
        { congestionScore: 0, accessibilityRequired: intent.accessibilityRequired }
      );

      if (!route) {
        setChatHistory((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: "I'm sorry, I couldn't find a path to your destination with those constraints.",
          },
        ]);
        setLoading(false);
        return;
      }

      const guide = await generateRouteExplanation(route, intent.language);

      setChatHistory((prev) => [...prev, { role: 'assistant', text: guide.routeExplanation }]);
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', text: 'Sorry, I encountered an error while finding your route.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto h-[600px] flex flex-col bg-white/5 border-white/10 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="w-5 h-5 text-emerald-400" />
          Smart Stadium Navigation
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden p-0 relative">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex justify-start">
            <div className="bg-slate-800 text-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%] border border-white/10">
              Welcome to MetLife Stadium! Ask me for directions. (e.g. "I'm at the Main Entrance,
              where is the nearest wheelchair-accessible washroom?")
            </div>
          </div>

          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-emerald-600/80 text-white rounded-tr-sm'
                    : 'bg-slate-800 text-white rounded-tl-sm border border-white/10'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-white rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%] border border-white/10 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-slate-900/50 mt-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Where are you going?"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              disabled={loading}
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
