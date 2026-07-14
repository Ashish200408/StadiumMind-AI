import { useConversationManager } from '../store/conversation-manager';

export const useCopilot = () => {
  const { messages, isLoading, error, sendMessage, clearConversation } = useConversationManager();

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearConversation,
  };
};
