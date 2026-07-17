import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Sparkles, Bot, User } from 'lucide-react';

interface ChatHistoryProps {
  messages: ChatMessage[];
  isLoading: boolean;
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

export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

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
                <div className="text-sm prose prose-invert max-w-none prose-p:leading-relaxed prose-headings:text-white prose-a:text-cyan-400">
                  {renderMarkdown(msg.content)}
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
              <div className="flex space-x-2 items-center h-5">
                <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                ></div>
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
