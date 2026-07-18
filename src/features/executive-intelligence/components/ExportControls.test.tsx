import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExportControls } from './ExportControls';
import { GeneratedReport } from '../types';

// Mock browser APIs
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

const mockReport: GeneratedReport = {
  id: 'rep-1',
  type: 'Daily Operations' as any,
  generatedTime: new Date().toISOString(),
  generatedBy: 'Test',
  content: '# Hello',
  exportStatus: 'Exported' as any,
  reportSizeKb: 1,
  summary: 'Mock summary',
};

describe('ExportControls', () => {
  it('renders correctly', () => {
    render(<ExportControls report={mockReport} />);
    expect(screen.getByTitle('Export as Markdown')).toBeInTheDocument();
    expect(screen.getByTitle('Export as PDF')).toBeInTheDocument();
  });

  it('triggers Markdown export without crashing', () => {
    render(<ExportControls report={mockReport} />);
    const btn = screen.getByTitle('Export as Markdown');
    fireEvent.click(btn);
    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });
});
