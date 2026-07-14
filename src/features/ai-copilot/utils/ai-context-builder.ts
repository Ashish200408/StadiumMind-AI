import { useIntelligenceCoreStore } from '../../intelligence-core/store/intelligence-core-store';
import { compressContext } from '../services/context-compression';

export const buildAIContext = (): string => {
  const data = useIntelligenceCoreStore.getState().unifiedData;
  if (!data || Object.keys(data.modules).length === 0) {
    return '';
  }
  return compressContext(data);
};
