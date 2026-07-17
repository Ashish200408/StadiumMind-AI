import { useConversationManager } from '../store/conversation-manager';

export const useCopilot = () => {
  const {
    messages,
    isLoading,
    isStreaming,
    responseMode,
    setResponseMode,
    error,
    sendMessage,
    clearConversation,
  } = useConversationManager();

  return {
    messages,
    isLoading,
    isStreaming,
    responseMode,
    setResponseMode,
    error,
    sendMessage,
    clearConversation,
  };
};
