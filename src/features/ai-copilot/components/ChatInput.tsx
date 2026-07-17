import React, { useState } from 'react';
import { Send, Bot } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border-t border-white/10 bg-black/40 backdrop-blur-xl"
    >
      <div className="relative flex items-center group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-500 group-hover:opacity-40"></div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI Copilot about operations..."
          className="relative w-full bg-slate-900 border border-white/10 text-white rounded-2xl pl-5 pr-14 py-4 text-sm font-medium focus:outline-none focus:border-cyan-500/50 shadow-inner resize-none custom-scrollbar transition-all"
          rows={2}
          disabled={disabled}
          aria-label="Chat input"
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="absolute right-3 p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white disabled:opacity-50 disabled:bg-transparent disabled:text-slate-500 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-4 text-center flex items-center justify-center gap-2">
        <Bot className="w-3 h-3 text-cyan-500/50" />
        Copilot relies on the Unified Intelligence Layer. It does not invent or override operational
        data.
      </div>
    </form>
  );
};
