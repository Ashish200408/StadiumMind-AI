import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

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
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-full p-8 text-center">
        <svg
          className="w-16 h-16 mb-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          ></path>
        </svg>
        <h3 className="text-xl font-medium text-white mb-2">Stadium Operations Copilot</h3>
        <p className="max-w-md">
          I am connected to the Unified Intelligence Layer. I can analyze situations, summarize
          operations, and recommend actions.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6" aria-live="polite" aria-atomic="false">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[85%] rounded-lg p-4 ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700'
            }`}
            aria-label={`${msg.role === 'user' ? 'You said:' : 'Copilot says:'}`}
          >
            {msg.role === 'user' ? (
              <p className="whitespace-pre-wrap">{msg.content}</p>
            ) : (
              <div className="text-sm prose prose-invert max-w-none">
                {renderMarkdown(msg.content)}
              </div>
            )}
            <span className="text-xs opacity-50 block mt-2">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-800 text-gray-200 rounded-lg rounded-bl-none border border-gray-700 p-4">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
            <span className="sr-only">Copilot is typing...</span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};
