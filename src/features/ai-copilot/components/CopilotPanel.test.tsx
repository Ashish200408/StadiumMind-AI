import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// jsdom doesn't support scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();
import { CopilotPanel } from './CopilotPanel';
import { BrowserRouter } from 'react-router-dom';

// Mock the AI hook
vi.mock('../hooks/useCopilot', () => ({
  useCopilot: () => ({
    messages: [
      {
        id: '1',
        role: 'ai',
        content: 'How can I help you with Stadium Operations today?',
        timestamp: new Date().toISOString(),
      },
    ],
    isLoading: false,
    isStreaming: false,
    responseMode: 'Executive Summary',
    setResponseMode: vi.fn(),
    error: null,
    sendMessage: vi.fn(),
    clearConversation: vi.fn(),
  }),
}));

describe('CopilotPanel', () => {
  it('renders the chat history and input', () => {
    render(
      <BrowserRouter>
        <CopilotPanel />
      </BrowserRouter>
    );

    // Check initial message
    expect(
      screen.getByText('How can I help you with Stadium Operations today?')
    ).toBeInTheDocument();

    // Check input is present
    expect(screen.getByPlaceholderText(/Ask AI Copilot/i)).toBeInTheDocument();
  });
});
