"use client"

import { useChat } from '@/app/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function ChatWindow({ 
  agentName, 
  itemId, 
  initialMessage 
}: { 
  agentName: string; 
  itemId: number;
  initialMessage?: string;
}) {
  const defaultMessage = agentName === 'Summoner' 
    ? "Greetings, seeker of creation. I am the Summoner, ready to help you manifest a new agent. Shall we begin the ritual? First, I'll need a Token Symbol (3-4 characters) for your agent."
    : `Hello! I'm ${agentName}. How can I assist you today?`;

  const { messages, input, setInput, handleSubmit, isLoading } = useChat({
    initialMessages: [
      {
        id: 'initial-message',
        role: 'assistant',
        content: initialMessage || defaultMessage,
      },
    ],
    itemId: itemId
  });

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat with {agentName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === 'assistant'
                      ? 'bg-muted'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
} 