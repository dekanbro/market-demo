'use client'

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { chatStorage } from '@/app/lib/db';

interface Message {
  id: string;
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

function handleToolResponse(response: ToolResponse): Omit<Message, 'id'> {
  return {
    user: 'Assistant',
    message: response.message,
    isToolResponse: true,
    status: response.success ? 'success' : 'error',
    data: response.data
  };
}

export function useChat(itemId: string, initialMessage?: string) {
  const { getAccessToken, user } = usePrivy();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentToolCall, setCurrentToolCall] = useState<{
    function?: { name: string; arguments: string };
  } | null>(null);

  // Load stored messages on mount
  useEffect(() => {
    let mounted = true;

    async function loadMessages() {
      try {
        const storedMessages = await chatStorage.getMessages(itemId);
        if (!mounted) return;

        if (storedMessages.length > 0) {
          setMessages(storedMessages);
        } else if (initialMessage) {
          const message = await chatStorage.addMessage({
            itemId,
            user: 'Assistant',
            message: initialMessage
          });
          setMessages([message]);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setIsInitialized(true);
      }
    }

    loadMessages();
    return () => { mounted = false };
  }, [itemId, initialMessage]);

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    const userMessage = await chatStorage.addMessage({
      itemId,
      user: 'You',
      message
    });
    setMessages(prev => [...prev, userMessage]);

    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      console.log("member address from use chat hook", user?.wallet?.address);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({
              role: m.user === 'You' ? 'user' : 'assistant',
              content: m.message
            })),
            {
              role: 'user',
              content: message
            }
          ],
          itemId,
          function_call: currentToolCall,
          walletAddress: user?.wallet?.address
        }),
      });

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      let accumulatedMessage = '';
      let currentAssistantMessage = '';
      let storedMessage: Message | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        accumulatedMessage += text;

        try {
          const toolResponse = JSON.parse(accumulatedMessage);
          if (toolResponse?.success !== undefined) {
            const assistantMessage = await chatStorage.addMessage({
              itemId,
              ...handleToolResponse(toolResponse)
            });
            setMessages(prev => [...prev, assistantMessage]);
            accumulatedMessage = '';
            currentAssistantMessage = '';
            storedMessage = assistantMessage;
          }
        } catch {
          if (currentAssistantMessage !== accumulatedMessage) {
            currentAssistantMessage = accumulatedMessage;
            if (!storedMessage) {
              storedMessage = await chatStorage.addMessage({
                itemId,
                user: 'Assistant',
                message: currentAssistantMessage,
                isToolResponse: false,
                status: 'success'
              });
            } else {
              // Update the message in storage
              await chatStorage.updateMessage(storedMessage.id, {
                message: currentAssistantMessage
              });
              storedMessage.message = currentAssistantMessage;
            }
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage?.user === 'Assistant' && !lastMessage.isToolResponse) {
                lastMessage.message = currentAssistantMessage;
              } else {
                newMessages.push(storedMessage!);
              }
              return newMessages;
            });
          }
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = await chatStorage.addMessage({
        itemId,
        user: 'Assistant',
        message: 'Sorry, there was an error processing your request.',
        status: 'error'
      });
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = async () => {
    await chatStorage.clearMessages(itemId);
    if (initialMessage) {
      const message = await chatStorage.addMessage({
        itemId,
        user: 'Assistant',
        message: initialMessage
      });
      setMessages([message]);
    } else {
      setMessages([]);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    clearHistory: resetChat,
    isInitialized
  };
} 