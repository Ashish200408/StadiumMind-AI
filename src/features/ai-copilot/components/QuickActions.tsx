import React from 'react';
import {
  FileText,
  AlertCircle,
  Users,
  Bus,
  Accessibility,
  Leaf,
  Zap,
  Activity,
  ShieldAlert,
  Navigation,
} from 'lucide-react';

interface QuickActionsProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onSend, disabled }) => {
  const actions = [
    {
      label: 'Executive Summary',
      icon: <FileText className="w-4 h-4" />,
      text: 'Generate an Executive Summary',
    },
    {
      label: 'Incident Analysis',
      icon: <AlertCircle className="w-4 h-4" />,
      text: 'Perform an Incident Analysis',
    },
    { label: 'Crowd Forecast', icon: <Users className="w-4 h-4" />, text: 'Show Crowd Forecast' },
    {
      label: 'Transport Status',
      icon: <Bus className="w-4 h-4" />,
      text: 'Analyze Transport Status',
    },
    {
      label: 'Accessibility Review',
      icon: <Accessibility className="w-4 h-4" />,
      text: 'Conduct an Accessibility Review',
    },
    {
      label: 'Sustainability Overview',
      icon: <Leaf className="w-4 h-4" />,
      text: 'Provide a Sustainability Overview',
    },
    {
      label: 'Generate Action Plan',
      icon: <Zap className="w-4 h-4" />,
      text: 'Generate an Action Plan',
    },
    {
      label: 'Predict Next 30 Minutes',
      icon: <Activity className="w-4 h-4" />,
      text: 'Predict the Next 30 Minutes',
    },
    {
      label: 'Explain Current Risks',
      icon: <ShieldAlert className="w-4 h-4" />,
      text: 'Explain Current Risks',
    },
    {
      label: 'Resource Allocation',
      icon: <Navigation className="w-4 h-4" />,
      text: 'Recommend Resource Allocation',
    },
  ];

  return (
    <div className="flex justify-center flex-wrap gap-3 p-4 border-b border-white/10 bg-black/20">
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={() => onSend(action.text)}
          disabled={disabled}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 border border-slate-600/50 rounded-xl transition-all disabled:opacity-50 font-medium text-xs shadow-sm hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:border-cyan-500/30"
        >
          {action.icon}
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};
