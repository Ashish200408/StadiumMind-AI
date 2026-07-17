import React from 'react';
import { useCopilot } from '../hooks/useCopilot';
import { ChatHistory } from './ChatHistory';
import { ChatInput } from './ChatInput';
import { SuggestedQuestions } from './SuggestedQuestions';
import { QuickActions } from './QuickActions';
import { CopilotCapabilities } from '../types';
import { Sparkles, Trash2 } from 'lucide-react';

export const CopilotPanel: React.FC = () => {
  const {
    messages,
    isLoading,
    isStreaming,
    responseMode,
    setResponseMode,
    error,
    sendMessage,
    clearConversation,
  } = useCopilot();

  const handleSend = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)] m-4">
      <div className="flex items-center justify-between p-5 border-b border-white/10 bg-black/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] relative">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-20 blur-md animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-wide">
              Gemini Operations Copilot
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">
                Active & Ready
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={responseMode}
            onChange={(e) => setResponseMode(e.target.value as any)}
            className="bg-slate-800/80 text-xs font-semibold text-cyan-300 border border-cyan-500/30 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-cyan-500/50"
          >
            <option value="Executive Summary">Executive Summary</option>
            <option value="Detailed Analysis">Detailed Analysis</option>
          </select>
          <button
            onClick={clearConversation}
            title="Clear Conversation"
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/30"
            aria-label="Clear Conversation"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <QuickActions onSend={handleSend} disabled={isLoading || isStreaming} />

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 mx-4 mt-4 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.2)]">
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

      <ChatHistory
        messages={messages}
        isLoading={isLoading}
        isStreaming={isStreaming}
        onSend={handleSend}
      />

      {messages.length === 0 && (
        <SuggestedQuestions onSelect={handleSend} disabled={isLoading || isStreaming} />
      )}

      <ChatInput onSend={handleSend} disabled={isLoading || isStreaming} />
    </div>
  );
};
