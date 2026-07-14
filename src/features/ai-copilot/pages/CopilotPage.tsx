import React from 'react';
import { CopilotPanel } from '../components/CopilotPanel';

export const CopilotPage: React.FC = () => {
  return (
    <div className="flex h-screen bg-black overflow-hidden pt-16">
      <div className="flex-1 max-w-4xl mx-auto w-full h-[calc(100vh-4rem)] border-x border-gray-800 shadow-2xl">
        <CopilotPanel />
      </div>
    </div>
  );
};
