import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Sparkles, Bot, User, ArrowRight } from 'lucide-react';
import { useIntelligenceCoreStore } from '../../intelligence-core/store/intelligence-core-store';

interface ChatHistoryProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming?: boolean;
}

const renderMarkdown = (text: string) => {
  // Ultra-lightweight markdown parser for safe basic rendering

  // Split into lines
  const lines = text.split('\n');
  let inList = false;
  let inTable = false;

  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let tableRows: React.ReactNode[] = [];

  const flushList = () => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul className="list-disc pl-5 mb-4" key={`ul-${elements.length}`}>
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushTable = () => {
    if (inTable && tableRows.length > 0) {
      elements.push(
        <div className="overflow-x-auto mb-4" key={`table-${elements.length}`}>
          <table className="min-w-full divide-y divide-gray-700 bg-gray-800 rounded-lg overflow-hidden">
            <tbody className="divide-y divide-gray-700">{tableRows}</tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  const parseInline = (line: string) => {
    // Basic bold
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    // Headings
    if (line.startsWith('# ')) {
      flushList();
      flushTable();
      elements.push(
        <h1 key={index} className="text-2xl font-bold mt-4 mb-2">
          {parseInline(line.substring(2))}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      flushList();
      flushTable();
      elements.push(
        <h2 key={index} className="text-xl font-bold mt-4 mb-2">
          {parseInline(line.substring(3))}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      flushList();
      flushTable();
      elements.push(
        <h3 key={index} className="text-lg font-bold mt-3 mb-2">
          {parseInline(line.substring(4))}
        </h3>
      );
    }
    // Lists
    else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      flushTable();
      inList = true;
      listItems.push(
        <li key={index} className="mb-1">
          {parseInline(line.substring(2))}
        </li>
      );
    }
    // Tables (Basic support for | Col | Col |)
    else if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      flushList();
      inTable = true;
      const cells = line.split('|').filter((c) => c.trim() !== '');
      // Check if it's a separator row (---)
      if (cells[0].includes('---')) return;

      tableRows.push(
        <tr key={index}>
          {cells.map((cell, i) => (
            <td
              key={i}
              className="px-4 py-2 text-sm text-gray-300 border-r border-gray-700 last:border-0"
            >
              {parseInline(cell.trim())}
            </td>
          ))}
        </tr>
      );
    }
    // Empty lines
    else if (line.trim() === '') {
      flushList();
      flushTable();
    }
    // Paragraphs
    else {
      flushList();
      flushTable();
      elements.push(
        <p key={index} className="mb-2 leading-relaxed">
          {parseInline(line)}
        </p>
      );
    }
  });

  flushList();
  flushTable();

  return elements;
};

export const ChatHistory: React.FC<ChatHistoryProps & { onSend?: (text: string) => void }> = ({
  messages,
  isLoading,
  isStreaming,
  onSend,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { unifiedData } = useIntelligenceCoreStore();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getDynamicFollowUps = (messageText: string) => {
    if (!unifiedData) return [];

    const followUps: string[] = [];
    const health = unifiedData.overallScores.overallStadiumHealth;
    const isEmergency =
      messageText.toLowerCase().includes('critical') || messageText.toLowerCase().includes('risk');

    if (isEmergency) {
      followUps.push('Generate Emergency Response Plan');
      followUps.push('Explain Current Risks');
    } else {
      followUps.push('Predict Next 30 Minutes');
    }

    if (health < 80) {
      followUps.push('Recommend Resource Allocation');
    } else {
      followUps.push('Show Crowd Forecast');
    }

    if (messageText.includes('Transport') || messageText.includes('Mobility')) {
      followUps.push('Analyze Transport Status');
    }

    return followUps.slice(0, 3); // Return top 3
  };

  const getActiveModules = () => {
    if (!unifiedData) return ['Simulation Engine', 'Intelligence Core'];
    const modules = ['Simulation Engine', 'Intelligence Core'];
    if (unifiedData.globalAlerts.some((a) => a.severity === 'Critical'))
      modules.push('Active Incident Feed');
    if (unifiedData.overallScores.overallMobilityScore < 80) modules.push('Mobility Intelligence');
    if (unifiedData.modules['Crowd Intelligence']?.healthScore < 80)
      modules.push('Crowd Intelligence');
    return modules;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full p-8 text-center bg-black/20">
        <div className="w-24 h-24 mb-8 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-cyan-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <Bot className="w-12 h-12 text-cyan-400 relative z-10" />
        </div>
        <h3 className="text-2xl font-black text-white mb-3 tracking-tight">
          AI Operations Copilot
        </h3>
        <p className="max-w-md text-slate-400 leading-relaxed text-sm font-medium">
          I am connected to the <span className="text-cyan-400">Unified Intelligence Layer</span>. I
          can analyze situations, summarize operations, and recommend actions.
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar bg-black/20"
      aria-live="polite"
      aria-atomic="false"
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div className="flex items-end gap-3 max-w-[85%]">
            {msg.role !== 'user' && (
              <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.2)] shrink-0 mb-5">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
            )}
            <div
              className={`rounded-2xl p-5 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-br-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] border border-cyan-400/20'
                  : 'bg-black/60 text-slate-200 rounded-bl-sm border border-white/10 backdrop-blur-xl shadow-lg'
              }`}
              aria-label={`${msg.role === 'user' ? 'You said:' : 'Copilot says:'}`}
            >
              {msg.role === 'user' ? (
                <p className="whitespace-pre-wrap font-medium">{msg.content}</p>
              ) : (
                <div className="relative">
                  <div className="text-sm prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-white prose-a:text-cyan-400">
                    {renderMarkdown(msg.content)}
                    {isStreaming && msg.id === messages[messages.length - 1].id && (
                      <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse align-middle"></span>
                    )}
                  </div>

                  {!isStreaming && msg.id === messages[messages.length - 1].id && (
                    <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
                        <Bot className="w-3 h-3 text-cyan-500" />
                        <span>Analysis Based On:</span>
                        {getActiveModules().map((mod) => (
                          <span
                            key={mod}
                            className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300"
                          >
                            {mod}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleCopy(msg.content)}
                          className="px-3 py-1.5 bg-black/40 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 rounded-lg text-xs font-medium text-slate-300 transition-colors"
                        >
                          Copy Response
                        </button>
                      </div>

                      {/* Dynamic Follow Ups */}
                      {onSend && (
                        <div className="pt-2 flex flex-col gap-2">
                          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                            Suggested Follow-ups
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {getDynamicFollowUps(msg.content).map((followUp) => (
                              <button
                                key={followUp}
                                onClick={() => onSend(followUp)}
                                className="px-3 py-1.5 bg-cyan-900/20 hover:bg-cyan-900/40 border border-cyan-500/20 hover:border-cyan-500/50 rounded-lg text-xs font-medium text-cyan-300 transition-colors flex items-center gap-1.5"
                              >
                                {followUp} <ArrowRight className="w-3 h-3 opacity-70" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
              <span
                className={`text-[10px] font-bold tracking-widest uppercase block mt-3 ${msg.role === 'user' ? 'text-cyan-100/70 text-right' : 'text-slate-500'}`}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-blue-950 border border-blue-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.2)] shrink-0 mb-5">
                <User className="w-4 h-4 text-blue-400" />
              </div>
            )}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="flex items-end gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.2)] shrink-0">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <div className="bg-black/60 rounded-2xl rounded-bl-sm border border-white/10 backdrop-blur-xl p-5 shadow-lg">
              <div className="flex items-center gap-3 h-5">
                <div className="text-xs font-bold text-cyan-500 uppercase tracking-widest mr-2 animate-pulse">
                  Analyzing
                </div>
                <div className="flex space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-cyan-500/50 rounded-full animate-bounce"></div>
                  <div
                    className="w-1.5 h-1.5 bg-cyan-500/50 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-cyan-500/50 rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
              <span className="sr-only">Copilot is typing...</span>
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};
