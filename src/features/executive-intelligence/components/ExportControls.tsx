import React, { useState } from 'react';
import { GeneratedReport } from '../types';

interface ExportControlsProps {
  report: GeneratedReport;
  onExportComplete?: (id: string, format: string) => void;
}

export const ExportControls: React.FC<ExportControlsProps> = ({ report, onExportComplete }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportMarkdown = async () => {
    setIsExporting(true);
    try {
      const blob = new Blob([report.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.type.replace(/\s+/g, '_')}_${report.id}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onExportComplete?.(report.id, 'Markdown');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // In a real implementation, we'd use html2pdf or window.print() styling
      // For this deterministic demo, we trigger a browser print dialogue tailored for PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${report.type}</title>
              <style>
                body { font-family: system-ui, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 2rem; }
                h1, h2, h3 { color: #111; }
                pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto; }
              </style>
            </head>
            <body>
              <h1>${report.type}</h1>
              <p><small>Generated: ${new Date(report.generatedTime).toLocaleString()} by ${report.generatedBy}</small></p>
              <hr/>
              <div style="white-space: pre-wrap;">${report.content}</div>
              <script>
                window.onload = () => { window.print(); window.close(); }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
      onExportComplete?.(report.id, 'PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportMarkdown}
        disabled={isExporting}
        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        title="Export as Markdown"
      >
        <span className="text-lg">📄</span> MD
      </button>
      <button
        onClick={handleExportPDF}
        disabled={isExporting}
        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        title="Export as PDF"
      >
        <span className="text-lg">🖨️</span> PDF
      </button>
    </div>
  );
};
