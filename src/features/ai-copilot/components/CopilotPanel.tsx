import React from 'react';
import { useCopilot } from '../hooks/useCopilot';
import { ChatHistory } from './ChatHistory';
import { ChatInput } from './ChatInput';
import { SuggestedQuestions } from './SuggestedQuestions';
import { QuickActions } from './QuickActions';
import { CopilotCapabilities } from '../types';

export const CopilotPanel: React.FC = () => {
  const { messages, isLoading, error, sendMessage, clearConversation } = useCopilot();

  const handleSend = (text: string) => {
    sendMessage(text);
  };

  const handleTriggerCapability = (capability: CopilotCapabilities) => {
    sendMessage(`Generate ${capability}`, capability);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gray-950">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              ></path>
            </svg>
          </div>
          <h2 className="text-lg font-bold text-white">Gemini Operations Copilot</h2>
        </div>
        <button
          onClick={clearConversation}
          title="Clear Conversation"
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Clear Conversation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
          </svg>
        </button>
      </div>

      <QuickActions onTrigger={handleTriggerCapability} disabled={isLoading} />

      {error && (
        <div className="bg-red-900/50 border-l-4 border-red-500 p-4 m-4 rounded">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-red-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className="text-red-200 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <ChatHistory messages={messages} isLoading={isLoading} />

      {messages.length === 0 && <SuggestedQuestions onSelect={handleSend} disabled={isLoading} />}

      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
};
