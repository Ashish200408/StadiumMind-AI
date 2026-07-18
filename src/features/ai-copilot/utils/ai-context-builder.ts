import { useIntelligenceCoreStore } from '../../intelligence-core/store/intelligence-core-store';
import { compressContext } from '../services/context-compression';
import { AIIntent } from './intent-detector';

export const buildAIContext = (intent: AIIntent): string => {
  if (intent === 'General') {
    return '';
  }

  const data = useIntelligenceCoreStore.getState().unifiedData;
  if (!data || Object.keys(data.modules).length === 0) {
    return '';
  }

  // Pass intent to compressContext to filter further
  return compressContext(data, intent);
};
