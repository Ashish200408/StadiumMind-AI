import React from 'react';
import { EmergencyDashboard } from '../components/EmergencyDashboard';

export const EmergencyIntelligencePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 pt-16">
      <EmergencyDashboard />
    </div>
  );
};
