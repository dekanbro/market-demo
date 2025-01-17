import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

interface Message {
  user: string;
  message: string;
  isToolResponse?: boolean;
  status?: 'success' | 'error';
  data?: any;
}

interface ToolResponse {
  success: boolean;
  message: string;
  data?: any;
}

function handleToolResponse(response: ToolResponse): Message {
  return {
    user: 'Assistant',
    message: response.message,
    isToolResponse: true,
    status: response.success ? 'success' : 'error',
    data: response.data
  };
}

export function useChat(itemId: string, initialMessage?: string) {
  const { getAccessToken } = usePrivy();
  const [messages, setMessages] = useState<Message[]>(() => initialMessage ? [{
    user: 'Assistant',
    message: initialMessage
  }] : []);
  const [isLoading, setIsLoading] = useState(false);
  const [currentToolCall, setCurrentToolCall] = useState<{
    function?: { name: string; arguments: string };
  } | null>(null);

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    const newMessages = [...messages, { user: 'You', message }];
    setMessages(newMessages);

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          messages: newMessages.map(m => ({
            role: m.user === 'You' ? 'user' : 'assistant',
            content: m.message
          })), 
          itemId 
        }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      let accumulatedMessage = '';
      let currentAssistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        accumulatedMessage += text;

        try {
          const toolResponse = JSON.parse(accumulatedMessage);
          if (toolResponse?.success !== undefined) {
            setMessages(prev => [...prev, handleToolResponse(toolResponse)]);
            accumulatedMessage = '';
            currentAssistantMessage = '';
          }
        } catch {
          if (currentAssistantMessage !== accumulatedMessage) {
            currentAssistantMessage = accumulatedMessage;
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage?.user === 'Assistant' && !lastMessage.isToolResponse) {
                lastMessage.message = currentAssistantMessage;
              } else {
                newMessages.push({ user: 'Assistant', message: currentAssistantMessage });
              }
              return newMessages;
            });
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        user: 'Assistant', 
        message: 'Sorry, there was an error processing your request.',
        status: 'error'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    addMessage: (message: Message) => setMessages(prev => [...prev, message])
  };
} 