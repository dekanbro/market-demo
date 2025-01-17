import { useState, useCallback, useRef, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth'

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface UseChatOptions {
  initialMessages?: Message[];
  itemId: number;
}

export function useChat({ initialMessages = [], itemId }: UseChatOptions) {
  const { getAccessToken } = usePrivy()
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!input.trim() || isLoading) return;

      setIsLoading(true);
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input,
      };

      setMessages((msgs) => [...msgs, userMessage]);
      setInput('');

      abortControllerRef.current = new AbortController();

      try {
        const token = await getAccessToken()
        if (!token) {
          throw new Error('Not authenticated')
        }

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            messages: [...messages, userMessage],
            itemId: itemId
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok || !response.body) throw new Error('Failed to send message');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let content = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          content += decoder.decode(value);
          setMessages((msgs) => {
            const lastMessage = msgs[msgs.length - 1];
            if (lastMessage?.role === 'assistant') {
              return [...msgs.slice(0, -1), { ...lastMessage, content }];
            }
            return [...msgs, { id: 'assistant-' + Date.now(), role: 'assistant', content }];
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Failed to send message:', error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [input, messages, isLoading, itemId, getAccessToken]
  );

  return {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
  };
} 