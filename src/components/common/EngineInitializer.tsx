import React from 'react';
import { useSimulationEngine } from '@/features/simulation/hooks/use-simulation';
import { useIntelligenceEngine } from '@/features/crowd-intelligence/hooks/useIntelligenceEngine';
import { useNavigationEngine } from '@/features/navigation-intelligence/hooks/useNavigationEngine';
import { useMobilityEngine } from '@/features/mobility-intelligence/hooks/useMobilityEngine';
import { useAccessibilityEngine } from '@/features/accessibility-intelligence/hooks/useAccessibilityEngine';
import { useSustainabilityEngine } from '@/features/sustainability-intelligence/hooks/useSustainabilityEngine';
import { useEmergencyEngine } from '@/features/emergency-intelligence/hooks/useEmergencyEngine';
import { useIntelligenceCore } from '@/features/intelligence-core/hooks/useIntelligenceCore';

export const EngineInitializer: React.FC = () => {
  // Initialize all background engines
  useSimulationEngine();
  useIntelligenceEngine();
  useNavigationEngine();
  useMobilityEngine();
  useAccessibilityEngine();
  useSustainabilityEngine();
  useEmergencyEngine();
  useIntelligenceCore();

  return null;
};
